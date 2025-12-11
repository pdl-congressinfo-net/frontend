export interface CreateEventTypeRequest {
  code: string;
}

export interface UpdateEventTypeRequest {
  code?: string;
}

export interface CreateEventRequest {
  name: string;
  start_date: Date;
  end_date: Date;
  is_public: boolean;
  event_type_id?: string;
  location_id?: string;
}

export interface UpdateEventRequest {
  name?: string;
  start_date?: Date;
  end_date?: Date;
  is_public?: boolean;
  event_type_id?: string;
  location_id?: string;
}
