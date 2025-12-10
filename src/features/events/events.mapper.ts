import { EventDTO, EventCategoryDTO, EventTypeDTO } from "./events.responses";
import { Event, EventCategory, EventType } from "./events.model";

export default {
  events: (dto: EventDTO): Event => ({
    id: dto.id,
    name: dto.name,
    startDate: dto.start_date ? new Date(dto.start_date) : undefined,
    endDate: dto.end_date ? new Date(dto.end_date) : undefined,
    isPublished: dto.is_published,
    locationId: dto.location_id,
    categoryId: dto.category_id,
    headerUrl: dto.header_url ?? dto.headerUrl ?? dto.header?.url ?? null,
    logoUrl: dto.icon_url ?? dto.iconUrl ?? dto.icon?.url ?? null,
  }),

  category: (dto: EventCategoryDTO): EventCategory => ({
    id: dto.id,
    code: dto.code,
    nameDe: dto.name_de,
    nameEn: dto.name_en,
  }),

  type: (dto: EventTypeDTO): EventType => ({
    id: dto.id,
    code: dto.code,
    nameDe: dto.name_de,
    nameEn: dto.name_en,
    descriptionDe: dto.description_de,
    descriptionEn: dto.description_en,
  }),
};
