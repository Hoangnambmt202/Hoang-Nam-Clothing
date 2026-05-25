import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistApi } from "@/lib/api/wishlist";

interface WishlistState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getWishlist(token);
      return response; // this should return the list of items
    } catch (error: any) {
      return rejectWithValue(error.message || "Không thể tải danh sách yêu thích");
    }
  }
);

export const addProductToWishlist = createAsyncThunk(
  "wishlist/addProduct",
  async (
    { token, productId }: { token: string; productId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await wishlistApi.addToWishlist(token, productId);
      return response; // Returns the newly created wishlist item (loaded with product relations in backend or we refetch)
    } catch (error: any) {
      return rejectWithValue(error.message || "Không thể thêm vào danh sách yêu thích");
    }
  }
);

export const removeProductFromWishlist = createAsyncThunk(
  "wishlist/removeProduct",
  async (
    { token, productId }: { token: string; productId: string },
    { rejectWithValue }
  ) => {
    try {
      await wishlistApi.removeFromWishlist(token, productId);
      return productId; // Return productId to remove from local state
    } catch (error: any) {
      return rejectWithValue(error.message || "Không thể xóa khỏi danh sách yêu thích");
    }
  }
);

const normalizeWishlistItem = (payload: any) => {
  if (!payload) return null;
  if (payload.data && !payload.product) {
    return payload.data;
  }
  return payload;
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const rawItems = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload?.data && Array.isArray(action.payload.data) ? action.payload.data : []);
        state.items = rawItems.map(normalizeWishlistItem).filter(Boolean);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProductToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const item = normalizeWishlistItem(action.payload);
          if (item) {
            const newProdId = item.product?.id || item.product;
            if (newProdId) {
              const exists = state.items.some(existingItem => {
                const normalizedExisting = normalizeWishlistItem(existingItem);
                const existingProdId = normalizedExisting?.product?.id || normalizedExisting?.product;
                return existingProdId === newProdId;
              });
              if (!exists) {
                state.items.unshift(item);
              }
            }
          }
        }
      })
      .addCase(addProductToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeProductFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const removedProductId = action.payload;
        state.items = state.items.filter((item) => {
          const normalized = normalizeWishlistItem(item);
          const itemProductId = normalized?.product?.id || normalized?.product;
          return itemProductId !== removedProductId;
        });
      })
      .addCase(removeProductFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
