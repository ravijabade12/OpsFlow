"use client";

import { useEffect, useState } from "react";
import type { Job } from "@opsflow/shared";

import {
  JobStatusBadge,
  PriorityBadge,
} from "@/components/data-display/JobBadges";
import { MetricCard } from "@/components/data-display/MetricCard";
import { AgentAvatar } from "@/components/data-display/AgentAvatar";
import { AgentStatusBadge } from "@/components/data-display/AgentStatusBadge";
import { Drawer } from "@/components/ui/Drawer";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonRows } from "@/components/ui/Skeleton";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import {
  fetchEntityJobStats,
  fetchRelatedJobs,
  type EntityJobStats,
} from "@/services/entityJobsService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedAgent,
  fetchAgentById,
  selectAgentsState,
} from "@/store/slices/agents";
import { formatDate } from "@/utils/date";

export function AgentDetailsDrawer({
  open,
  agentId,
  onClose,
}: {
  open: boolean;
  agentId: string | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { selectedAgent, detailStatus, detailError } =
    useAppSelector(selectAgentsState);

  const [stats, setStats] = useState<EntityJobStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [relatedStatus, setRelatedStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [relatedError, setRelatedError] = useState<string | null>(null);

  const agent =
    selectedAgent && agentId && selectedAgent.id === agentId
      ? selectedAgent
      : null;

  useEffect(() => {
    if (!open || !agentId) {
      return;
    }

    let cancelled = false;

    const loadRelated = async () => {
      setRelatedStatus("loading");
      setRelatedError(null);
      try {
        const [jobStats, related] = await Promise.all([
          fetchEntityJobStats({ agentId }),
          fetchRelatedJobs({ agentId, page: 1, pageSize: 12 }),
        ]);
        if (cancelled) {
          return;
        }
        setStats(jobStats);
        setJobs(related.jobs);
        setRelatedStatus("succeeded");
      } catch (error) {
        if (cancelled) {
          return;
        }
        setRelatedStatus("failed");
        setRelatedError(
          error instanceof Error
            ? error.message
            : "Unable to load assigned jobs",
        );
      }
    };

    void loadRelated();

    return () => {
      cancelled = true;
    };
  }, [open, agentId]);

  return (
    <Drawer
      open={open}
      title={agent?.name ?? "Agent details"}
      description={agent?.email ?? "Inspect agent workload and assigned jobs"}
      onClose={() => {
        dispatch(clearSelectedAgent());
        onClose();
      }}
    >
      {detailStatus === "loading" ? <SkeletonRows rows={4} /> : null}

      {detailStatus === "failed" ? (
        <ErrorState
          title="Unable to load agent"
          description={detailError ?? undefined}
          onRetry={() => {
            if (agentId) {
              void dispatch(fetchAgentById(agentId));
            }
          }}
        />
      ) : null}

      {agent && detailStatus === "succeeded" ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <AgentAvatar name={agent.name} avatar={agent.avatar} />
            <div>
              <p className="text-foreground font-semibold">{agent.name}</p>
              <p className="text-muted text-sm">{agent.phone}</p>
              <div className="mt-2">
                <AgentStatusBadge status={agent.status} />
              </div>
            </div>
          </div>

          {relatedStatus === "loading" || !stats ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : relatedStatus === "failed" ? (
            <ErrorState
              title="Unable to load job stats"
              description={relatedError ?? undefined}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Assigned jobs" value={stats.total} />
              <MetricCard label="Active jobs" value={stats.active} />
              <MetricCard label="Completed jobs" value={stats.completed} />
              <MetricCard
                label="SLA %"
                value={
                  stats.slaCompliance === null ? "—" : `${stats.slaCompliance}%`
                }
                hint="Completed on/before due date"
              />
            </div>
          )}

          <div>
            <h3 className="text-foreground mb-2 text-sm font-semibold">
              Assigned jobs
            </h3>
            {relatedStatus === "loading" ? <SkeletonRows rows={5} /> : null}
            {relatedStatus === "succeeded" && jobs.length === 0 ? (
              <p className="text-muted text-sm">
                No jobs assigned to this agent.
              </p>
            ) : null}
            {relatedStatus === "succeeded" && jobs.length > 0 ? (
              <div className="border-border overflow-hidden rounded-md border">
                <Table>
                  <THead>
                    <TR>
                      <TH>Job</TH>
                      <TH>Status</TH>
                      <TH>Priority</TH>
                      <TH>Due</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {jobs.map((job) => (
                      <TR key={job.id}>
                        <TD>
                          <p className="max-w-[12rem] truncate font-medium">
                            {job.title}
                          </p>
                          <p className="text-muted text-xs">{job.id}</p>
                        </TD>
                        <TD>
                          <JobStatusBadge status={job.status} />
                        </TD>
                        <TD>
                          <PriorityBadge priority={job.priority} />
                        </TD>
                        <TD className="whitespace-nowrap">
                          {formatDate(job.dueDate)}
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
