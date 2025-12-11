import { EventDTO, EventTypeDTO } from "./events.responses";
import { Event, EventType } from "./events.model";

export default {
  events: (dto: EventDTO): Event => ({
    id: dto.id,
    name: dto.name,
    startDate: new Date(dto.start_date),
    endDate: new Date(dto.end_date),
    isPublic: dto.is_public,
    eventTypeId: dto.event_type_id,
    locationId: dto.location_id,
  }),
  types: (dto: EventTypeDTO): EventType => ({
    id: dto.id,
    code: dto.code,
  }),
};
