"use client";

import { useEffect, useMemo, useState } from "react";
import type { Activity, Job } from "@opsflow/shared";

import { MetricCard } from "@/components/data-display/MetricCard";
import {
  JobStatusBadge,
  PriorityBadge,
} from "@/components/data-display/JobBadges";
import { AppShell } from "@/components/layout/AppShell";
import { PageSection } from "@/components/layout/PageSection";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonRows } from "@/components/ui/Skeleton";
import {
  AgentPerformanceChart,
  JobsTrendChart,
  StatusDonutChart,
} from "@/features/analytics/AnalyticsCharts";
import { fetchActivities } from "@/services/activitiesService";
import {
  fetchJobsAnalyticsSample,
  fetchJobsKpiCounts,
  statusCountsFromKpis,
  type JobsKpiCounts,
} from "@/services/analyticsService";
import { fetchJobs } from "@/services/jobsService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAgents, selectAgents } from "@/store/slices/agents";
import {
  buildAgentPerformance,
  buildDashboardKpis,
  buildJobTrends,
  buildStatusDistribution,
} from "@/utils/analytics";
import { formatDateTime } from "@/utils/date";

type LoadState = "idle" | "loading" | "succeeded" | "failed";

export function DashboardPageClient() {
  const dispatch = useAppDispatch();
  const agents = useAppSelector(selectAgents);

  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<JobsKpiCounts | null>(null);
  const [sample, setSample] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const load = async () => {
    setLoadState("loading");
    setError(null);
    try {
      const [kpiCounts, analyticsSample, recent, activityResult] =
        await Promise.all([
          fetchJobsKpiCounts(),
          fetchJobsAnalyticsSample(800),
          fetchJobs({ page: 1, pageSize: 6, sort: "createdAt", order: "desc" }),
          fetchActivities({
            page: 1,
            pageSize: 8,
            sort: "createdAt",
            order: "desc",
          }),
          agents.length > 0
            ? Promise.resolve()
            : dispatch(fetchAgents({ page: 1, pageSize: 500 })),
        ]);

      setCounts(kpiCounts);
      setSample(analyticsSample);
      setRecentJobs(recent.jobs);
      setActivities(activityResult.activities);
      setLoadState("succeeded");
    } catch (err) {
      setLoadState("failed");
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    }
  };

  useEffect(() => {
    // Initial REST fetch for dashboard KPIs/charts.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount data load
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only load
  }, []);

  const kpis = useMemo(() => {
    if (!counts) {
      return null;
    }
    return buildDashboardKpis(counts, sample);
  }, [counts, sample]);

  const trends = useMemo(() => buildJobTrends(sample), [sample]);
  const statusDistribution = useMemo(
    () => (counts ? buildStatusDistribution(statusCountsFromKpis(counts)) : []),
    [counts],
  );
  const agentsById = useMemo(
    () => Object.fromEntries(agents.map((agent) => [agent.id, agent])),
    [agents],
  );
  const agentPerformance = useMemo(
    () => buildAgentPerformance(sample, agentsById, 8),
    [sample, agentsById],
  );

  return (
    <AppShell
      title="Dashboard"
      description="Live operations overview derived from the REST API."
    >
      {loadState === "failed" ? (
        <ErrorState
          title="Unable to load dashboard"
          description={error ?? undefined}
          onRetry={() => {
            void load();
          }}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {loadState === "loading" || !kpis
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))
          : [
              <MetricCard
                key="total"
                label="Total jobs"
                value={kpis.totalJobs.toLocaleString()}
              />,
              <MetricCard
                key="active"
                label="Active jobs"
                value={kpis.activeJobs.toLocaleString()}
                hint="Pending + assigned + in progress"
              />,
              <MetricCard
                key="urgent"
                label="Urgent jobs"
                value={kpis.urgentJobs.toLocaleString()}
                hint="High + critical priority"
              />,
              <MetricCard
                key="completed"
                label="Completed jobs"
                value={kpis.completedJobs.toLocaleString()}
              />,
              <MetricCard
                key="sla"
                label="SLA compliance"
                value={
                  kpis.slaCompliance === null ? "—" : `${kpis.slaCompliance}%`
                }
                hint="Completed on/before due date (sample)"
              />,
            ]}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {loadState === "loading" ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <JobsTrendChart data={trends} />
          )}
        </div>
        <div>
          {loadState === "loading" ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <StatusDonutChart data={statusDistribution} />
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {loadState === "loading" ? (
          <>
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </>
        ) : (
          <>
            <AgentPerformanceChart data={agentPerformance} />
            <Card>
              <CardHeader
                title="Recent activity"
                description="Latest events from the activities feed."
              />
              <CardBody className="space-y-3">
                {activities.length === 0 ? (
                  <p className="text-muted text-sm">No recent activity.</p>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="border-border border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <p className="text-foreground text-sm font-medium">
                        {activity.description}
                      </p>
                      <p className="text-muted mt-1 text-xs">
                        {activity.type.replaceAll("_", " ")} ·{" "}
                        {formatDateTime(activity.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </>
        )}
      </div>

      <PageSection className="mt-6" title="Recent jobs">
        {loadState === "loading" ? (
          <SkeletonRows rows={4} />
        ) : (
          <Card>
            <CardBody className="divide-border divide-y p-0">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-medium">
                      {job.title}
                    </p>
                    <p className="text-muted text-xs">
                      {job.id} · {formatDateTime(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <JobStatusBadge status={job.status} />
                    <PriorityBadge priority={job.priority} />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </PageSection>
    </AppShell>
  );
}
