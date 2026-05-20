import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: string;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
}

const getInitialItems = (): CartItem[] => {
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem("hn_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Lỗi đọc giỏ hàng từ localStorage:", e);
      return [];
    }
  }
  return [];
};

const initialState: CartState = {
  items: getInitialItems(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const { id, variantId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.variantId === variantId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("hn_cart", JSON.stringify(state.items));
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ id: string; variantId?: string }>
    ) => {
      const { id, variantId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.variantId === variantId)
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("hn_cart", JSON.stringify(state.items));
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; variantId?: string; quantity: number }>
    ) => {
      const { id, variantId, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.variantId === variantId
      );
      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("hn_cart", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("hn_cart");
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
