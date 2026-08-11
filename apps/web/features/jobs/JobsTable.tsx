"use client";

import { memo } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import type { Agent, Customer, Job } from "@opsflow/shared";

import {
  JobStatusBadge,
  PriorityBadge,
} from "@/components/data-display/JobBadges";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectJobsFilters,
  selectJobsSelectedIds,
  setJobsFilters,
  setSelectedJobIds,
  toggleJobSelection,
} from "@/store/slices/jobs";
import { formatDate } from "@/utils/date";

type SortKey = "createdAt" | "dueDate" | "priority" | "status" | "title";

function SortHeader({ label, column }: { label: string; column: SortKey }) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectJobsFilters);
  const active = filters.sort === column;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        active ? "text-foreground" : "text-muted",
      )}
      onClick={() => {
        if (active) {
          dispatch(
            setJobsFilters({
              order: filters.order === "asc" ? "desc" : "asc",
            }),
          );
        } else {
          dispatch(setJobsFilters({ sort: column, order: "asc" }));
        }
      }}
    >
      {label}
      {active ? (
        filters.order === "asc" ? (
          <CaretUp size={12} weight="bold" />
        ) : (
          <CaretDown size={12} weight="bold" />
        )
      ) : null}
    </button>
  );
}

export const JobsTable = memo(function JobsTable({
  jobs,
  agentsById,
  customersById,
  onOpenJob,
}: {
  jobs: Job[];
  agentsById: Record<string, Agent>;
  customersById: Record<string, Customer>;
  onOpenJob: (jobId: string) => void;
}) {
  const dispatch = useAppDispatch();
  const selectedIds = useAppSelector(selectJobsSelectedIds);
  const allSelected =
    jobs.length > 0 && jobs.every((job) => selectedIds.includes(job.id));

  return (
    <Table>
      <THead>
        <TR>
          <TH className="w-10">
            <input
              type="checkbox"
              aria-label="Select all jobs on this page"
              checked={allSelected}
              onChange={(event) => {
                if (event.target.checked) {
                  dispatch(setSelectedJobIds(jobs.map((job) => job.id)));
                } else {
                  dispatch(setSelectedJobIds([]));
                }
              }}
            />
          </TH>
          <TH>
            <SortHeader label="Title" column="title" />
          </TH>
          <TH>
            <SortHeader label="Status" column="status" />
          </TH>
          <TH>
            <SortHeader label="Priority" column="priority" />
          </TH>
          <TH>Customer</TH>
          <TH>Agent</TH>
          <TH>
            <SortHeader label="Created" column="createdAt" />
          </TH>
          <TH>
            <SortHeader label="Due" column="dueDate" />
          </TH>
          <TH className="w-24">Actions</TH>
        </TR>
      </THead>
      <TBody>
        {jobs.map((job) => {
          const customer = customersById[job.customerId];
          const agent = job.agentId ? agentsById[job.agentId] : undefined;

          return (
            <TR key={job.id}>
              <TD>
                <input
                  type="checkbox"
                  aria-label={`Select ${job.title}`}
                  checked={selectedIds.includes(job.id)}
                  onChange={() => dispatch(toggleJobSelection(job.id))}
                />
              </TD>
              <TD>
                <div className="max-w-[16rem]">
                  <p className="text-foreground truncate font-medium">
                    {job.title}
                  </p>
                  <p className="text-muted truncate text-xs">{job.id}</p>
                </div>
              </TD>
              <TD>
                <JobStatusBadge status={job.status} />
              </TD>
              <TD>
                <PriorityBadge priority={job.priority} />
              </TD>
              <TD className="whitespace-nowrap">
                {customer?.name ?? job.customerId}
              </TD>
              <TD className="whitespace-nowrap">
                {agent?.name ?? (job.agentId ? job.agentId : "Unassigned")}
              </TD>
              <TD className="whitespace-nowrap">{formatDate(job.createdAt)}</TD>
              <TD className="whitespace-nowrap">{formatDate(job.dueDate)}</TD>
              <TD>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenJob(job.id)}
                >
                  View
                </Button>
              </TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
});
