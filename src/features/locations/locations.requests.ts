/**
 * Request DTOs for Location-related API endpoints.
 * Uses snake_case to match Python backend expectations.
 */

// LocationType Request DTOs
export interface LocationTypeCreateRequest {
  name: string;
  description?: string | null;
}

export interface LocationTypeUpdateRequest {
  name?: string;
  description?: string | null;
}

// Country Request DTOs
export interface CountryCreateRequest {
  name: string;
  code2: string;
  code3: string;
  devco?: boolean;
  preferred?: boolean;
}

export interface CountryUpdateRequest {
  name?: string;
  code2?: string;
  code3?: string;
  devco?: boolean;
  preferred?: boolean;
}

// Location Request DTOs
export interface LocationCreateRequest {
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

export interface LocationUpdateRequest {
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
