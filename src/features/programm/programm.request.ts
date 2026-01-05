import { ProgrammType } from "./programm.model";

export interface CreateProgrammRequest {
  title: string;
  description?: string;
  type: ProgrammType;
  location_id?: string;
  capacity?: number;
  start_time: Date;
  end_time: Date;
  level?: string;
  speaker_id?: string;
  tags?: string;
  session_id: string;
  is_featured?: boolean;
}

export interface UpdateProgrammRequest {
  title?: string;
  description?: string;
  type?: ProgrammType;
  location_id?: string;
  capacity?: number;
  start_time?: Date;
  end_time?: Date;
  level?: string;
  speaker_id?: string;
  tags?: string;
  session_id?: string;
  is_featured?: boolean;
}

export interface CreateEventSessionRequest {
  name: string;
  start_time: Date;
  end_time: Date;
  event_id: string;
}

export interface UpdateEventSessionRequest {
  name?: string;
  start_time?: Date;
  end_time?: Date;
  event_id?: string;
}
