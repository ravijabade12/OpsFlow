import type { Job, JobStatus } from "@opsflow/shared";
import { DEFAULT_PAGE_SIZE } from "@opsflow/shared";

import {
  apiRequest,
  apiRequestWithMeta,
  toQueryString,
} from "./apiClient";

export interface MobileJobsQuery {
  page?: number;
  pageSize?: number;
  agentId?: string;
  status?: JobStatus | "";
}

export interface MobileJobsListResult {
  jobs: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export async function fetchJobs(
  query: MobileJobsQuery = {},
): Promise<MobileJobsListResult> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;

  const result = await apiRequestWithMeta<Job[]>(
    `/jobs${toQueryString({
      _page: page,
      _limit: pageSize,
      agentId: query.agentId || undefined,
      status: query.status || undefined,
      _sort: "dueDate",
      _order: "asc",
    })}`,
  );

  return {
    jobs: result.data,
    totalCount: result.meta.totalCount ?? result.data.length,
    page,
    pageSize,
  };
}

export async function fetchJobById(id: string): Promise<Job> {
  return apiRequest<Job>(`/jobs/${id}`);
}

export async function updateJobStatus(
  id: string,
  status: JobStatus,
): Promise<Job> {
  const body: { status: JobStatus; completedAt?: string } = { status };
  if (status === "completed") {
    body.completedAt = new Date().toISOString();
  }

  return apiRequest<Job>(`/jobs/${id}`, {
    method: "PATCH",
    body,
  });
}
