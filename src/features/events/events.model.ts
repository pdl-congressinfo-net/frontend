export interface EventType {
  id: string;
  code: string;
}

export interface Event {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
  subject?: string;
  url?: string;
  language: string;
  eventTypeId?: string;
  locationId?: string;
}
