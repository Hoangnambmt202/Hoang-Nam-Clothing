import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { brandApi } from "@/lib/api/brand";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  productCount?: number;
  status?: string;
  color?: string;
  revenue?: string;
  growth?: string;
  growthRate?: number;
}

interface BrandsState {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandsState = {
  brands: [],
  loading: false,
  error: null,
};

export const fetchBrands = createAsyncThunk(
  "brands/fetchAll",
  async () => {
    const data = await brandApi.getBrands();
    return data.map((b: any) => ({
      ...b,
      status: "active",
      color: "from-fuchsia-500 to-purple-600",
      revenue: "0đ",
      growth: `${b.growthRate >= 0 ? '+' : ''}${b.growthRate}%`,
      productCount: Number(b.productCount) || 0
    }));
  },
);

export const createBrand = createAsyncThunk(
  "brands/create",
  async ({ data, token }: { data: { name: string; description?: string }; token: string }) => {
    return await brandApi.createBrand(data, token);
  },
);

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch brands";
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      });
  },
});

export default brandsSlice.reducer;
