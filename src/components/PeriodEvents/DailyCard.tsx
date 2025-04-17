import {
  settings,
  eventToEdit,
  deleteEvent,
  updateEvents,
  setEventToEdit,
  clearEventToEdit,
  setIsEditingEvent,
} from "../../signals";
import {
  removeSeconds,
  NonEncryptedEvent,
  dateTzFromYYYYMMDD,
  getDateLocaleString,
  getTimezoneAbbreviation,
} from "../../utils";
import { JSX } from "preact/jsx-runtime";
import { useEffect, useState } from "preact/hooks";

const { userWorkTimezone, userTimezone } = settings.value;

type EventCardProps = {
  event: NonEncryptedEvent;
};

function Tags({ tags, eventid }: Readonly<{ tags: string; eventid: string }>) {
  const tagsArray = tags.split(/[\s,.]+/);

  return (
    <div className="flex flex-wrap gap-2">
      {tagsArray.map((tag, index) => (
        <span
          key={`${tags}-${eventid}-${index}`}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
        >
          <em>#</em> {tag}
        </span>
      ))}
    </div>
  );
}

const checkForMobile = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export function EventCard({ event }: Readonly<EventCardProps>): JSX.Element {
  const [show, setShow] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(checkForMobile());
  const { eventDate, startTime, endTime, tags, note, elapsedTime } = event;

  const isActive = eventToEdit?.value?.id == event.id;

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

    if (isActive) {
      clearEventToEdit();
    } else {
      setEventToEdit(event);
      setIsEditingEvent(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
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

  const active =
    "border-3 border-indigo-500 dark:border dark:border-blue-500 shadow-[0_0_10px_rgba(99,102,241,0.9)] dark:shadow-[0_0_10px_rgba(59,130,246,0.5)]";

  return !isDeleted ? (
    <li
      title={event.id}
      key={event.id}
      onMouseEnter={() => setIsMobile(true)}
      onMouseLeave={() => setIsMobile(false)}
      className={`rounded-xl p-4 bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700 mb-2 relative min-w-[18rem] max-w-[18rem] h-80 ${
        isActive ? active : ""
      }`}
    >
      {/* Elapsed Time at Top */}
      <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
        ⏱ Elapsed: {elapsedTime.toFixed(4)} hrs
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 flex flex-wrap gap-x-2">
          <Tags tags={tags} eventid={event.id as string} />
        </h4>
      )}

      {/* Work Time */}
      <p className="text-base text-gray-700 dark:text-gray-300 underline underline-offset-4 mb-1">
        {removeSeconds(workStartTimeFormatted)} –{" "}
        {removeSeconds(workEndTimeFormatted)}
        <span className="ml-1 text-[.7rem] text-gray-500 dark:text-gray-400">
          ({getTimezoneAbbreviation(userWorkTimezone)})
        </span>
      </p>

      {/* Local Time */}
      <p className="text-sm italic text-gray-600 dark:text-gray-400 -mt-1 mb-2">
        {removeSeconds(localStartTimeFormatted)} –{" "}
        {removeSeconds(localEndTimeFormatted)}
        <span className="ml-1 text-[.7rem]">
          ({getTimezoneAbbreviation(userTimezone)})
        </span>
      </p>

      {/* Note */}
      <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden overflow-ellipsis whitespace-pre-line max-h-[4.5rem] mb-2">
        <strong>Note:</strong> {note || "—"}
      </p>

      {/* Mobile Actions Button */}
      {isMobile && (
        <button
          title="Show more"
          onClick={handleButtonClick}
          className="absolute font-semibold top-0 right-0 mr-4 text-xl hover:text-amber-500 cursor-pointer"
        >
          …
        </button>
      )}

      {/* Edit/Delete Buttons */}
      {show && (
        <div className="absolute bottom-4 right-4 flex flex-row gap-x-2">
          <button
            title={isActive ? "Cancel" : "Edit"}
            onClick={handleEditClick}
            className="text-sm text-gray-900 font-semibold hover:text-white bg-amber-400 hover:bg-amber-500 shadow-md rounded-md px-3 py-1 transition-colors duration-200"
          >
            {isActive ? "Cancel" : "Edit"}
          </button>
          <button
            title="Delete"
            onClick={handleDeleteClick}
            className="text-sm text-white bg-red-600 hover:bg-red-700 shadow-md rounded-md px-3 py-1 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
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
      className="w-full rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
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
        <ul className="w-full flex flex-row  gap-4 py-2 overflow-x-auto   ">
          {events.map(({ event }) => (
            <li key={event.id} className="snap-center ">
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </section>
  ) : (
    <></>
  );
}
