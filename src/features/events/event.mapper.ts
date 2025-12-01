import { EventDTO, EventCategoryDTO, EventTypeDTO } from "./event.responses";
import { Event, EventCategory, EventType } from "./event.model";

export function mapEventCategory(dto: EventCategoryDTO): EventCategory {
  return {
    id: dto.id,
    code: dto.code,
    nameDe: dto.name_de,
    nameEn: dto.name_en,
  };
}

export function mapEventType(dto: EventTypeDTO): EventType {
  return {
    id: dto.id,
    code: dto.code,
    nameDe: dto.name_de,
    nameEn: dto.name_en,
    descriptionDe: dto.description_de,
    descriptionEn: dto.description_en,
  };
}

export function mapEvent(dto: EventDTO): Event {
  return {
    id: dto.id,
    name: dto.name,
    startDate: dto.start_date,
    endDate: dto.end_date,
    locationId: dto.location_id,
    categoryId: dto.cathegory_id,
  };
}
