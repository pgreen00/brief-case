export type BusinessNote = {
  id: number;
  title: string;
  description: string | null;
  business_id: number;
  created_at: Date;
  tags: string[] | null;
  show_in_calendar: boolean;
  start_date: Date | null;
  end_date: Date | null;
  user_id: number;
  duration: number | null; //interval
  last_modified: Date;
  alerts: Record<string, string> | null;
  repeats: number | null; //interval
}
