// api for encrypted local storage
import { encryptData, decryptData } from "./crypto";

const STORAGE_KEY = "secure-events";

export type NonEncryptedEvent = {
  id?: string;
  tags: string;
  note: string;
  endTime: string;
  eventDate: string;
  startTime: string;
  createdAt: string;
  updatedAt: string;
  elapsedTime: number;
};

export type EncryptedStorageEvent = {
  data: string; // base64 AES-encrypted JSON string
};

export type EncryptedStorageEvents = { [key: string]: EncryptedStorageEvent };

export function getAllEncryptedStorageEvents(): EncryptedStorageEvents {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getEncryptedEvent(key: string): EncryptedStorageEvent | null {
  const existing = getAllEncryptedStorageEvents();

  const event = existing[key] || null;
  return event;
}

export async function saveEncryptedStorageEvent(
  event: NonEncryptedEvent,
  password: string
): Promise<void> {
  const existing = getAllEncryptedStorageEvents();

  const sameKeyEventsCount = Object.keys(existing).filter(
    (key) => key.split("$")[0] === event.eventDate
  ).length;

  const newKey = `${event.eventDate}$${sameKeyEventsCount}`;
  const encryptedData = await encryptData(
    JSON.stringify({ ...event, id: newKey }),
    password
  );
  existing[newKey] = { data: encryptedData };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export async function updateEncryptedEvent(
  key: string,
  event: NonEncryptedEvent,
  password: string
): Promise<void> {
  // before setting the data we need to see if the start date was modified, if it no longer
  // matches the key we need to create a new key and remove the old one
  const existing = getAllEncryptedStorageEvents();
  const existingEvent = existing[key];
  if (!existingEvent) {
    throw new Error(`Event with key ${key} not found`);
  }

  const existingEventDate = key.split("$")[0];
  const newEventDate = event.eventDate;
  if (existingEventDate !== newEventDate) {
    // remove the old event
    delete existing[key];
    // create a new key
    const sameKeyEventsCount = Object.keys(existing).filter(
      (key) => key.split("$")[0] === newEventDate
    ).length;
    const newKey = `${newEventDate}$${sameKeyEventsCount}`;
    event.id = newKey;
    key = newKey;
    // add the new event to the existing events
    existing[key] = existingEvent;
  }

  const encryptedData = await encryptData(JSON.stringify(event), password);

  const updatedEvents = { ...existing };
  if (updatedEvents[key]) {
    updatedEvents[key] = { data: encryptedData };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
}

export async function deleteEncryptedEvent(key: string): Promise<void> {
  const existing = getAllEncryptedStorageEvents();
  const updatedEvents = Object.keys(existing)
    .filter((k) => k !== key)
    .reduce((acc, k) => {
      acc[k] = existing[k];
      return acc;
    }, {} as EncryptedStorageEvents);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
}

export async function decryptEventData(
  event: EncryptedStorageEvent,
  password: string
): Promise<NonEncryptedEvent | null> {
  try {
    const decryptedData = await decryptData(event.data, password);
    return JSON.parse(decryptedData) as NonEncryptedEvent;
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
}

export async function decryptAllEvents(
  password: string
): Promise<NonEncryptedEvent[]> {
  const existing = getAllEncryptedStorageEvents();
  const decryptedEvents: NonEncryptedEvent[] = [];

  const decryptedEventsPromises = Object.values(existing).map((event) =>
    decryptEventData(event, password)
  );
  const decryptedResults = await Promise.all(decryptedEventsPromises);
  for (const decryptedEvent of decryptedResults) {
    if (decryptedEvent) {
      decryptedEvents.push(decryptedEvent);
    }
  }

  return decryptedEvents;
}

export async function clearEncryptedEvents(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}

export async function importNonEncryptedEvents(
  events: NonEncryptedEvent[],
  password: string
): Promise<void> {
  await Promise.all(
    events.map(
      async (event) =>
        await saveEncryptedStorageEvent(event, password).catch((e) => {
          console.error("Error saving event:", e);
        })
    )
  );
}
