import type { Job } from "@opsflow/shared";

import { withCache } from "@/lib/queryCache";

import { apiRequestWithMeta, toQueryString } from "./apiClient";
import { fetchJobs, type JobsListResult } from "./jobsService";

const COUNT_TTL_MS = 30_000;

async function countJobs(
  params: Record<string, string | number | undefined>,
): Promise<number> {
  const key = `entity-count:${toQueryString(params)}`;
  return withCache(key, COUNT_TTL_MS, async () => {
    const result = await apiRequestWithMeta<Job[]>(
      `/jobs${toQueryString({
        _page: 1,
        _limit: 1,
        ...params,
      })}`,
    );
    return result.meta.totalCount ?? result.data.length;
  });
}

export interface EntityJobStats {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  slaCompliance: number | null;
}

/**
 * Loads entity workload stats with fewer round-trips:
 * - 5 status counts (total derived as sum)
 * - 1 completed sample for SLA
 * Related job list is fetched separately by the UI in parallel.
 */
export async function fetchEntityJobStats(params: {
  agentId?: string;
  customerId?: string;
}): Promise<EntityJobStats> {
  const base = {
    agentId: params.agentId || undefined,
    customerId: params.customerId || undefined,
  };
  const cacheKey = `entity-stats:${toQueryString(base)}`;

  return withCache(cacheKey, COUNT_TTL_MS, async () => {
    const [
      pending,
      assigned,
      inProgress,
      completed,
      cancelled,
      completedSample,
    ] = await Promise.all([
      countJobs({ ...base, status: "pending" }),
      countJobs({ ...base, status: "assigned" }),
      countJobs({ ...base, status: "in_progress" }),
      countJobs({ ...base, status: "completed" }),
      countJobs({ ...base, status: "cancelled" }),
      fetchJobs({
        ...base,
        status: "completed",
        page: 1,
        pageSize: 80,
        sort: "completedAt",
        order: "desc",
      }),
    ]);

    const eligible = completedSample.jobs.filter(
      (job) => job.completedAt && job.dueDate,
    );
    const met = eligible.filter(
      (job) =>
        new Date(job.completedAt as string).getTime() <=
        new Date(job.dueDate).getTime(),
    );

    return {
      total: pending + assigned + inProgress + completed + cancelled,
      active: pending + assigned + inProgress,
      completed,
      cancelled,
      slaCompliance:
        eligible.length > 0
          ? Math.round((met.length / eligible.length) * 1000) / 10
          : null,
    };
  });
}

export async function fetchRelatedJobs(params: {
  agentId?: string;
  customerId?: string;
  page?: number;
  pageSize?: number;
}): Promise<JobsListResult> {
  return fetchJobs({
    agentId: params.agentId,
    customerId: params.customerId,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
    sort: "dueDate",
    order: "asc",
  });
}
