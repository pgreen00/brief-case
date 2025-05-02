export type CaseGroup = {
  id: number;
  title: string;
  business_id: number;
  description: string | null;
  parent_id: number | null;
  group_rank: number | null;
  automations: Record<string, string> | null;
  last_modified: Date;
}
