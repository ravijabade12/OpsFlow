import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearQueryCache,
  getCached,
  setCached,
  withCache,
} from "@/lib/queryCache";
import { cn } from "@/lib/cn";
import {
  formatDate,
  formatDateTime,
  fromDateInputValue,
  toDateInputValue,
} from "@/utils/date";
import {
  buildDashboardKpis,
  buildPriorityDistribution,
  buildStatusDistribution,
  filterJobsByDateRange,
} from "@/utils/analytics";
import type { Job } from "@opsflow/shared";

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "job-1",
    title: "Fix HVAC",
    description: "Unit not cooling",
    status: "completed",
    priority: "high",
    customerId: "cust-1",
    agentId: "agent-1",
    location: "Pune",
    createdAt: "2026-01-10T00:00:00.000Z",
    dueDate: "2026-01-20T00:00:00.000Z",
    completedAt: "2026-01-18T00:00:00.000Z",
    ...overrides,
  };
}

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4", false && "hidden", "text-sm")).toBe(
      "px-4 text-sm",
    );
  });
});

describe("date utils", () => {
  it("formatDate returns em dash for empty/invalid values", () => {
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate(null)).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });

  it("formatDate formats a valid ISO date", () => {
    expect(formatDate("2026-03-15T12:00:00.000Z")).toMatch(/2026/);
  });

  it("formatDateTime formats a valid ISO timestamp", () => {
    expect(formatDateTime("2026-03-15T12:30:00.000Z")).toMatch(/2026/);
  });

  it("toDateInputValue and fromDateInputValue round-trip the calendar day", () => {
    expect(toDateInputValue("2026-04-01T15:00:00.000Z")).toBe("2026-04-01");
    expect(fromDateInputValue("2026-04-01")).toBe("2026-04-01T00:00:00.000Z");
    expect(toDateInputValue(undefined)).toBe("");
  });
});

describe("queryCache", () => {
  beforeEach(() => {
    clearQueryCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    clearQueryCache();
  });

  it("stores and returns values within TTL", () => {
    setCached("k", { n: 1 }, 1000);
    expect(getCached<{ n: number }>("k")).toEqual({ n: 1 });
  });

  it("expires values after TTL", () => {
    setCached("k", "v", 500);
    vi.advanceTimersByTime(501);
    expect(getCached("k")).toBeUndefined();
  });

  it("withCache avoids reloading while warm", async () => {
    const loader = vi.fn().mockResolvedValue("fresh");
    await expect(withCache("jobs", 1000, loader)).resolves.toBe("fresh");
    await expect(withCache("jobs", 1000, loader)).resolves.toBe("fresh");
    expect(loader).toHaveBeenCalledTimes(1);
  });
});

describe("analytics utils", () => {
  it("buildDashboardKpis derives active/urgent totals and SLA %", () => {
    const kpis = buildDashboardKpis(
      {
        total: 100,
        pending: 10,
        assigned: 20,
        inProgress: 5,
        completed: 60,
        high: 8,
        critical: 2,
      },
      [
        makeJob({
          completedAt: "2026-01-15T00:00:00.000Z",
          dueDate: "2026-01-20T00:00:00.000Z",
        }),
        makeJob({
          id: "job-2",
          completedAt: "2026-01-25T00:00:00.000Z",
          dueDate: "2026-01-20T00:00:00.000Z",
        }),
      ],
    );

    expect(kpis).toEqual({
      totalJobs: 100,
      activeJobs: 35,
      urgentJobs: 10,
      completedJobs: 60,
      slaCompliance: 50,
    });
  });

  it("buildStatusDistribution and buildPriorityDistribution map labels", () => {
    expect(
      buildStatusDistribution({
        pending: 1,
        assigned: 2,
        in_progress: 3,
        completed: 4,
        cancelled: 0,
      }),
    ).toContainEqual({ key: "in_progress", label: "In progress", value: 3 });

    expect(
      buildPriorityDistribution({
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
      }),
    ).toContainEqual({ key: "critical", label: "Critical", value: 4 });
  });

  it("filterJobsByDateRange keeps jobs created inside the window", () => {
    const jobs = [
      makeJob({ id: "a", createdAt: "2026-01-05T00:00:00.000Z" }),
      makeJob({ id: "b", createdAt: "2026-02-10T00:00:00.000Z" }),
      makeJob({ id: "c", createdAt: "2026-03-01T00:00:00.000Z" }),
    ];
    expect(
      filterJobsByDateRange(jobs, "2026-02-01", "2026-02-28").map((j) => j.id),
    ).toEqual(["b"]);
  });
});
