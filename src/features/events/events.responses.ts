export interface EventTypeDTO {
  id: string;
  code: string;
}

export interface EventDTO {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  is_public: boolean;
  event_type_id?: string;
  location_id?: string;
}
