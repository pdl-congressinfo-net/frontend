import { EventSession, Programm } from "./programm.model";
import {
  CreateEventSessionRequest,
  CreateProgrammRequest,
  UpdateEventSessionRequest,
  UpdateProgrammRequest,
} from "./programm.request";
import { EventSessionDTO, ProgrammDTO } from "./programm.responses";

const toProgrammModel = (dto: ProgrammDTO): Programm => ({
  id: dto.id,
  title: dto.title,
  description: dto.description ?? undefined,
  type: dto.type as Programm["type"],
  locationId: dto.location_id ?? undefined,
  capacity: dto.capacity ?? undefined,
  startTime: new Date(dto.start_time),
  endTime: new Date(dto.end_time),
  level: dto.level ?? undefined,
  speakerId: dto.speaker_id ?? undefined,
  tags: dto.tags ?? undefined,
  sessionId: dto.session_id,
  isFeatured: dto.is_featured,
  createdAt: new Date(dto.created_at),
  updatedAt: new Date(dto.updated_at),
});

const toEventSessionModel = (dto: EventSessionDTO): EventSession => ({
  id: dto.id,
  name: dto.name,
  startTime: new Date(dto.start_time),
  endTime: new Date(dto.end_time),
  eventId: dto.event_id,
  createdAt: new Date(dto.created_at),
  updatedAt: new Date(dto.updated_at),
});

export const programmRequestMapper = {
  toCreateProgrammRequest: (
    values: Partial<Programm>,
  ): CreateProgrammRequest => ({
    title: values.title ?? "",
    description: values.description,
    type: values.type ?? "LCT",
    location_id: values.locationId,
    capacity: values.capacity,
    start_time: values.startTime ?? new Date(),
    end_time: values.endTime ?? new Date(),
    level: values.level,
    speaker_id: values.speakerId,
    tags: values.tags,
    session_id: values.sessionId ?? "",
    is_featured: values.isFeatured,
  }),
  toUpdateProgrammRequest: (
    values: Partial<Programm>,
  ): UpdateProgrammRequest => ({
    title: values.title,
    description: values.description,
    type: values.type,
    location_id: values.locationId,
    capacity: values.capacity,
    start_time: values.startTime,
    end_time: values.endTime,
    level: values.level,
    speaker_id: values.speakerId,
    tags: values.tags,
    session_id: values.sessionId,
    is_featured: values.isFeatured,
  }),
  toCreateEventSessionRequest: (
    values: Partial<EventSession>,
  ): CreateEventSessionRequest => ({
    name: values.name ?? "",
    start_time: values.startTime ?? new Date(),
    end_time: values.endTime ?? new Date(),
    event_id: values.eventId ?? "",
  }),
  toUpdateEventSessionRequest: (
    values: Partial<EventSession>,
  ): UpdateEventSessionRequest => ({
    name: values.name,
    start_time: values.startTime,
    end_time: values.endTime,
    event_id: values.eventId,
  }),
};

export default {
  programm: toProgrammModel,
  sessions: toEventSessionModel,
};
