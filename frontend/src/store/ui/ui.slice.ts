import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isScrolled: boolean;
  scrollY: number;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeModal: string | null;
}

const initialState: UIState = {
  isScrolled: false,
  scrollY: 0,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setScrolled(state, action: PayloadAction<boolean>) {
      state.isScrolled = action.payload;
    },
    setScrollY(state, action: PayloadAction<number>) {
      state.scrollY = action.payload;
      state.isScrolled = action.payload > 50;
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.isMobileMenuOpen = action.payload;
    },
    toggleSearch(state) {
      state.isSearchOpen = !state.isSearchOpen;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.isSearchOpen = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const {
  setScrolled,
  setScrollY,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setSearchOpen,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
