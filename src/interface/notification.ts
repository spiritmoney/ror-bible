export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  data?: any;
  type: 'edit' | 'review' | 'collab' | 'payment';
  updatedAt: string;
  createdAt: string;
  inviteType?: 'to' | 'cc'
  readAt: string | null,
  notifiedAt: string | null,
}
