import { JSX } from "preact";
import { TimezonePicker } from "../Inputs/index";
import { settings, setSettings, setIsEditingSettings } from "../../signals";

export type TimezoneType = "userTimezone" | "userWorkTimezone";
export type TimeZoneSettingProps = {
  timezoneType: TimezoneType;
};

export function EditTimezone(
  props: Readonly<TimeZoneSettingProps>
): JSX.Element {
  const handleTimezoneChange = (newTimezone: string) => {
    setSettings({
      ...settings.value,
      [props.timezoneType]: newTimezone,
    });

    setIsEditingSettings("none");
  };

  return (
    <TimezonePicker
      type={props.timezoneType}
      onChange={handleTimezoneChange}
      defaultValue={settings.value[props.timezoneType]}
    />
  );
}
