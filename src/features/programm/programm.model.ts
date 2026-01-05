export type ProgrammType =
  | "LCT"
  | "WKS"
  | "DMO"
  | "NET"
  | "BRK"
  | "KEY"
  | "OTH";

export interface Programm {
  id: string;
  title: string;
  description?: string;
  type: ProgrammType;
  locationId?: string;
  capacity?: number;
  startTime: Date;
  endTime: Date;
  level?: string;
  speakerId?: string;
  tags?: string;
  sessionId: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventSession {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}
