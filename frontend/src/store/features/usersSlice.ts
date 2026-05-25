import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "@/lib/api/user";

interface UsersState {
  users: any[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    { token, role, search, page = 1, limit = 10 }: { token: string; role?: string; search?: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.getAllUsers(token, { page, limit, role, search });
      return response; // { users: [], total: ... }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi tải người dùng");
    }
  }
);

export const toggleUserActive = createAsyncThunk(
  "users/toggleActive",
  async (
    { token, id, isActive }: { token: string; id: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await userApi.updateUser(token, id, { isActive });
      return response; // Updated user
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi cập nhật trạng thái");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.users || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        if (updatedUser) {
          const index = state.users.findIndex((u) => u.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = { ...state.users[index], ...updatedUser };
          }
        }
      });
  },
});

export default usersSlice.reducer;
