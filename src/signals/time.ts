import { getTimeData } from "../utils";
import { settings } from "./settings/userSettings";
import { effect, batch, signal } from "@preact/signals";

export const userTime = signal<string>("");
export const workTime = signal<string>("");

let clockInterval: NodeJS.Timeout | null = null; // Store the interval ID

// Create an effect to update signals when settings change
effect(() => {
  const { userTimezone, userWorkTimezone, timeFormat } = settings.value;

  // update UI 1x
  batch(() => {
    const timeData = getTimeData(userTimezone, userWorkTimezone, timeFormat);
    userTime.value = timeData.userTime;
    workTime.value = timeData.workTime;
  });
});

// Provide a function to work as a clock and update the times
export const startClock = () => {
  // Clear any existing interval before starting a new one
  if (clockInterval) {
    clearInterval(clockInterval);
  }

  clockInterval = setInterval(() => {
    const { userTimezone, userWorkTimezone, timeFormat } = settings.peek();

    const timeData = getTimeData(userTimezone, userWorkTimezone, timeFormat);
    batch(() => {
      userTime.value = timeData.userTime;
      workTime.value = timeData.workTime;
    });
  }, 1000);

  // Return a cleanup function to clear the interval
  return () => {
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  };
};

export const clearClock = () => {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
};
