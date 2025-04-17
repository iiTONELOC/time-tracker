import { NonEncryptedEvent } from "./localStorageSecure";

type DecryptedEvents = {
  [key: string]: {
    event: NonEncryptedEvent;
  }[];
};

function formatTimeRange(start: string, end: string): string {
  // Assumes time strings like "15:30" or "3:55 PM"
  const format = (t: string) =>
    new Date(`1970-01-01T${t}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Denver", // MST
    });
  return `${format(start)} - ${format(end)}`;
}

function getDayAndDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "numeric",
    day: "2-digit",
    year: "2-digit",
  })}`;
}

export function generateReportText(decryptedEvents: DecryptedEvents): string {
  let result = "";
  // Sort days chronologically
  const sortedDays = Object.keys(decryptedEvents).sort(
    (a, b) =>
      new Date(a.split("$")[0]).getTime() - new Date(b.split("$")[0]).getTime()
  );

  for (const date of sortedDays) {
    const dayEvents = decryptedEvents[date]
      .map((e) => e.event)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    result += `● ${getDayAndDate(date)}\n`;

    for (const event of dayEvents) {
      const note = event.note.trim().replace(/\s+/g, " ");
      const timeRange = formatTimeRange(event.startTime, event.endTime);
      result += `  ○ ${note}. (MST): ${timeRange}\n`;
    }

    result += "\n";
  }
  return result.trim();
}
