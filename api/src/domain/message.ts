export type Message = {
  id: number;
  value: string; //encrypted
  sent_at: Date;
  sender_id: number;
  read_messages: Record<string, any> | null;
  recipient_id: number | null;
  business_id: number | null;
  last_modified: Date;
}
