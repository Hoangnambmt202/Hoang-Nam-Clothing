import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewApi } from "@/lib/api/review";

interface ReviewsState {
  reviews: any[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (
    { token, rating, isApproved, page = 1, limit = 10 }: { token: string; rating?: number; isApproved?: boolean; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await reviewApi.getAllReviews(token, { page, limit, rating, isApproved });
      // The API returns { items: [], meta: { totalItems: ... } }
      return {
        reviews: response?.items || [],
        total: response?.meta?.totalItems || 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi tải đánh giá");
    }
  }
);

export const updateReviewStatus = createAsyncThunk(
  "reviews/updateStatus",
  async (
    { token, id, isApproved }: { token: string; id: string; isApproved: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await reviewApi.updateStatus(token, id, isApproved);
      return response; // Updated review
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi cập nhật trạng thái");
    }
  }
);

export const replyReview = createAsyncThunk(
  "reviews/reply",
  async (
    { token, id, replyComment }: { token: string; id: string; replyComment: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await reviewApi.replyReview(token, id, replyComment);
      return response; // Updated review
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi gửi phản hồi");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/delete",
  async (
    { token, id }: { token: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      await reviewApi.deleteReview(token, id);
      return id; // Return deleted ID
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi xóa đánh giá");
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.total = action.payload.total;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const index = state.reviews.findIndex((r) => r.id === updated.id);
          if (index !== -1) {
            state.reviews[index] = { ...state.reviews[index], ...updated };
          }
        }
      })
      .addCase(replyReview.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const index = state.reviews.findIndex((r) => r.id === updated.id);
          if (index !== -1) {
            state.reviews[index] = { ...state.reviews[index], ...updated };
          }
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        const id = action.payload;
        state.reviews = state.reviews.filter((r) => r.id !== id);
        state.total -= 1;
      });
  },
});

export default reviewsSlice.reducer;
