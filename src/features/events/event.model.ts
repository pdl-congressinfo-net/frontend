export interface EventCategory {
  id: string;
  code: string;
  nameDe: string;
  nameEn: string;
}

export interface EventType {
  id: string;
  code: string;
  nameDe: string;
  nameEn: string;
  descriptionDe: string;
  descriptionEn: string;
}

export interface Event {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isPublished: boolean;
  locationId: string;
  categoryId: string;
}
