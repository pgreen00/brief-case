export type Task = {
  id: number;
  assignedUserId: number | null;
  title: string;
  description: string | null;
  dueDate: Date | null;
  completed: boolean;
  caseId: number | null;
  tags: string[] | null;
  timeEntries: {
    userId: number;
    start: Date;
    end: Date;
    note: string | null;
  }[] | null;
  created: Date;
  updated: Date | null;
}
