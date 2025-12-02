export interface LocationTypeDTO {
  id: string;
  name: string;
  description?: string;
}

export interface CountryDTO {
  id: string;
  name: string;
  code2: string;
  code3: string;
  devco: boolean;
  preferred: boolean;
}

export interface LocationDTO {
  id: string;
  name: string;
  road?: string;
  number?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  link?: string;
  country_id: string;
  location_type_id: string;
}
