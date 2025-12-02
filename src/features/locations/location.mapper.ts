import { LocationDTO, CountryDTO, LocationTypeDTO } from "./location.responses";
import { Location, Country, LocationType } from "./location.model";

export function mapLocation(dto: LocationDTO): Location {
  return {
    id: dto.id,
    name: dto.name,
    road: dto.road,
    number: dto.number,
    address: dto.address,
    city: dto.city,
    state: dto.state,
    postalCode: dto.postal_code,
    lat: dto.lat,
    lng: dto.lng,
    countryId: dto.country_id,
    locationTypeId: dto.location_type_id,
  };
}

export function mapCountry(dto: CountryDTO): Country {
  return {
    id: dto.id,
    name: dto.name,
    code2: dto.code2,
    code3: dto.code3,
    devco: dto.devco,
  };
}

export function mapLocationType(dto: LocationTypeDTO): LocationType {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
  };
}
