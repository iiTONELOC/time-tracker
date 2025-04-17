import { JSX } from "preact/jsx-runtime";
import { theme, setTheme } from "../../signals";
import { capitalize, stripExtra } from "../../utils";

const classes = {
  icon: "text-2xl mr-6",
  label: "text-lg mr-2",
  title: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2",
  container: `w-full flex flex-wrap flex-row items-center justify-between  p-4 bg-gray-100 
              rounded-md dark:bg-gray-900`,
  button: `flex items-center justify-center px-3 py-2 rounded-md bg-white dark:bg-gray-700
           hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-md focus:outline-none
           focus:ring-2 focus:ring-indigo-500 dark:focus:ring-emerald-500 w-32`,
};

export function ThemeToggle(): JSX.Element {
  const icon = {
    light: "🌞",
    dark: "🌚",
    system: "💻",
  }[theme.value];

  const toggleTheme = () => {
    switch (theme.value) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      default:
        setTheme("light");
        break;
    }
  };

  return (
    <article class={classes.container}>
      <h3 class={classes.title}>Theme:</h3>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${
          theme.value === "light"
            ? "dark"
            : theme.value === "dark"
            ? "system"
            : "light"
        } mode`}
        class={stripExtra(classes.button)}
      >
        <p className={classes.icon}>{icon}</p>
        <p className={classes.label}>{capitalize(theme.value)}</p>
      </button>
    </article>
  );
}
