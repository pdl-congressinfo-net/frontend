/**
 * Response DTOs for Location-related API endpoints.
 * Uses snake_case to match Python backend responses.
 */

// LocationType Response DTOs
export interface LocationTypeResponse {
  id: string;
  name: string;
  description: string | null;
}

export interface LocationTypeCreateResponse {
  name: string;
  description?: string | null;
}

export interface LocationTypeUpdateResponse {
  name?: string;
  description?: string | null;
}

// Country Response DTOs
export interface CountryResponse {
  id: string;
  name: string;
  code2: string;
  code3: string;
  devco: boolean;
  preferred: boolean;
}

export interface CountryCreateResponse {
  name: string;
  code2: string;
  code3: string;
  devco?: boolean;
  preferred?: boolean;
}

export interface CountryUpdateResponse {
  name?: string;
  code2?: string;
  code3?: string;
  devco?: boolean;
  preferred?: boolean;
}

// Location Response DTOs
export interface LocationResponse {
  id: string;
  name: string;
  road: string | null;
  number: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  link: string | null;
  country_id: string;
  location_type_id: string;
}

export interface LocationCreateResponse {
  name: string;
  road?: string | null;
  number?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  link?: string | null;
  country_id: string;
  location_type_id: string;
}

export interface LocationUpdateResponse {
  name?: string;
  road?: string | null;
  number?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  link?: string | null;
  country_id?: string;
  location_type_id?: string;
}
