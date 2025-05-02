export type CaseComment = {
  id: number;
  content: string; //encrypted
  case_id: number;
  parent_id: number | null;
  user_id: number;
  created_at: Date;
  last_modified: Date;
}
