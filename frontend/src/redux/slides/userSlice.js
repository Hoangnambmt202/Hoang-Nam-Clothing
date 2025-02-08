import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        Cookies.set("user", JSON.stringify(action.payload));
      } else {
        Cookies.remove("user");
      }
    },
    logout: (state) => {
      state.user = null;
      Cookies.remove("user");
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
