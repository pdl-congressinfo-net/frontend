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
}

export interface LocationDTO {
  id: string;
  name: string;
  road?: string;
  number?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  country_id: string;
  location_type_id: string;
}
