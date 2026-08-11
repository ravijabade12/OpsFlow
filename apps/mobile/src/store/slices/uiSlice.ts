import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  refreshing: boolean;
}

const initialState: UiState = {
  refreshing: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setRefreshing(state, action: PayloadAction<boolean>) {
      state.refreshing = action.payload;
    },
  },
});

export const { setRefreshing } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

export const selectRefreshing = (state: { ui: UiState }) => state.ui.refreshing;
