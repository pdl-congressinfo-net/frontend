export interface EventCategoryDTO {
  id: string;
  code: string;
  name_de: string;
  name_en: string;
}

export interface EventTypeDTO {
  id: string;
  code: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
}

export interface EventDTO {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  location_id: string;
  cathegory_id: string;
}
