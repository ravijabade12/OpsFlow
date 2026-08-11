import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  theme: "light" | "dark" | "system";
}

const initialState: UiState = {
  sidebarOpen: true,
  mobileNavOpen: false,
  theme: "system",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    setTheme(state, action: PayloadAction<UiState["theme"]>) {
      state.theme = action.payload;
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebar,
  setMobileNavOpen,
  toggleMobileNav,
  setTheme,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;

export const selectSidebarOpen = (state: { ui: UiState }) =>
  state.ui.sidebarOpen;
export const selectMobileNavOpen = (state: { ui: UiState }) =>
  state.ui.mobileNavOpen;
export const selectTheme = (state: { ui: UiState }) => state.ui.theme;
