import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productApi } from "@/lib/api/product";

interface InventoryState {
  variants: any[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  variants: [],
  loading: false,
  error: null,
};

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getAllVariants();
      // apiFetch automatically resolves to json.data, so response is the array of variants directly
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi tải kho hàng");
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  "inventory/updateInventoryItem",
  async (
    { id, stockQuantity, token }: { id: string; stockQuantity: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await productApi.updateVariant(id, { stockQuantity }, token);
      // apiFetch automatically resolves to json.data, so response is the updated variant directly
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi cập nhật tồn kho");
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.variants = action.payload || [];
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        const updatedVariant = action.payload;
        if (updatedVariant) {
          const index = state.variants.findIndex((v) => v.id === updatedVariant.id);
          if (index !== -1) {
            state.variants[index] = { ...state.variants[index], ...updatedVariant };
          }
        }
      });
  },
});

export default inventorySlice.reducer;
