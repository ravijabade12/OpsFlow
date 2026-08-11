import type { Customer } from "@opsflow/shared";

import type { AsyncStatus } from "../../asyncState";

export interface CustomersState {
  data: Customer[];
  selectedCustomer: Customer | null;
  status: AsyncStatus;
  detailStatus: AsyncStatus;
  error: string | null;
  detailError: string | null;
  totalCount: number;
}

export const customersInitialState: CustomersState = {
  data: [],
  selectedCustomer: null,
  status: "idle",
  detailStatus: "idle",
  error: null,
  detailError: null,
  totalCount: 0,
};
