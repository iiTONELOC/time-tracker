import {
  lockoutTime,
  setPassword,
  setLockoutTime,
  passwordAttempts,
  MIN_PASSWORD_LENGTH,
  setPasswordAttempts,
  setIsAuthenticated,
} from "../../signals";
import { batch } from "@preact/signals";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { sha256Hash } from "../../utils";
import { useIsMounted } from "../../hooks";

export function LockScreen(): JSX.Element {
  const isMounted = useIsMounted();
  const [thisPassword, setThisPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    /* look for existing hash */
    const existingHash = localStorage.getItem("passHash");
    const input = document.getElementById("password");

    try {
      if (existingHash) {
        // see if the hash matches
        const newHash = await sha256Hash(thisPassword);
        if (newHash != existingHash) throw new Error("Incorrect Password!");
      }
      // hashes match or a new password is being set
      if (thisPassword.length < MIN_PASSWORD_LENGTH) {
        setPasswordError(
          `Passwords must be at least ${MIN_PASSWORD_LENGTH} characters long.`
        );

        // set a timeout to clear the error message after 5 seconds
        setTimeout(() => {
          setPasswordError("");
        }, 5000);

        setThisPassword("");
        input?.focus();
        return;
      }

      const success = await setPassword(thisPassword);
      if (!success) throw new Error("Unable to set password!");
      batch(() => {
        setLockoutTime(0);
        setPasswordAttempts(0);
        setThisPassword("");
        setIsAuthenticated(true);
      });

      return;
    } catch (error) {
      console.error(`Error signing in: ${error}`);
      setPasswordError("Invalid password, please try again!");
      setPasswordAttempts(passwordAttempts.value + 1);
      setThisPassword("");
      input?.focus();
      setTimeout(() => {
        setPasswordError("");
      }, 5000);
      return;
    }
  };

  const handleOnInput = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLInputElement | null;
    if (target) {
      setThisPassword(target.value);
    }
  };

  const remaining =
    lockoutTime.value > 0 ? Math.ceil(lockoutTime.value / 1000) : 0;

  const timeRemaining =
    remaining < 60 // 60 seconds in a minute
      ? `${remaining} ${remaining === 1 ? "second" : "seconds"}`
      : `${Math.ceil(remaining / 60)} ${
          Math.ceil(remaining / 60) === 1 ? "minute" : "minutes"
        }`;

  return isMounted ? (
    <div className="fixed inset-0 bg-gray-300 dark:bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2 text-center text-gray-900 dark:text-white">
          Enter Password
        </h2>
        {lockoutTime.value > 0 ? (
          <p className="text-red-500 text-center">
            Too many failed attempts. Please wait {timeRemaining}.
          </p>
        ) : (
          <form>
            {passwordError && (
              <p className="text-red-500 text-sm text-center my-2">
                {passwordError}
              </p>
            )}
            {passwordAttempts.value > 0 && (
              <p className="text-red-500 text-sm text-center mb-2">
                Invalid password ({passwordAttempts})
              </p>
            )}
            <input
              name="password"
              type="password"
              value={thisPassword}
              onInput={handleOnInput}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />

            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded shadow"
            >
              Unlock
            </button>
          </form>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
