import { JSX } from "preact";
import { ClockIcon } from "./ClockIcon";
import { settings, userTime, workTime } from "../signals";
import { now, normalizeDate, getDateLocaleString } from "../utils";

export function InfoHeader(): JSX.Element {
  const { userTimezone, weekNumber, periodStart, periodEnd } = settings.value;

  return (
    <div
      className={`relative w-full flex flex-col md:flex-row items-center justify-between text-sm h-auto bg-gray-100 dark:bg-slate-950 p-2 text-black dark:text-white gap-y-4 md:gap-y-0`}
    >
      {/* Current week and period info */}
      <div
        className={`flex flex-col md:flex-row gap-y-2 md:gap-x-4 items-center`}
      >
        <p className="font-semibold">Week: {weekNumber}</p>
        <p className={`flex flex-wrap flex-row gap-x-2`}>
          <span className={"font-semibold"}>{normalizeDate(periodStart)}</span>
          <span>to</span>
          <span className={"font-semibold"}>{normalizeDate(periodEnd)}</span>
        </p>
      </div>

      {/* Current date */}
      <p
        className={`font-semibold text-center md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2`}
      >
        {getDateLocaleString(now(), userTimezone)}
      </p>

      {/* Work and local time */}
      <div className="flex flex-col items-center justify-center md:items-end">
        <span
          class={`flex flex-row items-center justify-between gap-x-2 min-w-[125px]`}
        >
          <ClockIcon type="work" />
          <p className="font-semibold mr-1">Work Time: {workTime}</p>
        </span>
        <span
          class={`flex flex-row items-center justify-between gap-x-2 min-w-[125px]`}
        >
          <ClockIcon type="user" />
          <p className="font-semibold mr-1">Local Time: {userTime}</p>
        </span>
      </div>
    </div>
  );
}
