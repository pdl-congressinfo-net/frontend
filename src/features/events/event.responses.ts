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
  is_published: boolean;
  location_id: string;
  category_id: string;
  header_url?: string | null;
  headerUrl?: string | null;
  header?: { url?: string | null } | null;
  icon_url?: string | null;
  iconUrl?: string | null;
  icon?: { url?: string | null } | null;
}
