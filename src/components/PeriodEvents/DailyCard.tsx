import {
  removeSeconds,
  NonEncryptedEvent,
  dateTzFromYYYYMMDD,
  getDateLocaleString,
  getTimezoneAbbreviation,
} from "../../utils";
import {
  settings,
  deleteEvent,
  updateEvents,
  setEventToEdit,
  setIsEditingEvent,
} from "../../signals";
import { JSX } from "preact/jsx-runtime";
import { useEffect, useState } from "preact/hooks";

const { userWorkTimezone, userTimezone } = settings.value;

type EventCardProps = {
  event: NonEncryptedEvent;
};

export function EventCard({ event }: Readonly<EventCardProps>): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const { eventDate, startTime, endTime, tags, note, elapsedTime } = event;

  const formatTime = (time: string, timeZone: string): string => {
    const date = new Date(`${eventDate}T${time}:00`);
    return date.toLocaleTimeString("en-US", { timeZone });
  };

  const workStartTimeFormatted = formatTime(startTime, userWorkTimezone);
  const workEndTimeFormatted = formatTime(endTime, userWorkTimezone);
  const localStartTimeFormatted = formatTime(startTime, userTimezone);
  const localEndTimeFormatted = formatTime(endTime, userTimezone);

  const handleButtonClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    setShow(!show);
  };

  const handleEditClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setEventToEdit(event);
    setIsEditingEvent(true);
    setShow(false);
  };

  const handleDeleteClick = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    event &&
      (await deleteEvent(event.id as string).catch((err) =>
        console.error(err)
      ));
    setIsDeleted(true);

    updateEvents.value = true;
  };

  return !isDeleted ? (
    <li
      key={event.id}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="rounded-xl p-4 bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700 mb-2 relative w-[350px]"
    >
      {tags && (
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 flex flex-row gap-x-2">
          <em>#</em> {tags}
        </h4>
      )}

      {/* Work time */}
      <p className="text-base text-gray-700 dark:text-gray-300 underline underline-offset-4 mb-2">
        {removeSeconds(workStartTimeFormatted)} –{" "}
        {removeSeconds(workEndTimeFormatted)}{" "}
        <span className={"text-[.7rem] dark:text-gray-400"}>
          ({getTimezoneAbbreviation(userWorkTimezone)})
        </span>
      </p>

      {/* Local Time */}
      <em>
        <p className="text-sm text-gray-700 dark:text-gray-300 -mt-2">
          {removeSeconds(localStartTimeFormatted)} –{" "}
          {removeSeconds(localEndTimeFormatted)}{" "}
          <span className={"text-[.7rem] dark:text-gray-400"}>
            ({getTimezoneAbbreviation(userTimezone)})
          </span>
        </p>
      </em>

      {/* Stored Elapsed */}
      <p className="text-sm text-gray-700 dark:text-gray-300  my-2">
        <strong>Elapsed:</strong> {elapsedTime.toFixed(4)} hrs
      </p>

      {/* Optional Note */}
      <p className="text-sm text-gray-700 dark:text-gray-300">
        <strong>Note:</strong> {note || "—"}
      </p>
      {isMobile && (
        <button
          onClick={handleButtonClick}
          className={
            "absolute font-semibold top-0 right-0 mr-4 text-xl hover:text-amber-500 hover:cursor-pointer hover:text-xl"
          }
        >
          …
        </button>
      )}
      {show && (
        <span className={`absolute bottom-4 right-4 flex flex-row gap-x-2`}>
          <button
            onClick={handleEditClick}
            className="text-sm text-gray-900 font-semibold hover:text-white bg-amber-400 hover:bg-amber-500 shadow-md rounded-md px-3 py-1 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-sm text-white bg-red-600 hover:bg-red-700 shadow-md rounded-md px-3 py-1 transition-colors duration-200"
          >
            Delete
          </button>
        </span>
      )}
    </li>
  ) : (
    <></>
  );
}

export function DailyEventCard({
  baseDate,
  events,
}: Readonly<{
  baseDate: string;
  events: { event: NonEncryptedEvent }[];
}>): JSX.Element {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const toggleExpanded = () => setExpanded((prev) => !prev);

  useEffect(() => {
    const totalElapsedTime = events.reduce(
      (sum, { event }) => sum + (event.elapsedTime ?? 0),
      0
    );
    setElapsedTime(totalElapsedTime);
  }, [events]);

  return events.length > 0 ? (
    <section // NOSONAR
      key={baseDate}
      className=" w-full rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 shadow-md mb-6 border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="w-full flex justify-between items-center text-left focus:outline-none">
        <h3 // NOSONAR
          className="text-medium font-bold text-gray-900 dark:text-white cursor-pointer"
          onClick={toggleExpanded}
        >
          <span className={"mr-2 text-xs"}> {expanded ? `▼` : `▶`} </span>{" "}
          {getDateLocaleString(
            dateTzFromYYYYMMDD(baseDate, userTimezone),
            userTimezone,
            "short"
          )}
        </h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium cursor-default">
          ⏱ {elapsedTime.toFixed(4)} hrs
        </div>
      </div>

      {/* Expandable Event List */}
      {expanded && (
        <ul className="mt-4 space-y-2 transition-all duration-300 ease-in-out flex flex-wrap flex-row gap-4 justify-around items-stretch">
          {events.map(({ event }) => (
            <EventCard event={event} key={event.id} />
          ))}
        </ul>
      )}
    </section>
  ) : (
    <></>
  );
}
