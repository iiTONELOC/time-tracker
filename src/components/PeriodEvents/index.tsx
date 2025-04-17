import { JSX } from "preact/jsx-runtime";
import { DailyEventCard } from "./DailyCard";
import { useEffect, useState } from "preact/hooks";
import { decryptData, NonEncryptedEvent } from "../../utils";
import { encryptedEvents, getPassword, isAuthenticated } from "../../signals";

type DecryptedEvents = {
  [key: string]: {
    event: NonEncryptedEvent;
  }[];
};

export function PeriodEvents(): JSX.Element {
  const [groupedEvents, setGroupedEvents] = useState<DecryptedEvents>({});

  const groupEvents = async () => {
    // Recalculate groupedEvents whenever decryptedEvents changes
    const newGroupedEvents = await Object.entries(encryptedEvents.value).reduce(
      async (accPromise, [key, events]) => {
        const acc = await accPromise;
        const dateKey = key.split("$")[0]; // Extract the date

        // see if there are events for the day
        if (Object.keys(events).length > 0) {
          acc[dateKey] = acc[dateKey] || [];

          // decrypt dailies
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

    setGroupedEvents(newGroupedEvents);
  };

  useEffect(() => {
    (async () => await groupEvents())();
  }, [encryptedEvents.value]);

  return isAuthenticated.value ? (
    <div className="w-[95%] flex flex-col items-center justify-start m-auto">
      {Object.entries(groupedEvents).map(([baseDate, events]) => (
        <DailyEventCard key={baseDate} events={events} baseDate={baseDate} />
      ))}
    </div>
  ) : (
    <></>
  );
}
