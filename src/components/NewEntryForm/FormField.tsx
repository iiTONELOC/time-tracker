import { JSX } from "preact/jsx-runtime";

interface FormFieldProps {
  id: string;
  label: string;
  icon?: string;
  containerClassName?: string;
  children: JSX.Element;
}

export function FormField({
  id,
  label,
  icon,
  children,
  containerClassName = "w-full",
}: Readonly<FormFieldProps>): JSX.Element {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium mb-1 text-white">
        {icon && `${icon} `}
        {label}
      </label>
      {children}
    </div>
  );
}
