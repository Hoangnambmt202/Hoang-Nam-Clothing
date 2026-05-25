// store/notification/notification.types.ts
export interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  read: boolean;
}
