import {
  setTheme,
  startClock,
  setSettings,
  isAuthenticated,
  getPreferredTheme,
  getPreferredSettings,
  getStorageLockoutTime,
  getStoragePasswordAttempts,
  getStorageSessionStartTime,
} from "./signals";
import {
  Settings,
  InfoHeader,
  NewEntryForm,
  PeriodEvents,
  LockScreen,
  GenerateReportButton,
} from "./components";
import { batch } from "@preact/signals";
import { useEffect } from "preact/hooks";

function initializeSettings() {
  batch(() => {
    startClock();
    getStorageLockoutTime();
    getStorageSessionStartTime();
    getStoragePasswordAttempts();
    setTheme(getPreferredTheme());
    setSettings(getPreferredSettings());
  });
}

export function App() {
  useEffect(() => {
    initializeSettings();
  }, []);

  return (
    <main class="bg-gray-200 text-black dark:bg-gray-900 dark:text-white min-h-screen w-full flex flex-col items-center justify-start">
      {!isAuthenticated.value ? (
        <LockScreen />
      ) : (
        <>
          <InfoHeader />
          <Settings />
          <GenerateReportButton />
          <NewEntryForm />
          <PeriodEvents />
        </>
      )}
    </main>
  );
}
