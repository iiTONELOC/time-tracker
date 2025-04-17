import { signal } from "@preact/signals";
import { PayPeriods } from "../settings";
import { NonEncryptedEvent } from "../../utils";

export type ReportType = PayPeriods | "none";

export type DecryptedEvents = {
  [key: string]: {
    event: NonEncryptedEvent;
  }[];
};

export const reportType = signal<ReportType>("none");

export const reportData = signal<DecryptedEvents>({} as DecryptedEvents);
