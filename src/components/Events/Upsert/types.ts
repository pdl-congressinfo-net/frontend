export interface BasicInformationValues {
  name: string;
  startDate: string;
  oneDay: boolean;
  endDate?: string;
  typeId: string;
  typeCode: string;
  field: string;
}

export type PhysicalLocationFormValues = {
  name: string;
  road: string;
  number: string;
  postalCode: string;
  city: string;
  lat?: number;
  lng?: number;
  country: string;
  countryId: string;
};

export type WebinarLocationFormValues = {
  name: string;
  link: string;
};

export type EventImagesFormValues = {
  headerFile?: File | null;
  headerUrl?: string | null;
  logoFile?: File | null;
  logoUrl?: string | null;
};
