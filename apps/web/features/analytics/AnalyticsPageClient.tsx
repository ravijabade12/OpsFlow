"use client";

import { useEffect, useMemo, useState } from "react";
import type { Job } from "@opsflow/shared";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  AgentPerformanceChart,
  JobVolumeAreaChart,
  JobsTrendChart,
  PriorityDonutChart,
  StatusDonutChart,
} from "@/features/analytics/AnalyticsCharts";
import {
  fetchJobsAnalyticsSample,
  fetchJobsKpiCounts,
  fetchPriorityCounts,
  statusCountsFromKpis,
} from "@/services/analyticsService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAgents, selectAgents } from "@/store/slices/agents";
import {
  buildAgentPerformance,
  buildDashboardKpis,
  buildJobTrends,
  buildPriorityDistribution,
  buildStatusDistribution,
  filterJobsByDateRange,
} from "@/utils/analytics";
import { MetricCard } from "@/components/data-display/MetricCard";
import { toDateInputValue } from "@/utils/date";

type LoadState = "idle" | "loading" | "succeeded" | "failed";

export function AnalyticsPageClient() {
  const dispatch = useAppDispatch();
  const agents = useAppSelector(selectAgents);

  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [sample, setSample] = useState<Job[]>([]);
  const [priorityCounts, setPriorityCounts] = useState<Record<
    string,
    number
  > | null>(null);
  const [counts, setCounts] = useState<Awaited<
    ReturnType<typeof fetchJobsKpiCounts>
  > | null>(null);

  const [from, setFrom] = useState(() =>
    toDateInputValue(new Date(Date.UTC(2025, 9, 1)).toISOString()),
  );
  const [to, setTo] = useState(() =>
    toDateInputValue(new Date(Date.UTC(2026, 1, 15)).toISOString()),
  );

  const load = async () => {
    setLoadState("loading");
    setError(null);
    try {
      const [kpiCounts, analyticsSample, priorities] = await Promise.all([
        fetchJobsKpiCounts(),
        fetchJobsAnalyticsSample(800),
        fetchPriorityCounts(),
        agents.length > 0
          ? Promise.resolve()
          : dispatch(fetchAgents({ page: 1, pageSize: 500 })),
      ]);
      setCounts(kpiCounts);
      setSample(analyticsSample);
      setPriorityCounts(priorities);
      setLoadState("succeeded");
    } catch (err) {
      setLoadState("failed");
      setError(err instanceof Error ? err.message : "Unable to load analytics");
    }
  };

  useEffect(() => {
    // Initial REST fetch for analytics page.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount data load
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only load
  }, []);

  const rangedSample = useMemo(
    () => filterJobsByDateRange(sample, from, to),
    [sample, from, to],
  );

  const trends = useMemo(
    () => buildJobTrends(sample, { from, to }),
    [sample, from, to],
  );

  const agentsById = useMemo(
    () => Object.fromEntries(agents.map((agent) => [agent.id, agent])),
    [agents],
  );

  const agentPerformance = useMemo(
    () => buildAgentPerformance(rangedSample, agentsById, 10),
    [rangedSample, agentsById],
  );

  const kpis = useMemo(() => {
    if (!counts) {
      return null;
    }
    return buildDashboardKpis(counts, rangedSample);
  }, [counts, rangedSample]);

  const statusDistribution = useMemo(
    () => (counts ? buildStatusDistribution(statusCountsFromKpis(counts)) : []),
    [counts],
  );

  const priorityDistribution = useMemo(
    () =>
      priorityCounts
        ? buildPriorityDistribution(
            priorityCounts as Parameters<typeof buildPriorityDistribution>[0],
          )
        : [],
    [priorityCounts],
  );

  return (
    <AppShell
      title="Analytics"
      description="Trends and distributions derived from the REST API (no aggregation backend)."
    >
      <div className="border-border bg-surface mb-4 flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <Input
            label="From"
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
          <Input
            label="To"
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setFrom(
              toDateInputValue(new Date(Date.UTC(2025, 9, 1)).toISOString()),
            );
            setTo(
              toDateInputValue(new Date(Date.UTC(2026, 1, 15)).toISOString()),
            );
          }}
        >
          Reset range
        </Button>
      </div>

      <p className="text-muted mb-4 text-xs">
        Date range filters trend/agent charts from a{" "}
        {sample.length.toLocaleString()}
        -job sample. Status and priority donuts use full-dataset API totals.
      </p>

      {loadState === "failed" ? (
        <ErrorState
          title="Unable to load analytics"
          description={error ?? undefined}
          onRetry={() => {
            void load();
          }}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {loadState === "loading" || !kpis
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))
          : [
              <MetricCard
                key="sample"
                label="Sample jobs in range"
                value={rangedSample.length.toLocaleString()}
              />,
              <MetricCard
                key="total"
                label="Total jobs (API)"
                value={kpis.totalJobs.toLocaleString()}
              />,
              <MetricCard
                key="completed"
                label="Completed (API)"
                value={kpis.completedJobs.toLocaleString()}
              />,
              <MetricCard
                key="sla"
                label="SLA (sample in range)"
                value={
                  kpis.slaCompliance === null ? "—" : `${kpis.slaCompliance}%`
                }
              />,
            ]}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {loadState === "loading" ? (
          <>
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </>
        ) : (
          <>
            <JobsTrendChart data={trends} />
            <JobVolumeAreaChart data={trends} />
            <StatusDonutChart data={statusDistribution} />
            <PriorityDonutChart data={priorityDistribution} />
            <div className="xl:col-span-2">
              <AgentPerformanceChart data={agentPerformance} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
