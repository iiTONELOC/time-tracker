import { JSX } from "preact";
import { DateSelector } from "../Inputs";
import { dateTzFromDate } from "../../utils";
import { settings, setSettings, setIsEditingSettings } from "../../signals";

export function EditStartWeek(): JSX.Element {
  const handleTimezoneChange = (newDate: string) => {
    const date = dateTzFromDate(
      new Date(newDate),
      settings.value.userWorkTimezone
    );

    setSettings({
      ...settings.value,
      week1Start: date.toISOString().split("T")[0], // YYYY-MM-DD format
    });

    setIsEditingSettings("none");
  };

  return (
    <DateSelector
      defaultValue={settings.value.week1Start}
      onChange={handleTimezoneChange}
    />
  );
}
