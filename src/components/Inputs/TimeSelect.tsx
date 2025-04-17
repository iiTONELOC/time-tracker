import { JSX } from "preact";
import { userTime, workTime } from "../../signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { convertToTimeInputFormat, stripExtra } from "../../utils";

export type TimeSelectorProps = {
  id?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
  type: "user" | "work";
  onChange?: (value: string) => void;
  onFormChange?: (e: Event) => void;
};

type NowButtonProps = {
  onClick?: (e: Event) => void;
};
function NowButton(props: Readonly<NowButtonProps>): JSX.Element {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="px-3 py-2 rounded-lg text-sm text-black dark:text-white bg-gray-100 shadow-md  dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
    >
      Now
    </button>
  );
}

const defaultClasses = `flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                         text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`;

export function TimeSelector(props: Readonly<TimeSelectorProps>): JSX.Element {
  const {
    id,
    className,
    defaultValue,
    required,
    onChange,
    onFormChange,
    type,
  } = props;
  const [value, setValue] = useState<string>(defaultValue ?? "");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // set to default value if defaultValue is "default"
    if (defaultValue === "default") {
      setValue("");
    }
  }, [props.type, defaultValue]);

  const handleChange = (e: Event) => {
    const newValue = (e.target as HTMLInputElement)?.value || "";

    setValue(newValue);

    onChange?.(newValue);
    onFormChange?.(e);
  };

  const handleNowButtonClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === "user") {
      setValue(convertToTimeInputFormat(userTime.peek()));
    } else if (type === "work") {
      setValue(convertToTimeInputFormat(workTime.peek()));
    } else {
      console.error("Invalid type prop passed to TimeSelector component.");
    }
  };

  return (
    <>
      {id ? (
        <input
          ref={inputRef}
          type="time"
          id={props.id}
          value={value}
          required={required}
          onInput={handleChange}
          className={className ?? stripExtra(defaultClasses)}
        />
      ) : (
        <input
          ref={inputRef}
          type="time"
          value={value}
          required={required}
          onInput={handleChange}
          className={className ?? stripExtra(defaultClasses)}
        />
      )}

      <NowButton onClick={handleNowButtonClick} />
    </>
  );
}
