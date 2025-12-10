export interface EventType {
  id: string;
  code: string;
  nameDe: string;
  nameEn: string;
  descriptionDe?: string;
  descriptionEn?: string;
}

export interface Event {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
  eventTypeId?: string;
  locationId?: string;
}
