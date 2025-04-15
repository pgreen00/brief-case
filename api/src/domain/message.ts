export type Message = {
  id: number;
  content: string; //encrypted
  sentAt: Date;
  senderId: number;
  recipientId: number | null;
  readBy: number[] | null;
}
