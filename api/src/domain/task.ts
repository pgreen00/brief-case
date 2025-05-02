export type Task = {
  id: number;
  assigned_user_id: number | null;
  title: string;
  description: string | null;
  due_date: Date | null;
  completed: boolean;
  case_id: number | null;
  tags: string[] | null;
  business_id: number;
  last_modified: Date;
}
