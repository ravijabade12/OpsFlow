import { createSlice } from "@reduxjs/toolkit";

import { fetchCustomerById, fetchCustomers } from "./customersThunks";
import { customersInitialState } from "./customersTypes";

function asErrorMessage(payload: unknown, fallback: string): string {
  return typeof payload === "string" && payload.trim() ? payload : fallback;
}

const customersSlice = createSlice({
  name: "customers",
  initialState: customersInitialState,
  reducers: {
    clearSelectedCustomer(state) {
      state.selectedCustomer = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
    clearCustomersError(state) {
      state.error = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.customers;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = asErrorMessage(
          action.payload,
          "Unable to load customers",
        );
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedCustomer = action.payload;
        const index = state.data.findIndex(
          (customer) => customer.id === action.payload.id,
        );
        if (index >= 0) {
          state.data[index] = action.payload;
        }
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = asErrorMessage(
          action.payload,
          "Unable to load customer",
        );
      });
  },
});

export const { clearSelectedCustomer, clearCustomersError } =
  customersSlice.actions;
export const customersReducer = customersSlice.reducer;
