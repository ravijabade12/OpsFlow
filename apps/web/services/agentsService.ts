import type { Agent } from "@opsflow/shared";

import { apiRequest, apiRequestWithMeta, toQueryString } from "./apiClient";

export interface AgentsQuery {
  page?: number;
  pageSize?: number;
  status?: Agent["status"] | "";
  q?: string;
}

export interface AgentsListResult {
  agents: Agent[];
  totalCount: number;
}

export async function fetchAgents(
  query: AgentsQuery = {},
): Promise<AgentsListResult> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 50;
  const result = await apiRequestWithMeta<Agent[]>(
    `/agents${toQueryString({
      _page: page,
      _limit: pageSize,
      status: query.status || undefined,
      q: query.q || undefined,
    })}`,
  );

  return {
    agents: result.data,
    totalCount: result.meta.totalCount ?? result.data.length,
  };
}

export async function fetchAgentById(id: string): Promise<Agent> {
  return apiRequest<Agent>(`/agents/${id}`);
}
