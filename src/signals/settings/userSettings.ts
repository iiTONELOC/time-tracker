import { signal } from "@preact/signals";
import { figurePayPeriod } from "../../utils";
import defaultUserSettings from "../../data/default-settings.json";

export type TimeFormats = "12h" | "24h";
export type PayPeriods = "weekly" | "biweekly" | "monthly";

export type AppSettings = {
  userTimezone: string;
  userWorkTimezone: string;
  timeFormat: TimeFormats;
  payPeriod: PayPeriods;
  periodStart: string;
  periodEnd: string;
  week1Start: string;
  weekNumber: number;
};

export const defaultSettings: AppSettings = defaultUserSettings as AppSettings;

const existing = localStorage.getItem("settings");
export const settings = signal<AppSettings>(
  existing ? JSON.parse(existing) : defaultSettings
);

export const setSettings = (newSettings: AppSettings) => {
  const oldSettings = settings.value;

  if (
    oldSettings.payPeriod !== newSettings.payPeriod ||
    oldSettings.week1Start !== newSettings.week1Start
  ) {
    const updatedPayData = figurePayPeriod(newSettings);
    newSettings.periodStart = updatedPayData.start;
    newSettings.periodEnd = updatedPayData.end;
    newSettings.weekNumber = updatedPayData.weekNumber;
  }

  settings.value = newSettings;
  localStorage.setItem("settings", JSON.stringify(newSettings));
};

export const getPreferredSettings = (): AppSettings => {
  const stored = localStorage.getItem("settings");

  if (stored && stored !== JSON.stringify(settings.value)) {
    setSettings(JSON.parse(stored) as AppSettings);
  }

  return stored ? JSON.parse(stored) : defaultSettings;
};
