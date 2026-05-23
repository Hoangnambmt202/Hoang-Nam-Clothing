import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@store/features/authSlice";
import notificationReducer from "@store/notification/notification.slice";
import sidebarReducer from "@store/ui/sidebar.slice";
import uiReducer from "@store/ui/ui.slice";
import searchReducer from "@/store/features/searchSlice";
import profileReducer from "@/store/features/profileSlice";
import cartReducer from "@/store/features/cartSlice";
import productsReducer from "@/store/features/productsSlice";
import categoriesReducer from "@/store/features/categoriesSlice";
import brandsReducer from "@/store/features/brandsSlice";
import checkoutReducer from "@/store/features/checkoutSlice";
import inventoryReducer from "@/store/features/inventorySlice";
import usersReducer from "@/store/features/usersSlice";
import reviewsReducer from "@/store/features/reviewsSlice";
import systemLogsReducer from "@/store/features/systemLogsSlice";
import wishlistReducer from "@/store/features/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    sidebar: sidebarReducer,
    ui: uiReducer,
    search: searchReducer,
    profile: profileReducer,
    cart: cartReducer,
    products: productsReducer,
    categories: categoriesReducer,
    brands: brandsReducer,
    checkout: checkoutReducer,
    inventory: inventoryReducer,
    users: usersReducer,
    reviews: reviewsReducer,
    systemLogs: systemLogsReducer,
    wishlist: wishlistReducer,
  },


});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

