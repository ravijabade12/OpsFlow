import type { Customer } from "@opsflow/shared";

import { apiRequest, apiRequestWithMeta, toQueryString } from "./apiClient";

export interface CustomersQuery {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface CustomersListResult {
  customers: Customer[];
  totalCount: number;
}

export async function fetchCustomers(
  query: CustomersQuery = {},
): Promise<CustomersListResult> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 50;
  const result = await apiRequestWithMeta<Customer[]>(
    `/customers${toQueryString({
      _page: page,
      _limit: pageSize,
      q: query.q || undefined,
    })}`,
  );

  return {
    customers: result.data,
    totalCount: result.meta.totalCount ?? result.data.length,
  };
}

export async function fetchCustomerById(id: string): Promise<Customer> {
  return apiRequest<Customer>(`/customers/${id}`);
}
