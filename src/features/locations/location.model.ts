export interface LocationType {
  id: string;
  name: string;
  description?: string;
}

export interface Country {
  id: string;
  name: string;
  code2: string;
  code3: string;
  devco: boolean;
  preferred: boolean;
}

export interface Location {
  id: string;
  name: string;
  road?: string;
  number?: string;
  city?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  link?: string;
  countryId: string;
  locationTypeId: string;
}
