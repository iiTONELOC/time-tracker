import { JSX } from "preact";
import { InputSelector } from "../Inputs";
import {
  settings,
  PayPeriods,
  setSettings,
  setIsEditingSettings,
} from "../../signals";

const payPeriodOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
];

export function EditPayPeriod(): JSX.Element {
  const handlePayPeriodChange = (period: string) => {
    setSettings({
      ...settings.value,
      payPeriod: period as PayPeriods,
    });
    setIsEditingSettings("none");
  };

  return (
    <InputSelector
      options={payPeriodOptions}
      onChange={handlePayPeriodChange}
      defaultValue={settings.value.payPeriod}
    />
  );
}
