import {
  NonEncryptedEvent,
  updateEncryptedEvent,
  deleteEncryptedEvent,
  EncryptedStorageEvents,
  saveEncryptedStorageEvent,
  getAllEncryptedStorageEvents,
} from "../../utils";
import { effect, signal } from "@preact/signals";
import { checkPassAndCatchErrs, getPassword } from "../auth";
import { periodEnd, periodStart, setPeriodEvents } from "./periodEvents";

export const updateEvents = signal<boolean>(false);
export const encryptedEvents = signal<EncryptedStorageEvents>(
  getAllEncryptedStorageEvents()
);

export const setEncryptedEvents = (events: EncryptedStorageEvents) => {
  encryptedEvents.value = events;
};

export const deleteEvent = async (id: string) =>
  await checkPassAndCatchErrs(async () => {
    await deleteEncryptedEvent(id);
    setEncryptedEvents(getAllEncryptedStorageEvents());
  });

export const addEvent = async (event: NonEncryptedEvent) =>
  await checkPassAndCatchErrs(async () => {
    await saveEncryptedStorageEvent(event, await getPassword());
    setEncryptedEvents(getAllEncryptedStorageEvents());
  });

export const updateEvent = async (id: string, data: NonEncryptedEvent) =>
  await checkPassAndCatchErrs(async () => {
    await updateEncryptedEvent(id, data, await getPassword());
    setEncryptedEvents(getAllEncryptedStorageEvents());
  });

/*effects */
const getPeriodEvents = () => {
  const matches: EncryptedStorageEvents = {};

  Object.entries(encryptedEvents.value ?? {}).forEach(([id, event]) => {
    const date = id.split("$")[0];

    const eventDate = Date.parse(`${date}T00:00:00`);
    const endDate = Date.parse(`${periodEnd.value}T00:00:00`);
    const startDate = Date.parse(`${periodStart.value}T00:00:00`);

    const inRange = eventDate >= startDate && eventDate <= endDate;

    if (inRange) {
      matches[id] = event;
    }
  });

  setPeriodEvents(matches);
};

effect(() => {
  if (updateEvents.value) {
    setEncryptedEvents(getAllEncryptedStorageEvents());
    updateEvents.value = false;
    // will getPeriodEvents update??
  }
});

effect(() => {
  getPeriodEvents();
});
