import { batch, signal } from "@preact/signals";
import { NonEncryptedEvent } from "../../utils";

export const isEditingEvent = signal<boolean>(false);
export const eventToEdit = signal<NonEncryptedEvent | null>(null);

export const setIsEditingEvent = (value: boolean) =>
  (isEditingEvent.value = value);

export const setEventToEdit = (event: NonEncryptedEvent) =>
  (eventToEdit.value = event);

export const clearEventToEdit = () => {
  batch(() => {
    isEditingEvent.value = false;
    eventToEdit.value = null;
  });
};
