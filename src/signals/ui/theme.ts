import { signal } from "@preact/signals";

export type Theme = "light" | "dark" | "system";

// default theme is system
export const theme = signal<Theme>("system");

export const setTheme = (newTheme: Theme) => {
  theme.value = newTheme;
  const root = document.documentElement;
  const resolvedTheme =
    newTheme === "dark" ||
    (newTheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dark"
      : "light";

  root.classList.toggle("dark", resolvedTheme === "dark");

  localStorage.setItem("theme", newTheme);
};

export const getPreferredTheme = (): Theme => {
  const stored = localStorage.getItem("theme") as Theme | null;

  // see if we need to update the signal
  if (stored && stored !== theme.value) {
    setTheme(stored);
  }
  // return the stored value if it exists
  return stored ?? "system";
};
