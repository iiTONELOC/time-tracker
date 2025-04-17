import { JSX } from "preact";
import { TimezoneType } from "../Settings/EditTimezone";
import { OptionType, InputSelector } from "./InputSelector";

export const zones: OptionType[] = [
  { value: "America/New_York", label: "Eastern Time (EST/EDT)" },
  { value: "America/Chicago", label: "Central Time (CST/CDT)" },
  { value: "America/Denver", label: "Mountain Time (MST/MDT)" },
  { value: "America/Phoenix", label: "Mountain Time - No DST (MST)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PST/PDT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKST/AKDT)" },
  { value: "Pacific/Honolulu", label: "Hawaii-Aleutian Time (HST)" },
  { value: "Pacific/Pago_Pago", label: "Samoa Time (SST)" },
  { value: "Pacific/Guam", label: "Chamorro Time (CHST)" },
];

export type TimezonePickerProps = {
  type: TimezoneType;
  defaultValue: string;
  onChange: (value: string) => void;
};

export function TimezonePicker(
  props: Readonly<TimezonePickerProps>
): JSX.Element {
  const { defaultValue, onChange } = props;

  return (
    <InputSelector
      options={zones}
      onChange={onChange}
      defaultValue={defaultValue}
    />
  );
}
