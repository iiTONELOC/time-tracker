import { JSX } from "preact/jsx-runtime";
import { capitalize } from "../../utils";
import { EditTimezone } from "./EditTimezone";
import { EditPayPeriod } from "./EditPayPeriod";
import { EditStartWeek } from "./EditWeek1Start";
import { EditTimeFormat } from "./EditTimeFormat";
import { Dispatch, StateUpdater } from "preact/hooks";
import {
  settings,
  AppSettings,
  isEditingSettings,
  setIsEditingSettings,
  EditableUserSetting,
} from "../../signals";

type UserSetting = {
  label: string;
  value: string;
  isLast?: boolean;
  capitalize: boolean;
  OnEdit: () => JSX.Element;
};

export type SetEditingFn = Dispatch<StateUpdater<boolean>>;

const editableUserSettings = [
  {
    label: "User Timezone",
    value: "userTimezone",
    capitalize: false,
    OnEdit: () => <EditTimezone timezoneType="userTimezone" />,
  },
  {
    label: "Work Timezone",
    value: "userWorkTimezone",
    capitalize: false,
    OnEdit: () => <EditTimezone timezoneType="userWorkTimezone" />,
  },
  {
    label: "Time Format",
    value: "timeFormat",
    capitalize: false,
    OnEdit: () => <EditTimeFormat />,
  },
  {
    label: "Pay Period",
    value: "payPeriod",
    capitalize: true,
    OnEdit: () => <EditPayPeriod />,
  },
  {
    label: "Week 1 Start",
    value: "week1Start",
    capitalize: false,
    OnEdit: () => <EditStartWeek />,
    isLast: true,
  },
];

function RenderSetting(setting: Readonly<UserSetting>): JSX.Element {
  const isEditingSettingsVal = isEditingSettings.value;
  const settingVal = setting.value as EditableUserSetting;
  const isEditing = isEditingSettingsVal === settingVal;

  return (
    <div
      className={`w-full flex flex-row items-center justify-between  h-auto  ${
        setting.isLast ? "-mb-6" : "border-b pb-2"
      }`}
    >
      <div className="flex justify-between items-center">
        <h2 className={`text-lg font-semibold ${isEditing ? "mr-8" : ""}`}>
          {setting.label}:
        </h2>

        {isEditing ? (
          <setting.OnEdit />
        ) : (
          <em>
            <p className="text-gray-700 dark:text-gray-300 ml-4">
              {setting.capitalize
                ? capitalize(
                    String(settings.value[setting.value as keyof AppSettings])
                  )
                : settings.value[setting.value as keyof AppSettings] ||
                  "Not set"}
            </p>
          </em>
        )}
      </div>

      <button
        onClick={() =>
          setIsEditingSettings(
            isEditing ? "none" : (setting.value as EditableUserSetting)
          )
        }
        aria-label={isEditing ? `Save ${setting.value}` : "Edit timezone"}
        className="text-lg p-1 justify-self-end focus:outline-none border border-transparent hover:border-black dark:hover:border-gray-500 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-all hover:shadow-md"
      >
        {isEditing ? "✔️" : "✏️"}
      </button>
    </div>
  );
}

export function UserSettings(): JSX.Element {
  return (
    <>
      {/*  */}
      <h3 class="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        User Settings
      </h3>
      <ul class="w-full flex flex-col items-center justify-start p-3 bg-gray-100 rounded-md dark:bg-gray-900 min-h-[285px]">
        {editableUserSettings.map((setting) => (
          <li class="w-full flex items-center justify-between mb-2">
            <RenderSetting {...setting} />
          </li>
        ))}
      </ul>
    </>
  );
}
