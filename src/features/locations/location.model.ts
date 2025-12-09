/**
 * Domain models for Location-related entities.
 * Uses camelCase for TypeScript/JavaScript conventions.
 */

// LocationType Model
export interface LocationType {
  id: string;
  name: string;
  description: string | null;
}

// Country Model
export interface Country {
  id: string;
  name: string;
  code2: string;
  code3: string;
  devco: boolean;
  preferred: boolean;
}

// Location Model
export interface Location {
  id: string;
  name: string;
  road: string | null;
  number: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  link: string | null;
  countryId: string;
  locationTypeId: string;
}
