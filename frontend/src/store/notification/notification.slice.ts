// store/notification/notification.slice.ts
import { Notification } from "@/types/notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  items: Notification[];
  isOpen: boolean;
}

const initialState: NotificationState = {
  isOpen: false,
  items: [
    {
      id: "1",
      title: "Đơn hàng mới",
      content: "Bạn có đơn hàng #1024",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "2",
      title: "Hoàn tiền",
      content: "Đơn #1002 đã hoàn tiền",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    toggleNotification(state) {
      state.isOpen = !state.isOpen;
    },
    closeNotification(state) {
      state.isOpen = false;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const noti = state.items.find((i) => i.id === action.payload);
      if (noti) noti.read = true;
    },
    markAllAsRead(state) {
      state.items.forEach((i) => (i.read = true));
    },
  },
});

export const {
  toggleNotification,
  closeNotification,
  markAsRead,
  markAllAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
