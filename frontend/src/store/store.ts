import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@store/features/authSlice";
import notificationReducer from "@store/notification/notification.slice";
import sidebarReducer from "@store/ui/sidebar.slice";
import searchReducer from "@/store/features/searchSlice";
import profileReducer from "@/store/features/profileSlice";
import cartReducer from "@/store/features/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    sidebar: sidebarReducer,
    search: searchReducer,
    profile: profileReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
