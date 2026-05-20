import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  totalOrders?: number;
  totalSpent?: number;
  memberLevel?: "Bronze" | "Silver" | "Gold" | "Platinum";
};

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateProfileField: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearProfile: (state) => {
      state.profile = null;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setProfile, updateProfileField, clearProfile, setProfileLoading } =
  profileSlice.actions;
export default profileSlice.reducer;
