import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import {
  createJob,
  deleteJob,
  fetchJobById,
  fetchJobs,
  updateJob,
} from "./jobsThunks";
import { bulkUpdateJobStatus } from "./jobsBulkThunks";
import {
  jobsFiltersInitial,
  jobsInitialState,
  type JobsFilters,
} from "./jobsTypes";

function asErrorMessage(payload: unknown, fallback: string): string {
  return typeof payload === "string" && payload.trim() ? payload : fallback;
}

const jobsSlice = createSlice({
  name: "jobs",
  initialState: jobsInitialState,
  reducers: {
    setJobsPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload);
    },
    setJobsPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    setJobsFilters(state, action: PayloadAction<Partial<JobsFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetJobsFilters(state) {
      state.filters = jobsFiltersInitial;
      state.page = 1;
    },
    clearSelectedJob(state) {
      state.selectedJob = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
    setSelectedJobIds(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    toggleJobSelection(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((item) => item !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearJobSelection(state) {
      state.selectedIds = [];
    },
    clearJobsError(state) {
      state.error = null;
      state.detailError = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.jobs;
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = asErrorMessage(action.payload, "Unable to load jobs");
      })
      .addCase(fetchJobById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedJob = action.payload;
        const index = state.data.findIndex(
          (job) => job.id === action.payload.id,
        );
        if (index >= 0) {
          state.data[index] = action.payload;
        }
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = asErrorMessage(
          action.payload,
          "Unable to load job",
        );
      })
      .addCase(createJob.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.data = [action.payload, ...state.data];
        state.totalCount += 1;
        state.selectedJob = action.payload;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = asErrorMessage(
          action.payload,
          "Unable to create job",
        );
      })
      .addCase(updateJob.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const index = state.data.findIndex(
          (job) => job.id === action.payload.id,
        );
        if (index >= 0) {
          state.data[index] = action.payload;
        }
        if (state.selectedJob?.id === action.payload.id) {
          state.selectedJob = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = asErrorMessage(
          action.payload,
          "Unable to update job",
        );
      })
      .addCase(deleteJob.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.data = state.data.filter((job) => job.id !== action.payload);
        state.selectedIds = state.selectedIds.filter(
          (id) => id !== action.payload,
        );
        if (state.selectedJob?.id === action.payload) {
          state.selectedJob = null;
        }
        state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = asErrorMessage(
          action.payload,
          "Unable to delete job",
        );
      })
      .addCase(bulkUpdateJobStatus.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(bulkUpdateJobStatus.fulfilled, (state) => {
        state.mutationStatus = "succeeded";
        state.selectedIds = [];
      })
      .addCase(bulkUpdateJobStatus.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = asErrorMessage(
          action.payload,
          "Unable to update selected jobs",
        );
      });
  },
});

export const {
  setJobsPage,
  setJobsPageSize,
  setJobsFilters,
  resetJobsFilters,
  clearSelectedJob,
  setSelectedJobIds,
  toggleJobSelection,
  clearJobSelection,
  clearJobsError,
} = jobsSlice.actions;

export const jobsReducer = jobsSlice.reducer;
