import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store/rootReducer";

export const selectCustomersState = (state: RootState) => state.customers;

export const selectCustomers = (state: RootState) => state.customers.data;

export const selectCustomersStatus = (state: RootState) =>
  state.customers.status;

export const selectCustomersError = (state: RootState) => state.customers.error;

export const selectSelectedCustomer = (state: RootState) =>
  state.customers.selectedCustomer;

export const selectCustomersIsLoading = (state: RootState) =>
  state.customers.status === "loading";

export const selectCustomersIsEmpty = (state: RootState) =>
  state.customers.status === "succeeded" && state.customers.data.length === 0;

export const selectCustomerById = (id: string) => (state: RootState) =>
  state.customers.data.find((customer) => customer.id === id) ??
  (state.customers.selectedCustomer?.id === id
    ? state.customers.selectedCustomer
    : undefined);

/** Memoized id→customer map for table joins without rebuilding every render. */
export const selectCustomersById = createSelector(
  [selectCustomers],
  (customers) =>
    Object.fromEntries(customers.map((customer) => [customer.id, customer])),
);
