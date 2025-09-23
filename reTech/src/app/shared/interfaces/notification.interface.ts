export interface Notification{

  _id?: string;
  userId: string;         // кому принадлежит уведомление
//   type: 'chat' | 'system' | 'offer';
  message: string;
  isRead: boolean;
  createdAt: Date;

}