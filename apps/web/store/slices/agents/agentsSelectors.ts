import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/store/rootReducer";

export const selectAgentsState = (state: RootState) => state.agents;

export const selectAgents = (state: RootState) => state.agents.data;

export const selectAgentsStatus = (state: RootState) => state.agents.status;

export const selectAgentsError = (state: RootState) => state.agents.error;

export const selectSelectedAgent = (state: RootState) =>
  state.agents.selectedAgent;

export const selectAgentsIsLoading = (state: RootState) =>
  state.agents.status === "loading";

export const selectAgentsIsEmpty = (state: RootState) =>
  state.agents.status === "succeeded" && state.agents.data.length === 0;

export const selectAgentById = (id: string) => (state: RootState) =>
  state.agents.data.find((agent) => agent.id === id) ??
  (state.agents.selectedAgent?.id === id
    ? state.agents.selectedAgent
    : undefined);

/** Memoized id→agent map for table joins without rebuilding every render. */
export const selectAgentsById = createSelector([selectAgents], (agents) =>
  Object.fromEntries(agents.map((agent) => [agent.id, agent])),
);
