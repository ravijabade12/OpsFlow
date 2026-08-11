import { createAsyncThunk } from "@reduxjs/toolkit";
import type { JobStatus } from "@opsflow/shared";

import { clearQueryCache } from "@/lib/queryCache";
import { updateJob as updateJobRequest } from "@/services/jobsService";
import { getErrorMessage } from "@/store/asyncState";

import { fetchJobs } from "./jobsThunks";

export const bulkUpdateJobStatus = createAsyncThunk(
  "jobs/bulkUpdateJobStatus",
  async (
    { ids, status }: { ids: string[]; status: JobStatus },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const results = await Promise.all(
        ids.map((id) => updateJobRequest(id, { status })),
      );
      clearQueryCache();
      await dispatch(fetchJobs());
      return results;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update selected jobs"),
      );
    }
  },
);
