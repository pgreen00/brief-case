export type Appointment = {
  id: number;
  scheduled_date: Date;
  business_user_id: number;
  last_modified: Date;
  confirmed: boolean;
  description: string | null;
}
