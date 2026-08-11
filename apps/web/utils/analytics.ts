import type { Agent, Job, JobPriority, JobStatus } from "@opsflow/shared";

export interface DashboardKpis {
  totalJobs: number;
  activeJobs: number;
  urgentJobs: number;
  completedJobs: number;
  slaCompliance: number | null;
}

export function buildDashboardKpis(
  counts: {
    total: number;
    pending: number;
    assigned: number;
    inProgress: number;
    completed: number;
    high: number;
    critical: number;
  },
  completedSample: Job[],
): DashboardKpis {
  const slaEligible = completedSample.filter(
    (job) => job.status === "completed" && job.completedAt && job.dueDate,
  );
  const slaMet = slaEligible.filter(
    (job) =>
      new Date(job.completedAt as string).getTime() <=
      new Date(job.dueDate).getTime(),
  );

  return {
    totalJobs: counts.total,
    activeJobs: counts.pending + counts.assigned + counts.inProgress,
    urgentJobs: counts.high + counts.critical,
    completedJobs: counts.completed,
    slaCompliance:
      slaEligible.length > 0
        ? Math.round((slaMet.length / slaEligible.length) * 1000) / 10
        : null,
  };
}

export interface TrendPoint {
  label: string;
  created: number;
  completed: number;
}

function weekKey(iso: string): string {
  const date = new Date(iso);
  const utc = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function buildJobTrends(
  jobs: Job[],
  options: { from?: string; to?: string } = {},
): TrendPoint[] {
  const fromMs = options.from ? new Date(options.from).getTime() : null;
  const toMs = options.to ? new Date(options.to).getTime() : null;
  const map = new Map<string, TrendPoint>();

  for (const job of jobs) {
    const createdMs = new Date(job.createdAt).getTime();
    if (fromMs !== null && createdMs < fromMs) {
      continue;
    }
    if (toMs !== null && createdMs > toMs) {
      continue;
    }

    const createdKey = weekKey(job.createdAt);
    const createdPoint = map.get(createdKey) ?? {
      label: createdKey,
      created: 0,
      completed: 0,
    };
    createdPoint.created += 1;
    map.set(createdKey, createdPoint);

    if (job.completedAt) {
      const completedMs = new Date(job.completedAt).getTime();
      if (fromMs !== null && completedMs < fromMs) {
        continue;
      }
      if (toMs !== null && completedMs > toMs) {
        continue;
      }
      const completedKey = weekKey(job.completedAt);
      const completedPoint = map.get(completedKey) ?? {
        label: completedKey,
        created: 0,
        completed: 0,
      };
      completedPoint.completed += 1;
      map.set(completedKey, completedPoint);
    }
  }

  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export interface StatusSlice {
  key: JobStatus;
  label: string;
  value: number;
}

const statusLabels: Record<JobStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function buildStatusDistribution(
  counts: Record<JobStatus, number>,
): StatusSlice[] {
  return (Object.keys(counts) as JobStatus[]).map((key) => ({
    key,
    label: statusLabels[key],
    value: counts[key],
  }));
}

export interface PrioritySlice {
  key: JobPriority;
  label: string;
  value: number;
}

export function buildPriorityDistribution(
  counts: Record<JobPriority, number>,
): PrioritySlice[] {
  return (Object.keys(counts) as JobPriority[]).map((key) => ({
    key,
    label: key[0].toUpperCase() + key.slice(1),
    value: counts[key],
  }));
}

export interface AgentPerformanceRow {
  agentId: string;
  name: string;
  completed: number;
}

export function buildAgentPerformance(
  jobs: Job[],
  agentsById: Record<string, Agent>,
  limit = 8,
): AgentPerformanceRow[] {
  const counts = new Map<string, number>();

  for (const job of jobs) {
    if (job.status !== "completed" || !job.agentId) {
      continue;
    }
    counts.set(job.agentId, (counts.get(job.agentId) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([agentId, completed]) => ({
      agentId,
      name: agentsById[agentId]?.name ?? agentId,
      completed,
    }))
    .sort((a, b) => b.completed - a.completed)
    .slice(0, limit);
}

export function filterJobsByDateRange(
  jobs: Job[],
  from?: string,
  to?: string,
): Job[] {
  const fromMs = from ? new Date(from).getTime() : null;
  const toMs = to ? new Date(`${to}T23:59:59.999Z`).getTime() : null;

  return jobs.filter((job) => {
    const createdMs = new Date(job.createdAt).getTime();
    if (fromMs !== null && createdMs < fromMs) {
      return false;
    }
    if (toMs !== null && createdMs > toMs) {
      return false;
    }
    return true;
  });
}
