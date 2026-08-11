import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchAgentById as fetchAgentByIdRequest,
  fetchAgents as fetchAgentsRequest,
  type AgentsQuery,
} from "@/services/agentsService";
import { getErrorMessage } from "@/store/asyncState";

export const fetchAgents = createAsyncThunk(
  "agents/fetchAgents",
  async (query: AgentsQuery | undefined, { rejectWithValue }) => {
    try {
      return await fetchAgentsRequest(query);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load agents"));
    }
  },
);

export const fetchAgentById = createAsyncThunk(
  "agents/fetchAgentById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchAgentByIdRequest(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load agent"));
    }
  },
);
