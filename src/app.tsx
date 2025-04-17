import {
  setTheme,
  startClock,
  setSettings,
  showSettings,
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
    <main class="bg-gray-200 text-black dark:bg-gray-900 dark:text-white min-h-screen ">
      {!isAuthenticated.value ? (
        <LockScreen />
      ) : (
        <>
          <InfoHeader />
          <Settings />
          {!showSettings.value && (
            <>
              <NewEntryForm />
              <PeriodEvents />
            </>
          )}
        </>
      )}
    </main>
  );
}
