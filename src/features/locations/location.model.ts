export interface LocationType {
  id: string;
  name: string;
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
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  link?: string;
  countryId?: string;
  locationTypeId?: string;
}
