import type { Job, JobPriority, JobStatus } from "@opsflow/shared";
import { DEFAULT_PAGE_SIZE } from "@opsflow/shared";

import type { AsyncStatus } from "../../asyncState";

export interface JobsFilters {
  status: JobStatus | "";
  priority: JobPriority | "";
  agentId: string;
  customerId: string;
  q: string;
  sort: string;
  order: "asc" | "desc";
}

export interface JobsState {
  data: Job[];
  selectedJob: Job | null;
  status: AsyncStatus;
  detailStatus: AsyncStatus;
  mutationStatus: AsyncStatus;
  error: string | null;
  detailError: string | null;
  mutationError: string | null;
  page: number;
  pageSize: number;
  totalCount: number;
  filters: JobsFilters;
  selectedIds: string[];
}

export const jobsFiltersInitial: JobsFilters = {
  status: "",
  priority: "",
  agentId: "",
  customerId: "",
  q: "",
  sort: "createdAt",
  order: "desc",
};

export const jobsInitialState: JobsState = {
  data: [],
  selectedJob: null,
  status: "idle",
  detailStatus: "idle",
  mutationStatus: "idle",
  error: null,
  detailError: null,
  mutationError: null,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,
  filters: jobsFiltersInitial,
  selectedIds: [],
};
