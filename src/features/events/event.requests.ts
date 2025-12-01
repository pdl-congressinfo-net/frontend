export interface CreateEventCategoryRequest {
  code: string;
  name_de: string;
  name_en: string;
}

export interface UpdateEventCategoryRequest {
  code?: string;
  name_de?: string;
  name_en?: string;
}

export interface CreateEventTypeRequest {
  code: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
}

export interface UpdateEventTypeRequest {
  code?: string;
  name_de?: string;
  name_en?: string;
  description_de?: string;
  description_en?: string;
}

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
