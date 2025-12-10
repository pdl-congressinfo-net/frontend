export interface CreateLocationTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateLocationTypeRequest {
  name?: string;
  description?: string;
}

export interface CreateCountryRequest {
  name: string;
  code2: string;
  code3: string;
  devco: boolean;
  preferred: boolean;
}

export interface UpdateCountryRequest {
  name?: string;
  code2?: string;
  code3?: string;
  devco?: boolean;
  preferred?: boolean;
}

export interface CreateLocationRequest {
  name: string;
  road?: string;
  number?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  link?: string;
  country_id?: string;
  location_type_id?: string;
}

export interface UpdateLocationRequest {
  name?: string;
  road?: string;
  number?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
  link?: string;
  country_id?: string;
  location_type_id?: string;
}
