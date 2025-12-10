import { LuCircleCheck, LuCircleMinus, LuCircleX } from "react-icons/lu";
import {
  BasicInformationValues,
  PhysicalLocationFormValues,
  WebinarLocationFormValues,
} from "./types";

type StepStatus = "done" | "error" | "open";

type SaveResult = { success?: boolean; id?: string };

type StoredEventInfo = {
  id?: string;
  locationId?: string;
  data: BasicInformationValues;
};

type StoredLocationInfo =
  | { id?: string; kind: "physical"; data: PhysicalLocationFormValues }
  | { id?: string; kind: "webinar"; data: WebinarLocationFormValues };

type EventDetail = {
  id: string;
  name?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  event_type_id?: string;
  eventTypeId?: string;
  event_type?: { id?: string; code?: string } | null;
  eventType?: { id?: string; code?: string } | null;
  location_id?: string;
  locationId?: string;
  location?: LocationDetail | null;
  is_public?: boolean;
  isPublic?: boolean;
  [key: string]: unknown;
};

type LocationDetail = {
  id?: string;
  name?: string;
  road?: string;
  number?: string;
  postal_code?: string;
  postalCode?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  link?: string;
  country?: { id?: string; name?: string } | string | null;
  country_id?: string;
  countryId?: string;
  [key: string]: unknown;
};

const steps: { id: string; title: string }[] = [
  { id: "event", title: "Basic Information" },
  { id: "location", title: "Location" },
];

const getStatusIndicator = (status: StepStatus) => {
  switch (status) {
    case "done":
      return { color: "green.500", element: <LuCircleCheck /> };
    case "error":
      return { color: "red.500", element: <LuCircleX /> };
    case "open":
      return { color: undefined, element: <LuCircleMinus /> };
  }
};

const normalizeEventValues = (
  data: BasicInformationValues,
): BasicInformationValues => ({
  ...data,
  endDate: data.oneDay ? data.startDate : (data.endDate ?? data.startDate),
});

const isSameEventValues = (
  a: BasicInformationValues,
  b: BasicInformationValues,
) =>
  a.name === b.name &&
  a.startDate === b.startDate &&
  (a.endDate ?? "") === (b.endDate ?? "") &&
  a.oneDay === b.oneDay &&
  a.eventTypeId === b.eventTypeId &&
  a.isPublic === b.isPublic;

const normalizePhysicalLocation = (
  data: PhysicalLocationFormValues,
): PhysicalLocationFormValues => ({
  name: data.name?.trim() ?? "",
  road: data.road?.trim(),
  number: data.number?.trim(),
  postalCode: data.postalCode?.trim(),
  city: data.city?.trim(),
  latitude: data.latitude,
  longitude: data.longitude,
  countryId: data.countryId?.trim(),
});

const isSamePhysicalLocation = (
  a: PhysicalLocationFormValues,
  b: PhysicalLocationFormValues,
) =>
  a.name === b.name &&
  (a.road ?? "") === (b.road ?? "") &&
  (a.number ?? "") === (b.number ?? "") &&
  (a.postalCode ?? "") === (b.postalCode ?? "") &&
  (a.city ?? "") === (b.city ?? "") &&
  (a.countryId ?? "") === (b.countryId ?? "") &&
  (a.latitude ?? null) === (b.latitude ?? null) &&
  (a.longitude ?? null) === (b.longitude ?? null);

const normalizeWebinarLocation = (
  data: WebinarLocationFormValues,
): WebinarLocationFormValues => ({
  name: data.name?.trim() ?? "",
  link: data.link?.trim() ?? "",
});

const isSameWebinarLocation = (
  a: WebinarLocationFormValues,
  b: WebinarLocationFormValues,
) => a.name === b.name && a.link === b.link;

const toOptionalString = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const unwrapData = <T,>(result: any): T | undefined => {
  if (!result) return undefined;
  if (result.data && typeof result.data === "object") {
    const inner = result.data;
    if (inner && typeof inner === "object" && "data" in inner) {
      return (inner as any).data as T;
    }
    return inner as T;
  }
  return result as T;
};

export type {
  StepStatus,
  SaveResult,
  StoredEventInfo,
  StoredLocationInfo,
  BasicInformationValues,
  PhysicalLocationFormValues,
  WebinarLocationFormValues,
  EventDetail,
  LocationDetail,
};

export {
  steps,
  getStatusIndicator,
  normalizeEventValues,
  isSameEventValues,
  normalizePhysicalLocation,
  isSamePhysicalLocation,
  normalizeWebinarLocation,
  isSameWebinarLocation,
  toOptionalString,
  unwrapData,
};
