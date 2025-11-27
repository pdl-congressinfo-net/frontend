import { EventDTO } from "./event.responses";
import { Event } from "./event.model";

export function mapUser(dto: EventDTO): Event {
  return {
    id: dto.id,
    name: dto.name,
    startDate: dto.start_date,
    endDate: dto.end_date,
    locationId: dto.location_id,
    categoryId: dto.cathegory_id,
  };
}
