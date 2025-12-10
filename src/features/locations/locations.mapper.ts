import { LocationDTO, LocationTypeDTO, CountryDTO } from "./locations.responses";
import { Location, LocationType, Country } from "./location.model";


export const mapLocationType = (dto: LocationTypeDTO): LocationType => ({
  id: dto.id,
  name: dto.name,
});

export const mapCountry = (dto: CountryDTO): Country => ({
  id: dto.id,
  name: dto.name,
  code2: dto.code2,
  code3: dto.code3,
  devco: dto.devco,
  preferred: dto.preferred,
});

export const mapLocation = (dto: LocationDTO): Location => ({
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
});

export default {
  types: mapLocationType,
  countries: mapCountry,
  locations: mapLocation,
};
