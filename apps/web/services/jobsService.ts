import type { Job, JobPriority, JobStatus } from "@opsflow/shared";
import { DEFAULT_PAGE_SIZE } from "@opsflow/shared";

import {
  apiRequest,
  apiRequestWithMeta,
  toQueryString,
  type ApiResult,
} from "./apiClient";

export interface JobsQuery {
  page?: number;
  pageSize?: number;
  status?: JobStatus | "";
  priority?: JobPriority | "";
  agentId?: string;
  customerId?: string;
  q?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export type CreateJobInput = Omit<Job, "id" | "completedAt"> & {
  id?: string;
  completedAt?: string;
};

export type UpdateJobInput = Partial<
  Omit<Job, "id"> & {
    completedAt?: string | null;
  }
>;

export interface JobsListResult {
  jobs: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
}

function buildJobsPath(query: JobsQuery = {}): string {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;

  return `/jobs${toQueryString({
    _page: page,
    _limit: pageSize,
    status: query.status || undefined,
    priority: query.priority || undefined,
    agentId: query.agentId || undefined,
    customerId: query.customerId || undefined,
    q: query.q || undefined,
    _sort: query.sort || undefined,
    _order: query.order || undefined,
  })}`;
}

export async function fetchJobs(
  query: JobsQuery = {},
): Promise<JobsListResult> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const result: ApiResult<Job[]> = await apiRequestWithMeta(
    buildJobsPath(query),
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

export async function createJob(input: CreateJobInput): Promise<Job> {
  return apiRequest<Job>("/jobs", {
    method: "POST",
    body: input,
  });
}

export async function updateJob(
  id: string,
  patch: UpdateJobInput,
): Promise<Job> {
  return apiRequest<Job>(`/jobs/${id}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function deleteJob(id: string): Promise<void> {
  await apiRequest<void>(`/jobs/${id}`, {
    method: "DELETE",
  });
}

/** @deprecated Use named exports; kept for Phase 1 placeholder compatibility. */
export const jobsService = {
  fetchJobs,
  fetchJobById,
  createJob,
  updateJob,
  deleteJob,
};
