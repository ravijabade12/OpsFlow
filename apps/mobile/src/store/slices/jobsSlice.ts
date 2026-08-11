import type { Job } from "@opsflow/shared";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchJobById as fetchJobByIdRequest,
  fetchJobs as fetchJobsRequest,
  updateJobStatus as updateJobStatusRequest,
  type MobileJobsQuery,
} from "../../services/jobsService";

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

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
  hasMore: boolean;
  /** Demo agent filter for the field-agent app until auth exists. */
  agentId: string;
}

const initialState: JobsState = {
  data: [],
  selectedJob: null,
  status: "idle",
  detailStatus: "idle",
  mutationStatus: "idle",
  error: null,
  detailError: null,
  mutationError: null,
  page: 1,
  pageSize: 30,
  totalCount: 0,
  hasMore: true,
  agentId: "agent-001",
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

function asErrorMessage(payload: unknown, fallback: string): string {
  return typeof payload === "string" && payload.trim() ? payload : fallback;
}

type FetchJobsArg = MobileJobsQuery & {
  append?: boolean;
  refresh?: boolean;
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (query: FetchJobsArg | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { jobs: JobsState };
      const append = query?.append ?? false;
      const refresh = query?.refresh ?? false;
      const page = append ? state.jobs.page + 1 : 1;
      const pageSize = query?.pageSize ?? state.jobs.pageSize;

      const result = await fetchJobsRequest({
        page,
        pageSize,
        agentId: query?.agentId ?? state.jobs.agentId,
        status: query?.status,
      });

      return {
        ...result,
        append,
        refresh,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load jobs"));
    }
  },
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchJobByIdRequest(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load job"));
    }
  },
);

export const updateJobStatus = createAsyncThunk(
  "jobs/updateJobStatus",
  async (
    { id, status }: { id: string; status: Job["status"] },
    { rejectWithValue },
  ) => {
    try {
      return await updateJobStatusRequest(id, status);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update job status"),
      );
    }
  },
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setAgentId(state, action: PayloadAction<string>) {
      state.agentId = action.payload;
      state.page = 1;
      state.data = [];
      state.hasMore = true;
    },
    setJobsPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload);
    },
    clearSelectedJob(state) {
      state.selectedJob = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state, action) => {
        const append = action.meta.arg?.append ?? false;
        if (!append) {
          state.status = "loading";
          state.error = null;
        }
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.hasMore =
          action.payload.page * action.payload.pageSize <
          action.payload.totalCount;

        if (action.payload.append) {
          const existing = new Set(state.data.map((job) => job.id));
          state.data = [
            ...state.data,
            ...action.payload.jobs.filter((job) => !existing.has(job.id)),
          ];
        } else {
          state.data = action.payload.jobs;
        }
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
        const index = state.data.findIndex((job) => job.id === action.payload.id);
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
      .addCase(updateJobStatus.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const index = state.data.findIndex((job) => job.id === action.payload.id);
        if (index >= 0) {
          state.data[index] = action.payload;
        }
        if (state.selectedJob?.id === action.payload.id) {
          state.selectedJob = action.payload;
        }
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = asErrorMessage(
          action.payload,
          "Unable to update job status",
        );
      });
  },
});

export const { setAgentId, setJobsPage, clearSelectedJob } = jobsSlice.actions;
export const jobsReducer = jobsSlice.reducer;

export const selectJobs = (state: { jobs: JobsState }) => state.jobs.data;
export const selectJobsStatus = (state: { jobs: JobsState }) => state.jobs.status;
export const selectJobsError = (state: { jobs: JobsState }) => state.jobs.error;
export const selectSelectedJob = (state: { jobs: JobsState }) =>
  state.jobs.selectedJob;
export const selectJobsIsEmpty = (state: { jobs: JobsState }) =>
  state.jobs.status === "succeeded" && state.jobs.data.length === 0;
export const selectJobsHasMore = (state: { jobs: JobsState }) =>
  state.jobs.hasMore;
export const selectJobsDetailStatus = (state: { jobs: JobsState }) =>
  state.jobs.detailStatus;
export const selectJobsDetailError = (state: { jobs: JobsState }) =>
  state.jobs.detailError;
export const selectJobsMutationStatus = (state: { jobs: JobsState }) =>
  state.jobs.mutationStatus;
export const selectJobsMutationError = (state: { jobs: JobsState }) =>
  state.jobs.mutationError;
export const selectJobsAgentId = (state: { jobs: JobsState }) =>
  state.jobs.agentId;
export const selectJobsTotalCount = (state: { jobs: JobsState }) =>
  state.jobs.totalCount;
