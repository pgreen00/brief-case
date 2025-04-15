export type Appointment = {
  id: number;
  scheduledDate: Date;
  userId: number;
  confirmed: boolean;
  description: string | null;
}
