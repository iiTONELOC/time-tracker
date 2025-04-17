/**
 * Remove new lines and extra spaces from a string.
 * @param text - The string to be cleaned.
 * @returns The cleaned string.
 */
export const stripExtra = (text: string) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" ");
};

/**
 * Capitalize the first letter of a string.
 * @param text - The string to be capitalized.
 * @returns The capitalized string.
 */
export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getLocalStorageInt = (key: string, defaultValue: number) => {
  const value = localStorage.getItem(key);
  if (!value) localStorage.setItem(key, defaultValue.toString());
  return value ? parseInt(value) : defaultValue;
};

export * from "./crypto";
export * from "./dateTime";
export * from "./genReport";
export * from "./localStorageSecure";
