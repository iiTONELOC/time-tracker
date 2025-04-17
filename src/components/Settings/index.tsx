import { stripExtra } from "../../utils";
import { JSX } from "preact/jsx-runtime";
import { ThemeToggle } from "./ThemeToggle";
import { UserSettings } from "./UserSettings";
import {
  showSettings,
  setShowSettings,
  toggleShowSettings,
} from "../../signals";

const classes = {
  button: ` text-xl flex items-center justify-center px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700
           hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md focus:outline-none fixed bottom-4 right-4 z-60`,
  modalOverlay: `bg-gray-800/70 dark:bg-black/40 bg-opacity-50 z-40 min-h-screen flex flex-col justify-center items-center py-6 w-full`,
  modal: `flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-auto
   w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] `,
  modalHeader: `flex flex-row w-full justify-between items-center mb-4`,
  modalTitle: `text-xl font-semibold text-gray-900 dark:text-gray-100`,
  closeButton: `text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
   focus:outline-none`,
};

export function Settings(): JSX.Element {
  return (
    <>
      {/* Settings Gear Button */}
      <button
        title={"Settings"}
        onClick={toggleShowSettings}
        aria-label="Open settings modal"
        class={stripExtra(classes.button)}
      >
        ⚙️
      </button>

      {/* Modal */}
      {showSettings.value && (
        <>
          {/* Modal Overlay */}
          <div // NOSONAR
            class={classes.modalOverlay}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Content */}
            <article //NOSONAR
              class={stripExtra(classes.modal)}
            >
              <div class={classes.modalHeader}>
                <h2 class={classes.modalTitle}>App Settings</h2>
                <button
                  title={"Close"}
                  onClick={() => setShowSettings(false)}
                  aria-label="Close settings modal"
                  class={stripExtra(classes.closeButton)}
                >
                  ✖
                </button>
              </div>

              <ThemeToggle />
              <UserSettings />
            </article>
          </div>
        </>
      )}
    </>
  );
}
