import {
  reportType,
  getPassword,
  reportData,
  isAuthenticated,
  encryptedEvents,
  DecryptedEvents,
} from "../../signals";
import { batch } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { DailyEventCard } from "./DailyCard";
import { useEffect, useState } from "preact/hooks";
import { decryptData, NonEncryptedEvent } from "../../utils";

export function PeriodEvents(): JSX.Element {
  const [groupedEvents, setGroupedEvents] = useState<DecryptedEvents>({});
  const groupEvents = async () => {
    const newGroupedEvents = await Object.entries(encryptedEvents.value).reduce(
      async (accPromise, [key, events]) => {
        const acc = await accPromise;
        const dateKey = key.split("$")[0];

        if (Object.keys(events).length > 0) {
          acc[dateKey] = acc[dateKey] || [];

          const decryptedEvents = await Promise.all(
            Object.values(events).map(async (event: string) => {
              const decryptedData = await decryptData(
                event,
                await getPassword()
              );
              return { event: JSON.parse(decryptedData) as NonEncryptedEvent };
            })
          );

          acc[dateKey] = [...(acc[dateKey] || []), ...decryptedEvents];
        }
        return acc;
      },
      Promise.resolve({} as Record<string, { event: NonEncryptedEvent }[]>)
    );

    // Sort events within each day by event.time descending
    for (const date in newGroupedEvents) {
      newGroupedEvents[date].sort((a, b) => {
        const aTime = new Date(
          `${date}T${a.event.startTime || "00:00"}`
        ).getTime();
        const bTime = new Date(
          `${date}T${b.event.startTime || "00:00"}`
        ).getTime();
        return bTime - aTime;
      });
    }

    // Sort the grouped days by date descending
    const sortedGroupedEvents: DecryptedEvents = Object.fromEntries(
      Object.entries(newGroupedEvents).sort(([dateA], [dateB]) => {
        return new Date(dateB).getTime() - new Date(dateA).getTime(); // descending
      })
    );

    setGroupedEvents(sortedGroupedEvents);
  };

  useEffect(() => {
    (async () => await groupEvents())();
  }, [encryptedEvents.value]);

  useEffect(() => {
    if (reportType.value !== "none") {
      batch(() => {
        reportData.value = groupedEvents;
        reportType.value = "none";
      });
    }
  }, [reportType.value]);

  return isAuthenticated.value ? (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full flex flex-col justify-center items-center gap-6  mb-6">
        {Object.entries(groupedEvents).map(([baseDate, events]) => (
          <DailyEventCard key={baseDate} events={events} baseDate={baseDate} />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}
