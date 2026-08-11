import type { Agent } from "@opsflow/shared";

import type { AsyncStatus } from "../../asyncState";

export interface AgentsState {
  data: Agent[];
  selectedAgent: Agent | null;
  status: AsyncStatus;
  detailStatus: AsyncStatus;
  error: string | null;
  detailError: string | null;
  totalCount: number;
}

export const agentsInitialState: AgentsState = {
  data: [],
  selectedAgent: null,
  status: "idle",
  detailStatus: "idle",
  error: null,
  detailError: null,
  totalCount: 0,
};
