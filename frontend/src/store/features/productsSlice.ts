import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productApi } from "@/lib/api/product";

interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  outOfStock: number;
  lowStock: number;
}

interface ProductsState {
  products: any[];
  total: number;
  totalPages: number;
  currentPage: number;
  stats: ProductStats | null;
  currentProduct: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
  stats: null,
  currentProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: Record<string, any> | undefined) => {
    return await productApi.getProducts(params);
  },
);

export const fetchProductStats = createAsyncThunk(
  "products/fetchStats",
  async (token: string) => {
    return await productApi.getProductStats(token);
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string) => {
    return await productApi.getProductById(id);
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product details";
      });
  },
});

export const { clearProductsError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
