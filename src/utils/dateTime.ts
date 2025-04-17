import { AppSettings } from "../signals";

export const NUM_MS_IN_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export type DateStyle = "full" | "long" | "medium" | "short" | undefined;

export const timezoneUtcOffsets: {
  [key: string]: string;
} = {
  "America/New_York": "-05",
  "America/Chicago": "-06",
  "America/Denver": "-07",
  "America/Phoenix": "-07",
  "America/Los_Angeles": "-08",
  "America/Anchorage": "-09",
  "Pacific/Honolulu": "-10",
  "Pacific/Pago_Pago": "-11",
  "Pacific/Guam": "10",
};

export const timezoneUtcDstOffsets: {
  [key: string]: string;
} = {
  "America/New_York": "-04",
  "America/Chicago": "-05",
  "America/Denver": "-06",
  "America/Phoenix": "-07", // Arizona does not observe DST
  "America/Los_Angeles": "-07",
  "America/Anchorage": "-08",
  "Pacific/Honolulu": "-10", // Hawaii does not observe DST
  "Pacific/Pago_Pago": "-11", // Samoa does not observe DST
  "Pacific/Guam": "10", // Guam does not observe DST
};

export const timezoneAbbreviations: {
  [key: string]: string;
} = {
  "America/New_York": "EST",
  "America/Chicago": "CST",
  "America/Denver": "MST",
  "America/Phoenix": "MST",
  // Arizona does not observe DST
  "America/Los_Angeles": "PST",
  "America/Anchorage": "AKST",
  // Alaska does not observe DST
  "Pacific/Honolulu": "HST",
  // Hawaii does not observe DST
  "Pacific/Pago_Pago": "SST",
  // Samoa Standard Time
  "Pacific/Guam": "ChST",
};

export const timezoneAbbreviationsDst: {
  [key: string]: string;
} = {
  "America/New_York": "EDT",
  "America/Chicago": "CDT",
  "America/Denver": "MDT",
  "America/Phoenix": "MST",
  // Arizona does not observe DST
  "America/Los_Angeles": "PDT",
  "America/Anchorage": "AKDT",
  // Alaska does not observe DST
  "Pacific/Honolulu": "HST",
  // Hawaii does not observe DST
  "Pacific/Pago_Pago": "SDT",
  // Samoa Daylight Time
  "Pacific/Guam": "ChST",
  // Guam Standard Time
};

