"use client";

import type { JobStatus } from "@opsflow/shared";
import type { Agent, Customer, Job } from "@opsflow/shared";

import {
  JobStatusBadge,
  PriorityBadge,
} from "@/components/data-display/JobBadges";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { ErrorState } from "@/components/ui/ErrorState";
import { Select } from "@/components/ui/Select";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteJob,
  fetchJobById,
  selectJobsState,
  updateJob,
} from "@/store/slices/jobs";
import { formatDateTime } from "@/utils/date";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function JobDetailsDrawer({
  open,
  jobId,
  agentsById,
  customersById,
  onClose,
  onEdit,
}: {
  open: boolean;
  jobId: string | null;
  agentsById: Record<string, Agent>;
  customersById: Record<string, Customer>;
  onClose: () => void;
  onEdit: (job: Job) => void;
}) {
  const dispatch = useAppDispatch();
  const { selectedJob, detailStatus, detailError, mutationStatus } =
    useAppSelector(selectJobsState);

  const job =
    selectedJob && jobId && selectedJob.id === jobId ? selectedJob : null;
  const customer = job ? customersById[job.customerId] : undefined;
  const agent = job?.agentId ? agentsById[job.agentId] : undefined;

  return (
    <Drawer
      open={open}
      title={job?.title ?? "Job details"}
      description={job?.id ?? "Inspect and update a job"}
      onClose={onClose}
      footer={
        job ? (
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="danger"
              disabled={mutationStatus === "loading"}
              onClick={() => {
                void dispatch(deleteJob(job.id)).then((result) => {
                  if (deleteJob.fulfilled.match(result)) {
                    onClose();
                  }
                });
              }}
            >
              Delete
            </Button>
            <Button variant="secondary" onClick={() => onEdit(job)}>
              Edit
            </Button>
          </div>
        ) : null
      }
    >
      {detailStatus === "loading" ? <SkeletonRows rows={6} /> : null}

      {detailStatus === "failed" ? (
        <ErrorState
          title="Unable to load job"
          description={detailError ?? undefined}
          onRetry={() => {
            if (jobId) {
              void dispatch(fetchJobById(jobId));
            }
          }}
        />
      ) : null}

      {job && detailStatus === "succeeded" ? (
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <JobStatusBadge status={job.status} />
            <PriorityBadge priority={job.priority} />
          </div>

          <p className="text-foreground leading-relaxed">{job.description}</p>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-muted text-xs">Customer</dt>
              <dd className="mt-1 font-medium">
                {customer?.name ?? job.customerId}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Agent</dt>
              <dd className="mt-1 font-medium">
                {agent?.name ?? (job.agentId ? job.agentId : "Unassigned")}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Location</dt>
              <dd className="mt-1 font-medium">{job.location}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Created</dt>
              <dd className="mt-1 font-medium">
                {formatDateTime(job.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Due</dt>
              <dd className="mt-1 font-medium">
                {formatDateTime(job.dueDate)}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Completed</dt>
              <dd className="mt-1 font-medium">
                {formatDateTime(job.completedAt)}
              </dd>
            </div>
          </dl>

          <Select
            label="Update status"
            options={statusOptions}
            value={job.status}
            disabled={mutationStatus === "loading"}
            onChange={(event) => {
              const status = event.target.value as JobStatus;
              void dispatch(
                updateJob({
                  id: job.id,
                  patch: {
                    status,
                    completedAt:
                      status === "completed"
                        ? new Date().toISOString()
                        : undefined,
                  },
                }),
              );
            }}
          />
        </div>
      ) : null}
    </Drawer>
  );
}
