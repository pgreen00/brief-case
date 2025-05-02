export type Log = {
  id: number;
  entity_type: string;
  entity_id: number | null;
  user_id: number | null;
  occurred_on: Date;
  entity_action: string;
  description: Record<string, string> | null; //?
  updated_columns: string[] | null;
  old_row: Record<string, any> | null;
  new_row: Record<string, any> | null;
}
