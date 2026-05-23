import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { systemLogApi } from "@/lib/api/system-log";

interface SystemLogsState {
  logs: any[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: SystemLogsState = {
  logs: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchSystemLogs = createAsyncThunk(
  "systemLogs/fetchLogs",
  async (
    { token, type, search, page = 1, limit = 10 }: { token: string; type?: string; search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await systemLogApi.getAllLogs(token, { page, limit, type, search });
      return {
        logs: response?.items || [],
        total: response?.meta?.totalItems || 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi tải nhật ký");
    }
  }
);

const systemLogsSlice = createSlice({
  name: "systemLogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.total = action.payload.total;
      })
      .addCase(fetchSystemLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default systemLogsSlice.reducer;
