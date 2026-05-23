import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryApi } from "@/lib/api/category";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  status?: string;
  color?: string;
  revenue?: string;
  growth?: string;
  growthRate?: number;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    const data = await categoryApi.getWithProductCount();
    return data.map((c: any) => ({
      ...c,
      status: "active",
      color: "from-blue-500 to-cyan-600",
      revenue: "0đ",
      growth: `${c.growthRate >= 0 ? '+' : ''}${c.growthRate}%`,
      productCount: Number(c.productCount) || 0
    }));
  },
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async ({ data, token }: { data: { name: string; description?: string }; token: string }) => {
    return await categoryApi.createCategory(data, token);
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  },
});

export default categoriesSlice.reducer;
