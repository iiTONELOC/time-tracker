import { settings } from "../settings";
import { signal } from "@preact/signals";
import { EncryptedStorageEvents } from "../../utils";

const periodEvents = signal<EncryptedStorageEvents>({});

export const periodEnd = signal<string>(settings.value.periodEnd);
export const periodStart = signal<string>(settings.value.periodStart);

export const setPeriodEvents = (events: EncryptedStorageEvents) => {
  periodEvents.value = events;
};
