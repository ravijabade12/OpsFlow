import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store/rootReducer";

export const selectJobsState = (state: RootState) => state.jobs;

export const selectJobs = (state: RootState) => state.jobs.data;

export const selectJobsStatus = (state: RootState) => state.jobs.status;

export const selectJobsError = (state: RootState) => state.jobs.error;

export const selectSelectedJob = (state: RootState) => state.jobs.selectedJob;

export const selectJobsPagination = createSelector(selectJobsState, (jobs) => ({
  page: jobs.page,
  pageSize: jobs.pageSize,
  totalCount: jobs.totalCount,
  totalPages: Math.max(1, Math.ceil(jobs.totalCount / jobs.pageSize)),
}));

export const selectJobsFilters = (state: RootState) => state.jobs.filters;

export const selectJobsSelectedIds = (state: RootState) =>
  state.jobs.selectedIds;

export const selectJobsIsLoading = (state: RootState) =>
  state.jobs.status === "loading";

export const selectJobsIsEmpty = (state: RootState) =>
  state.jobs.status === "succeeded" && state.jobs.data.length === 0;

export const selectHasActiveJobFilters = createSelector(
  selectJobsFilters,
  (filters) =>
    Boolean(
      filters.status ||
      filters.priority ||
      filters.agentId ||
      filters.customerId ||
      filters.q,
    ),
);
