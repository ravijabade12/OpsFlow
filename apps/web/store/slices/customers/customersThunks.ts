import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchCustomerById as fetchCustomerByIdRequest,
  fetchCustomers as fetchCustomersRequest,
  type CustomersQuery,
} from "@/services/customersService";
import { getErrorMessage } from "@/store/asyncState";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (query: CustomersQuery | undefined, { rejectWithValue }) => {
    try {
      return await fetchCustomersRequest(query);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load customers"),
      );
    }
  },
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchCustomerById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchCustomerByIdRequest(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load customer"));
    }
  },
);
