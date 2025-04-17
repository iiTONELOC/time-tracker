import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";

export type DateSelectorProps = {
  id?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFormChange?: (e: Event) => void;
};

const defaultClasses =
  "border rounded px-2 py-1 dark:bg-gray-700 dark:text-white";

export function DateSelector(props: DateSelectorProps): JSX.Element {
  const { id, className, defaultValue, required, onChange, onFormChange } =
    props;

  const [value, setValue] = useState(defaultValue ?? "");

  const handleChange = (e: Event) => {
    const newValue = (e.target as HTMLInputElement)?.value || "";
    setValue(newValue);
    onChange?.(newValue);
    onFormChange?.(e);
  };

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    } else {
      setValue("");
    }
  }, [defaultValue]);

  return id ? (
    <input
      type="date"
      id={props.id}
      value={value}
      required={required}
      onInput={handleChange}
      className={className ?? defaultClasses}
    />
  ) : (
    <input
      type="date"
      value={value}
      required={required}
      onInput={handleChange}
      className={className ?? defaultClasses}
    />
  );
}
