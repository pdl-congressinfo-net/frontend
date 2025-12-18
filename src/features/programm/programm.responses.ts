export interface ProgrammDTO {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  location_id?: string | null;
  capacity?: number | null;
  start_time: string;
  end_time: string;
  level?: string | null;
  speaker_id?: string | null;
  tags?: string | null;
  session_id: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventSessionDTO {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  event_id: string;
  created_at: string;
  updated_at: string;
}
