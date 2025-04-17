import { signal } from "@preact/signals";

export type EditableUserSetting =
  | "userTimezone"
  | "userWorkTimezone"
  | "timeFormat"
  | "payPeriod"
  | "week1Start"
  | "none";

export const isEditingSettings = signal<EditableUserSetting>("none");

export const setIsEditingSettings = (value: EditableUserSetting) => {
  isEditingSettings.value = value;
};
