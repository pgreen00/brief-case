export type TimeEntry = {
  id: number;
  note: string | null;
  business_user_id: number;
  start_date: Date;
  end_date: Date;
  duration: number; //interval
  task_id: number | null;
  case_id: number | null;
  last_modified: Date;
}
