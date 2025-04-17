import { signal } from "@preact/signals";

export const showSettings = signal<boolean>(false);

export const setShowSettings = (value: boolean) => {
  showSettings.value = value;
};

export const toggleShowSettings = () => {
  showSettings.value = !showSettings.value;
};
