import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
  openMenus: Record<string, boolean>;
}

const initialState: SidebarState = {
  isOpen: true,
  openMenus: {},
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isOpen = !state.isOpen;
    },
    openMenu(state, action: PayloadAction<string>) {
      state.openMenus[action.payload] = true;
    },
    toggleMenu(state, action: PayloadAction<string>) {
      const key = action.payload;
      state.openMenus[key] = !state.openMenus[key];
    },
    setOpenMenus(state, action: PayloadAction<Record<string, boolean>>) {
      state.openMenus = action.payload;
    },
  },
});

export const { toggleSidebar, toggleMenu, openMenu, setOpenMenus } =
  sidebarSlice.actions;

export default sidebarSlice.reducer;
