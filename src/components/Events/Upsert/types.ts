export interface BasicInformationValues {
  name: string;
  startDate: string;
  oneDay: boolean;
  endDate?: string;
  eventTypeId: string;
  isPublic: boolean;
}

export type PhysicalLocationFormValues = {
  name: string;
  road?: string;
  number?: string;
  postalCode?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  countryId?: string;
};

export type WebinarLocationFormValues = {
  name: string;
  link: string;
};