export const getTimezoneAbbreviation = (timezone: string): string => {
  const currentDate = new Date();
  const isDst = currentDate
    .toLocaleString("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    })
    .includes("DT");

  return isDst
    ? timezoneAbbreviationsDst[timezone]
    : timezoneAbbreviations[timezone];
};

export const payPeriodDays: Record<"weekly" | "biweekly" | "monthly", number> =
  {
    weekly: 6,
    biweekly: 14,
    monthly: 29,
  };

/**
 * Convert a date string in the format YYYY-MM-DD to a Date object.
 * @param date - The date string to be converted.
 * @param timezone - The timezone to be used.
 * @returns The Date object.
 */
export const dateTzFromYYYYMMDD = (date: string, timezone: string) => {
  const isDaylightSavingTime = new Date(date)
    .toLocaleString("en-US", {
      timeZone: timezone,
    })
    .includes("DT");
  const map = isDaylightSavingTime ? timezoneUtcDstOffsets : timezoneUtcOffsets;
  return new Date(`${date}T00:00:00.000${map[timezone]}:00`);
};

export const dateTzFromDate = (date: Date, timezone: string) => {
  const isDaylightSavingTime = new Date(Date.now())
    .toLocaleString("en-US", {
      timeZone: timezone,
    })
    .includes("DT");
  const map = isDaylightSavingTime ? timezoneUtcDstOffsets : timezoneUtcOffsets;

  return new Date(
    `${date
      // needs to be a tz within the same dateline as work timezone
      .toLocaleDateString("en-CA", { timeZone: "UTC" })
      .replace(/-/g, "-")}T00:00:00.000${map[timezone]}:00`
  );
};
/**
 * Convert a YYYY-MM-DD date string to MM-DD-YYYY format.
 * @param date - The date string to be normalized.
 * @returns  The normalized date string.
 */
export const normalizeDate = (date: string) => {
  const sep = date.includes("/") ? "/" : "-";
  const [year, month, day] = date.split(sep);
  return `${month}-${day}-${year}`;
};

export const normalizeDateToYYYYMMDD = (date: string) => {
  const sep = date.includes("/") ? "/" : "-";
  const [month, day, year] = date.split(sep);
  return `${year}-${month}-${day}`;
};

/**
 * Get the localized time string for a given Date object and timezone.
 * @param date - The Date object to be converted.
 * @param timezone - The timezone to be used.
 * @returns The localized time string in "short" format.
 */
export const getTimeLocaleString = (
  date: Date,
  timezone: string,
  timeFormat: "12h" | "24h"
) => {
  return date.toLocaleTimeString("en-US", {
    timeZone: timezone,
    timeStyle: "short",
    hour12: timeFormat === "12h",
  });
};

/**
 * Get the localized date string for a given Date object and timezone.
 * @param date - The Date object to be converted.
 * @param timezone - The timezone to be used.
 * @returns The localized date string in "short" format.
 */
export const getDateLocaleString = (
  date: Date,
  timezone: string,
  dateStyle: DateStyle = "long"
) => {
  return date.toLocaleDateString("en-US", {
    timeZone: timezone,
    dateStyle,
  });
};

/**
 *
 * @returns Current date and time in UTC format from Date.now()
 */
export const now = (): Date => new Date(Date.now());

export const dateTo_HH_MM_SS = (date: Date | undefined): string => {
  if (!date) return "";
  const _date = new Date(date);
  const hours = _date.getHours();
  const minutes = _date.getMinutes();
  const seconds = _date.getSeconds();

  // ensure the hours, minutes, and seconds are always two digits
  const _hours = hours < 10 ? `0${hours}` : hours;
  const _minutes = minutes < 10 ? `0${minutes}` : minutes;
  const _seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${_hours}:${_minutes}:${_seconds}`;
};

/**
 * Retrieves the current time data for the user's timezone and their work timezone.
 *
 * @param userTimezone - The timezone of the user in IANA format (e.g., "America/New_York").
 * @param userWorkTimezone - The timezone of the user's workplace in IANA format.
 * @returns An object containing the current time in the user's timezone (`userTime`)
 *          and the current time in the user's work timezone (`workTime`).
 */
export const getTimeData = (
  userTimezone: string,
  userWorkTimezone: string,
  timeFormat: "12h" | "24h"
) => {
  const userTime = getTimeLocaleString(now(), userTimezone, timeFormat);
  const workTime = getTimeLocaleString(now(), userWorkTimezone, timeFormat);
  return { userTime, workTime };
};

// Convert a time string to a valid "HH:mm" format.
export const convertToTimeInputFormat = (timeString: string): string => {
  const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i;
  const match = timeRegex.exec(timeString);

  if (!match) {
    console.warn("Invalid time string:", timeString);
    return "00:00";
  }

  let [_, hourStr, minuteStr, meridian] = match;
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  // Convert to 24-hour format if necessary
  if (meridian?.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (meridian?.toUpperCase() === "AM" && hours === 12) hours = 0;

  const _hours = hours < 10 ? `0${hours}` : `${hours}`;
  const _minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  const formattedTime = `${_hours}:${_minutes}`;
  return formattedTime;
};

/**
 * Calculate elapsed time between two times (in the same day) in a specific timezone.
 * @param date - The date of the event (YYYY-MM-DD)
 * @param startTime - Start time (HH:mm or HH:mm:ss)
 * @param endTime - End time (HH:mm or HH:mm:ss)
 * @param timezone - IANA timezone string (e.g. "America/Denver")
 * @returns Elapsed time in hours, fixed to 4 decimal places
 */
export const getElapsedTimeWithOffset = (
  date: string,
  startTime: string,
  endTime: string,
  timezone: string
): string => {
  const offsetStr = timezoneUtcOffsets[timezone];

  if (!offsetStr) {
    throw new Error(`Unknown timezone: ${timezone}`);
  }

  const offset = parseInt(offsetStr, 10); // "-07" => -7

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  // Convert to UTC by removing local timezone offset
  const startUtc = start.getTime() + start.getTimezoneOffset() * 60000;
  const endUtc = end.getTime() + end.getTimezoneOffset() * 60000;

  // Apply user-specified timezone offset in milliseconds
  const startTz = startUtc + offset * 3600000;
  const endTz = endUtc + offset * 3600000;

  const elapsed = endTz - startTz;

  return (elapsed / 3600000).toFixed(4);
};

export const removeSeconds = (time: string) => {
  const timeParts = time.split(":");
  const meridian = timeParts[2].slice(-2); // AM or PM
  return `${timeParts[0]}:${timeParts[1]} ${meridian}`;
};

export const figurePayPeriod = (
  settings: AppSettings
): {
  weekNumber: number;
  start: string;
  end: string;
} => {
  const { payPeriod, week1Start, userWorkTimezone } = settings;
  const periodLength = payPeriodDays[payPeriod as keyof typeof payPeriodDays];

  // Get the start date of week 1 and set its time to the beginning of the day
  const week1StartDate = dateTzFromYYYYMMDD(week1Start, userWorkTimezone);
  week1StartDate.setHours(0, 0, 0, 0);

  // Get today's date and set its time to the beginning of the day
  const today = dateTzFromDate(new Date(), userWorkTimezone);
  today.setHours(0, 0, 0, 0);

  // Calculate the number of days elapsed since the start of week 1
  const elapsedDays = Math.floor(
    (today.getTime() - week1StartDate.getTime()) / NUM_MS_IN_DAY
  );

  // Adjust the current period index to align with the start of the pay period
  const currentPeriodIndex = Math.floor((elapsedDays + 1) / periodLength);

  // Calculate the start and end dates of the current pay period
  const periodStart = new Date(
    week1StartDate.getTime() + currentPeriodIndex * periodLength * NUM_MS_IN_DAY
  );
  periodStart.setHours(0, 0, 0, 0);

  const periodEnd = new Date(
    periodStart.getTime() + (periodLength - 1) * NUM_MS_IN_DAY
  );
  periodEnd.setHours(0, 0, 0, 0);

  // Calculate the current week number
  const weekNumber = Math.floor((elapsedDays - 7) / 7) + 1;

  return {
    weekNumber,
    start: periodStart.toISOString().split("T")[0],
    end: periodEnd.toISOString().split("T")[0],
  };
};
