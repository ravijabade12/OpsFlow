import { createAsyncThunk } from "@reduxjs/toolkit";

import { clearQueryCache } from "@/lib/queryCache";
import {
  createJob as createJobRequest,
  deleteJob as deleteJobRequest,
  fetchJobById as fetchJobByIdRequest,
  fetchJobs as fetchJobsRequest,
  updateJob as updateJobRequest,
  type CreateJobInput,
  type JobsQuery,
  type UpdateJobInput,
} from "@/services/jobsService";
import { getErrorMessage } from "@/store/asyncState";
import type { RootState } from "@/store/rootReducer";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (query: JobsQuery | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { page, pageSize, filters } = state.jobs;

      return await fetchJobsRequest({
        page,
        pageSize,
        status: filters.status,
        priority: filters.priority,
        agentId: filters.agentId,
        customerId: filters.customerId,
        q: filters.q,
        sort: filters.sort,
        order: filters.order,
        ...query,
      });
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

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (input: CreateJobInput, { rejectWithValue }) => {
    try {
      const job = await createJobRequest(input);
      clearQueryCache();
      return job;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to create job"));
    }
  },
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (
    { id, patch }: { id: string; patch: UpdateJobInput },
    { rejectWithValue },
  ) => {
    try {
      const job = await updateJobRequest(id, patch);
      clearQueryCache();
      return job;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to update job"));
    }
  },
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteJobRequest(id);
      clearQueryCache();
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to delete job"));
    }
  },
);
