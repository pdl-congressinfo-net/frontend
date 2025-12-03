export interface CreateEventCategoryRequest extends Record<string, any> {
  code: string;
  name_de: string;
  name_en: string;
}

export interface UpdateEventCategoryRequest extends Record<string, any> {
  code?: string;
  name_de?: string;
  name_en?: string;
}

export interface CreateEventTypeRequest extends Record<string, any> {
  code: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
}

export interface UpdateEventTypeRequest extends Record<string, any> {
  code?: string;
  name_de?: string;
  name_en?: string;
  description_de?: string;
  description_en?: string;
}

export interface CreateEventRequest extends Record<string, any> {
  name: string;
  start_date: Date;
  end_date: Date;
  is_published?: boolean;
  location_id?: string;
  category_id: string;
}

export interface UpdateEventRequest extends Record<string, any> {
  name?: string;
  start_date?: Date;
  end_date?: Date;
  is_published?: boolean;
  location_id?: string;
  category_id?: string;
}
