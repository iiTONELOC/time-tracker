import {
  passwordSet,
  isAuthenticated,
  setIsAuthenticated,
} from "./authentication";
import { getLocalStorageInt } from "../../utils";
import { effect, signal } from "@preact/signals";

export const MIN_PASSWORD_LENGTH = 15;
export const MAX_PASSWORD_ATTEMPTS = 5;
export const NUM_MS_IN_MINUTE = 60 * 1000; // 1 minute in milliseconds
export const COOL_DOWN_GROWTH_RATE = 1.5; // 50% increase in cool down time for each failed attempt
export const COOL_DOWN_TIME_MS = 1 * NUM_MS_IN_MINUTE; // 5 minutes
export const SESSION_DURATION_MS = 5 * NUM_MS_IN_MINUTE; // 5 minutes timeout - todo:make configurable

let clockInterval: NodeJS.Timeout | null = null;
let sessionTimeoutInterval: NodeJS.Timeout | null = null;

export const getStorageLockoutTime = () => getLocalStorageInt("lockoutTime", 0); // Reading remaining time
export const getStoragePasswordAttempts = () =>
  getLocalStorageInt("passwordAttempts", 0);
export const getStorageSessionStartTime = () =>
  getLocalStorageInt("sessionStartTime", 0);

const sessionKey = signal<CryptoKey>({} as CryptoKey);
export const lockoutTime = signal<number>(getStorageLockoutTime()); // Your original name - represents remaining time
export const passwordAttempts = signal<number>(getStoragePasswordAttempts());
export const sessionStartTime = signal<number>(getStorageSessionStartTime()); // New signal for session start

const isLockoutActive = signal<boolean>(lockoutTime.value > 0);

/* Setters */
export const setLockoutTime = (timeRemaining: number) => {
  lockoutTime.value = timeRemaining;
  localStorage.setItem("lockoutTime", timeRemaining.toString()); // Storing remaining time
  isLockoutActive.value = timeRemaining > 0;
};

export const setPasswordAttempts = (attempts: number) => {
  passwordAttempts.value = attempts;
  localStorage.setItem("passwordAttempts", attempts.toString());
};
export const resetPasswordAttempts = () => setPasswordAttempts(0);

export const setSessionStartTime = (startTime: number) => {
  sessionStartTime.value = startTime;
  localStorage.setItem("sessionStartTime", startTime.toString());
};
export const resetSessionStartTime = () => setSessionStartTime(0);

export const setSessionKey = (key: CryptoKey) => (sessionKey.value = key);

export async function withSessionKey<T>(
  fn: (key: CryptoKey) => Promise<T>
): Promise<T> {
  if (!sessionKey.value && isLockoutActive.value) {
    console.error("Session key is not set or user is not authenticated");
    return await fn({} as CryptoKey);
  }
  return await fn(sessionKey.value);
}

const handleLogout = () => {
  console.log("Session timed out due to inactivity - logging out.");
  setIsAuthenticated(false);
  setSessionStartTime(0);
  removeActivityListeners();
  sessionTimeoutInterval && clearInterval(sessionTimeoutInterval);
};

// Function to reset the session start time on user activity
const resetSessionTimer = () => {
  if (sessionStartTime.value > 0 && isAuthenticated.value) {
    setSessionStartTime(Date.now());
  }
};

// Function to add event listeners for user activity
const addActivityListeners = () => {
  window.addEventListener("mousemove", resetSessionTimer);
  window.addEventListener("keydown", resetSessionTimer);
  // You can add more event listeners as needed (e.g., scroll, click)
};

// Function to remove event listeners for user activity
const removeActivityListeners = () => {
  window.removeEventListener("mousemove", resetSessionTimer);
  window.removeEventListener("keydown", resetSessionTimer);
};

/* Effects */

// Initialize lockout status and remaining time from local storage
effect(() => {
  const initialRemaining = getStorageLockoutTime();
  lockoutTime.value = initialRemaining;
  isLockoutActive.value = initialRemaining > 0;
  sessionStartTime.value = getStorageSessionStartTime();
});

// // Set authenticated status

effect(() => {
  setIsAuthenticated(
    passwordAttempts.value === 0 && !isLockoutActive.value && passwordSet.value
  );
});

// manage session timer on successful login/logout
effect(() => {
  if (
    passwordAttempts.value === 0 &&
    !isLockoutActive.value &&
    passwordSet.value
  ) {
    console.log("User logged in - starting active session.");
    setSessionStartTime(Date.now());
    addActivityListeners();
    // Start the session timeout check interval if not already running
    if (/*NOSONAR*/ !sessionTimeoutInterval) {
      sessionTimeoutInterval = setInterval(() => {
        if (
          sessionStartTime.value > 0 &&
          Date.now() > sessionStartTime.value + SESSION_DURATION_MS
        ) {
          handleLogout();
        }
      }, 1000); // Check every second
    }
  } else if (!passwordSet.value) {
    // Clear session start time and interval on logout or authentication reset
    resetSessionStartTime();
    removeActivityListeners();
    if (sessionTimeoutInterval) {
      clearInterval(sessionTimeoutInterval);
      sessionTimeoutInterval = null;
    }
  }
});

// Set a cooldown every time we have a bad attempt over the max
effect(() => {
  if (
    passwordAttempts.value >= MAX_PASSWORD_ATTEMPTS &&
    !isLockoutActive.peek()
  ) {
    const numFailedAttemptsOverLimit =
      passwordAttempts.value - MAX_PASSWORD_ATTEMPTS;
    const coolDownDuration =
      COOL_DOWN_TIME_MS *
      Math.pow(COOL_DOWN_GROWTH_RATE, numFailedAttemptsOverLimit);

    console.warn(
      "MAX PASSWORD TRIES REACHED - Setting Lockout for:",
      coolDownDuration / 1000 / 60,
      "minutes"
    );

    setLockoutTime(coolDownDuration); // Set the DURATION
  }
});

// Manage the lockout timer
effect(() => {
  if (isLockoutActive.value && !clockInterval) {
    clockInterval = setInterval(() => {
      const newRemainingTime = lockoutTime.value - 1000;
      if (newRemainingTime <= 0) {
        clearInterval(clockInterval!);
        clockInterval = null;
        setLockoutTime(0);
        console.log("Lockout period ended.");
      } else {
        setLockoutTime(newRemainingTime);
      }
    }, 1000);
  } else if (!isLockoutActive.value && clockInterval !== null) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
});
