/**
 * Mappers for converting between API responses and domain models.
 * Handles snake_case to camelCase conversion.
 */

import {
  LocationTypeResponse,
  CountryResponse,
  LocationResponse,
} from "./location.responses";
import { LocationType, Country, Location } from "./location.model";

export default {
  types: (dto: LocationTypeResponse): LocationType => ({
    id: dto.id,
    name: dto.name,
    description: dto.description,
  }),
  countries: (dto: CountryResponse): Country => ({
    id: dto.id,
    name: dto.name,
    code2: dto.code2,
    code3: dto.code3,
    devco: dto.devco,
    preferred: dto.preferred,
  }),
  locations: (dto: LocationResponse): Location => ({
    id: dto.id,
    name: dto.name,
    road: dto.road,
    number: dto.number,
    city: dto.city,
    state: dto.state,
    postalCode: dto.postal_code,
    latitude: dto.latitude,
    longitude: dto.longitude,
    link: dto.link,
    countryId: dto.country_id,
    locationTypeId: dto.location_type_id,
  }),
};
