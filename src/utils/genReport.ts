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
function formatElapsed(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function roundHours(minutes: number): string {
  return (minutes / 60).toFixed(4); // 4 decimal places
}

export function generateReportText(decryptedEvents: DecryptedEvents): string {
  let result = "";

  for (const date in decryptedEvents) {
    const dayEvents = decryptedEvents[date].map((e) => e.event);

    const totalMinutes = dayEvents.reduce(
      (sum, event) => sum + (event.elapsedTime ?? 0),
      0
    );

    const readable = formatElapsed(totalMinutes);
    const precise = roundHours(totalMinutes);

    result += `● ${getDayAndDate(date)} — Total: ${readable} (${precise}h)\n`;

    for (const event of dayEvents) {
      const note = (event.note || "").trim().replace(/\s+/g, " ");
      const timeRange = formatTimeRange(event.startTime, event.endTime);
      result += `  ○ ${note}. (MST): ${timeRange}\n`;
    }

    result += "\n";
  }

  return result.trim();
}
