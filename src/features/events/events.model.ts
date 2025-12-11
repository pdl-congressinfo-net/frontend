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
  eventTypeId?: string;
  locationId?: string;
}
