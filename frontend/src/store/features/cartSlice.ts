import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cartApi } from "@/lib/api/cart";

export interface CartItem {
  id: string; // Product ID
  cartItemId?: string; // Database Cart Item ID (for logged-in users)
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
  status: "idle" | "loading" | "succeeded" | "failed";
}

const getInitialItems = (): CartItem[] => {
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem("hn_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

const initialState: CartState = {
  items: getInitialItems(),
  status: "idle",
};

// Helper function to map DB cart items to Frontend cart items
const mapDbCartToState = (dbCart: any): CartItem[] => {
  if (!dbCart || !dbCart.items) return [];
  return dbCart.items.map((dbItem: any) => {
    const variant = dbItem.productVariant;
    const product = variant?.product;
    const mainImg = product?.images?.find((img: any) => img.isMain)?.url || product?.images?.[0]?.url || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";

    return {
      id: dbItem.productId,
      cartItemId: dbItem.id,
      name: product?.name || "Sản phẩm",
      price: Number(variant?.price || 0),
      quantity: dbItem.quantity,
      image: mainImg,
      variantId: dbItem.productVariantId,
      size: variant?.size || "",
      color: variant?.color || "",
    };
  });
};

// --- THUNKS cho người dùng đã đăng nhập ---

export const fetchCartDb = createAsyncThunk(
  "cart/fetchCartDb",
  async (token: string) => {
    const data = await cartApi.getCart(token);
    return data;
  }
);

export const addToCartDb = createAsyncThunk(
  "cart/addToCartDb",
  async ({ item, token }: { item: CartItem; token: string }) => {
    const data = await cartApi.addItem({
      productId: item.id,
      productVariantId: item.variantId,
      quantity: item.quantity,
    }, token);
    return data;
  }
);

export const updateCartItemDb = createAsyncThunk(
  "cart/updateCartItemDb",
  async ({ cartItemId, quantity, newVariantId, token }: { cartItemId: string; quantity?: number; newVariantId?: string; token: string }) => {
    const data = await cartApi.updateItem(cartItemId, { quantity, newVariantId }, token);
    return data;
  }
);

export const removeCartItemDb = createAsyncThunk(
  "cart/removeCartItemDb",
  async ({ cartItemId, token }: { cartItemId: string; token: string }) => {
    const data = await cartApi.removeItem(cartItemId, token);
    return data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Local Reducers for Guest Users
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
    updateItemVariant: (
      state,
      action: PayloadAction<{
        id: string;
        oldVariantId?: string;
        newVariantId: string;
        size: string;
        color: string;
        price: number;
      }>
    ) => {
      const { id, oldVariantId, newVariantId, size, color, price } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.id === id && item.variantId === oldVariantId
      );
      
      if (itemIndex > -1) {
        const itemToModify = state.items[itemIndex];
        const quantity = itemToModify.quantity;
        
        const existingNewVariantIndex = state.items.findIndex(
          (item) => item.id === id && item.variantId === newVariantId
        );
        
        if (existingNewVariantIndex > -1 && existingNewVariantIndex !== itemIndex) {
          state.items[existingNewVariantIndex].quantity += quantity;
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex] = {
            ...itemToModify,
            variantId: newVariantId,
            size,
            color,
            price
          };
        }
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
  extraReducers: (builder) => {
    const handleDbSync = (state: CartState, action: PayloadAction<any>) => {
      state.items = mapDbCartToState(action.payload);
      state.status = "succeeded";
      if (typeof window !== "undefined") {
        localStorage.setItem("hn_cart", JSON.stringify(state.items));
      }
    };

    builder
      .addCase(fetchCartDb.pending, (state) => { state.status = "loading"; })
      .addCase(fetchCartDb.fulfilled, handleDbSync)
      .addCase(addToCartDb.fulfilled, handleDbSync)
      .addCase(updateCartItemDb.fulfilled, handleDbSync)
      .addCase(removeCartItemDb.fulfilled, handleDbSync);
  },
});

export const { addItem, removeItem, updateQuantity, updateItemVariant, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
