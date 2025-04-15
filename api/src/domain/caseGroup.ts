export type CaseGroup = {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  rank: number | null;
  created: Date;
  updated: Date | null;
}
