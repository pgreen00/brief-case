export type Comment = {
  id: number;
  content: string; //encrypted
  caseId: number;
  parentId: number | null;
  userId: number;
  createdAt: Date
}
