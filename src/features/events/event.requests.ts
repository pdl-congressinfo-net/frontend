export interface CreateEventRequest {
  name: string;
  start_date: Date;
  end_date: Date;
  location_id: string;
  cathegory_id: string;
}

export interface UpdateEventRequest {
  name?: string;
  start_date?: Date;
  end_date?: Date;
  location_id?: string;
  cathegory_id?: string;
}
