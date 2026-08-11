import { createSlice } from "@reduxjs/toolkit";

import { fetchAgentById, fetchAgents } from "./agentsThunks";
import { agentsInitialState } from "./agentsTypes";

function asErrorMessage(payload: unknown, fallback: string): string {
  return typeof payload === "string" && payload.trim() ? payload : fallback;
}

const agentsSlice = createSlice({
  name: "agents",
  initialState: agentsInitialState,
  reducers: {
    clearSelectedAgent(state) {
      state.selectedAgent = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
    clearAgentsError(state) {
      state.error = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.agents;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.status = "failed";
        state.error = asErrorMessage(action.payload, "Unable to load agents");
      })
      .addCase(fetchAgentById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchAgentById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedAgent = action.payload;
        const index = state.data.findIndex(
          (agent) => agent.id === action.payload.id,
        );
        if (index >= 0) {
          state.data[index] = action.payload;
        }
      })
      .addCase(fetchAgentById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = asErrorMessage(
          action.payload,
          "Unable to load agent",
        );
      });
  },
});

export const { clearSelectedAgent, clearAgentsError } = agentsSlice.actions;
export const agentsReducer = agentsSlice.reducer;
