import { JSX } from "preact";

export type OptionType = {
  value: string;
  label: string;
};

export type InputSelectorProps = {
  defaultValue: string;
  options: OptionType[];
  onChange: (value: string) => void;
};

export function InputSelector(
  props: Readonly<InputSelectorProps>
): JSX.Element {
  const { defaultValue, onChange } = props;

  return (
    <select
      value={defaultValue}
      onInput={(e) => onChange((e.target as HTMLSelectElement)?.value || "")}
      className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
    >
      {props.options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
