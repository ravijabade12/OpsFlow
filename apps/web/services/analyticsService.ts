import type { Job, JobPriority, JobStatus } from "@opsflow/shared";

import { withCache } from "@/lib/queryCache";

import { apiRequestWithMeta, toQueryString } from "./apiClient";
import { fetchJobs } from "./jobsService";

const COUNT_TTL_MS = 30_000;
const SAMPLE_TTL_MS = 45_000;

async function countJobs(
  params: Record<string, string | number | undefined> = {},
): Promise<number> {
  const key = `count:${toQueryString(params)}`;
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

export interface JobsKpiCounts {
  total: number;
  pending: number;
  assigned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  high: number;
  critical: number;
}

export async function fetchJobsKpiCounts(): Promise<JobsKpiCounts> {
  return withCache("kpi:jobs", COUNT_TTL_MS, async () => {
    const [
      total,
      pending,
      assigned,
      inProgress,
      completed,
      cancelled,
      high,
      critical,
    ] = await Promise.all([
      countJobs(),
      countJobs({ status: "pending" }),
      countJobs({ status: "assigned" }),
      countJobs({ status: "in_progress" }),
      countJobs({ status: "completed" }),
      countJobs({ status: "cancelled" }),
      countJobs({ priority: "high" }),
      countJobs({ priority: "critical" }),
    ]);

    return {
      total,
      pending,
      assigned,
      inProgress,
      completed,
      cancelled,
      high,
      critical,
    };
  });
}

export async function fetchJobsAnalyticsSample(limit = 800): Promise<Job[]> {
  return withCache(`sample:jobs:${limit}`, SAMPLE_TTL_MS, async () => {
    const result = await fetchJobs({
      page: 1,
      pageSize: limit,
      sort: "createdAt",
      order: "desc",
    });
    return result.jobs;
  });
}

export async function fetchPriorityCounts(): Promise<
  Record<JobPriority, number>
> {
  return withCache("counts:priority", COUNT_TTL_MS, async () => {
    const [low, medium, high, critical] = await Promise.all([
      countJobs({ priority: "low" }),
      countJobs({ priority: "medium" }),
      countJobs({ priority: "high" }),
      countJobs({ priority: "critical" }),
    ]);

    return { low, medium, high, critical };
  });
}

export function statusCountsFromKpis(
  counts: JobsKpiCounts,
): Record<JobStatus, number> {
  return {
    pending: counts.pending,
    assigned: counts.assigned,
    in_progress: counts.inProgress,
    completed: counts.completed,
    cancelled: counts.cancelled,
  };
}

export async function fetchStatusCounts(): Promise<Record<JobStatus, number>> {
  const counts = await fetchJobsKpiCounts();
  return statusCountsFromKpis(counts);
}
