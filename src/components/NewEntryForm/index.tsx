import {
  settings,
  userTime,
  addEvent,
  eventToEdit,
  updateEvent,
  isEditingEvent,
  clearEventToEdit,
} from "../../signals";
import {
  now,
  convertToTimeInputFormat,
  getElapsedTimeWithOffset,
  normalizeDateToYYYYMMDD,
  NonEncryptedEvent,
} from "../../utils";
import { FormField } from "./FormField";
import { JSX } from "preact/jsx-runtime";
import { DateSelector } from "../Inputs/index";
import { useEffect, useState } from "preact/hooks";
import { Signal } from "@preact/signals";

type FormState = {
  eventDate: string;
  startTime: string;
  endTime: string;
  tags: string;
  note: string;
};

const initialFormState: FormState = {
  eventDate: now().toISOString().split("T")[0],
  startTime: "",
  endTime: "",
  tags: "",
  note: "",
};

const inputClasses =
  "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

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
const getDefaultState = () => {
  return {
    ...initialFormState,
    eventDate: normalizeDateToYYYYMMDD(
      now().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: settings.value.userTimezone,
      })
    ),
    startTime: convertToTimeInputFormat(userTime.value),
  };
};
export function NewEntryForm(): JSX.Element {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>(getDefaultState());

  const [manualStartTimeOverride, setManualStartTimeOverride] =
    useState<boolean>(false);

  useEffect(() => {
    // tags are optional
    const isFormValid =
      !!formState.eventDate &&
      !!formState.startTime &&
      !!formState.endTime &&
      !!formState.note &&
      formState.note.length > 2;

    setIsValid(isFormValid);
  }, [formState]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!manualStartTimeOverride && !isEditingEvent.value) {
      setFormState((prevState) => ({
        ...prevState,
        startTime: convertToTimeInputFormat(userTime.value),
      }));
    }
  }, [userTime.value, manualStartTimeOverride]);

  useEffect(() => {
    if (
      isEditingEvent.value &&
      (eventToEdit as Signal<NonEncryptedEvent>).value !== null
    ) {
      setFormState((prevState) => ({
        ...prevState,
        eventDate: eventToEdit.value?.eventDate ?? "",
        startTime: eventToEdit.value?.startTime ?? "",
        endTime: eventToEdit.value?.endTime ?? "",
        tags: eventToEdit.value?.tags ?? "",
        note: eventToEdit.value?.note ?? "",
      }));
    } else {
      setFormState(getDefaultState());
    }
  }, [isEditingEvent.value]);

  const handleInputChange = (e: Event) => {
    const { id, value } = e.target as HTMLInputElement;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
    setManualStartTimeOverride(true);
  };

  const handleFormReset = () => {
    setFormState(getDefaultState());
    setManualStartTimeOverride(false);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      // figure the elapsed time - use the work timezone
      const elapsed = getElapsedTimeWithOffset(
        formState.eventDate,
        formState.startTime,
        formState.endTime,
        settings.value.userWorkTimezone
      );

      const createdAt = new Date().toISOString();

      await addEvent({
        ...formState,
        elapsedTime: parseFloat(elapsed),
        createdAt,
        updatedAt: createdAt,
      });

      handleFormReset();
    } catch (error) {
      console.error("Error Adding Event:", error);
      alert(`Error Adding Event: ${error}`);
    }
  };

  const handleEdit = async (e: Event) => {
    e.preventDefault();

    const elapsed = getElapsedTimeWithOffset(
      formState.eventDate,
      formState.startTime,
      formState.endTime,
      settings.value.userWorkTimezone
    );

    const editedAt = new Date().toISOString();

    const updatedEvent = {
      ...eventToEdit.value,
      ...formState,
      updatedAt: editedAt,
      elapsedTime: parseFloat(elapsed),
      createdAt: eventToEdit.value?.createdAt as string,
    };

    try {
      await updateEvent(eventToEdit.value?.id ?? "", updatedEvent);
      handleFormReset();
    } catch (error) {
      console.error("Error Updating Event:", error);
      alert(`Error Updating Event: ${error}`);
    }

    if (eventToEdit.value) {
      clearEventToEdit();
    }
  };

  const handleNowButtonClick = (e: Event, type: "start" | "end") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "start") {
      setFormState((prevState) => ({
        ...prevState,
        startTime: convertToTimeInputFormat(userTime.value),
      }));
    }
    if (type === "end") {
      setFormState((prevState) => ({
        ...prevState,
        endTime: convertToTimeInputFormat(userTime.value),
      }));
    }
  };

  return (
    <div className="w-[95%] max-w-4xl mx-auto p-6 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 my-16 h-full">
      <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-2">
        Time Logger
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField id="eventDate" label="Event Date" icon="🗓️">
          <DateSelector
            required
            id="eventDate"
            className={inputClasses}
            defaultValue={formState.eventDate}
            onFormChange={handleInputChange}
          />
        </FormField>

        <FormField id="startTime" label="Start Time" icon="⏱️">
          <div className="flex gap-2">
            <input
              required
              type="time"
              id="startTime"
              className={inputClasses}
              value={convertToTimeInputFormat(formState.startTime)}
              onInput={handleInputChange}
            />

            <NowButton
              onClick={(e: Event) => handleNowButtonClick(e, "start")}
            />
          </div>
        </FormField>

        {!isSmallScreen ? (
          <>
            {" "}
            <FormField id="tags" label="Tags / Category" icon="🏷️">
              <input
                id="tags"
                type="text"
                value={formState.tags}
                onInput={handleInputChange}
                placeholder="e.g. research, bugfix, admin"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>
            <FormField id="endTime" label="End Time" icon="⏲️">
              <div className="flex gap-2">
                <input
                  required
                  type="time"
                  id="endTime"
                  className={inputClasses}
                  value={
                    formState.endTime !== ""
                      ? convertToTimeInputFormat(formState.endTime)
                      : ""
                  }
                  onInput={handleInputChange}
                />

                <NowButton
                  onClick={(e: Event) => handleNowButtonClick(e, "end")}
                />
              </div>
            </FormField>
          </>
        ) : (
          <>
            <FormField id="endTime" label="End Time" icon="⏲️">
              <div className="flex gap-2">
                <input
                  required
                  type="time"
                  id="endTime"
                  className={inputClasses}
                  value={
                    formState.endTime !== ""
                      ? convertToTimeInputFormat(formState.endTime)
                      : ""
                  }
                  onInput={handleInputChange}
                />

                <NowButton
                  onClick={(e: Event) => handleNowButtonClick(e, "end")}
                />
              </div>
            </FormField>
            <FormField id="tags" label="Tags / Category" icon="🏷️">
              <input
                id="tags"
                type="text"
                value={formState.tags}
                onInput={handleInputChange}
                placeholder="e.g. research, bugfix, admin"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>
          </>
        )}

        {/* Notes */}
        <div className="md:col-span-2">
          <FormField id="note" label="Note" icon="📝">
            <textarea
              id="note"
              value={formState.note}
              onInput={handleInputChange}
              placeholder="What was this session about?"
              className="w-full p-3 h-[100px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </FormField>
        </div>

        {/* Submit */}
        <div className="w-full md:col-span-2 flex flex-col items-center justify-center min-h-28">
          <button
            disabled={!isValid}
            onClick={isEditingEvent.value ? handleEdit : handleSubmit}
            className={`w-full bg-blue-600 hover:bg-blue-700 p-3 hover:text-xl rounded-lg text-lg font-semibold text-white transition-all shadow-lg disabled:cursor-not-allowed ${
              !isValid && "opacity-50 "
            }`}
            type="submit"
          >
            {isEditingEvent.value ? `✏️ Edit` : `+ Add`} Event
          </button>

          {/* Reset Button */}
          {isValid && (
            <button
              onClick={(e: Event) => {
                e.preventDefault();
                handleFormReset();
                clearEventToEdit();
              }}
              className="w-full bg-gray-200 text-gray-400 hover:bg-red-500 hover:text-xl hover:text-white p-3 dark:bg-gray-700 rounded-lg text-lg font-semibold dark:text-gray-300 transition-all shadow-lg mt-2"
            >
              🗙 Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
