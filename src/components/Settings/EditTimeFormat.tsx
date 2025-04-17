import { JSX } from "preact";
import {
  settings,
  setSettings,
  TimeFormats,
  setIsEditingSettings,
} from "../../signals";
import { InputSelector } from "../Inputs";

export function EditTimeFormat(): JSX.Element {
  const handleTimeFormatChange = (format: string) => {
    setSettings({
      ...settings.value,
      timeFormat: format as TimeFormats,
    });

    setIsEditingSettings("none");
  };

  return (
    <InputSelector
      options={[
        { value: "12h", label: "12-hour format" },
        { value: "24h", label: "24-hour format" },
      ]}
      onChange={handleTimeFormatChange}
      defaultValue={settings.value.timeFormat}
    />
  );
}
