"use client";

import { MagnifyingGlass, Funnel, Plus, X } from "@phosphor-icons/react";
import type { JobStatus } from "@opsflow/shared";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  bulkUpdateJobStatus,
  clearJobSelection,
  resetJobsFilters,
  selectHasActiveJobFilters,
  selectJobsFilters,
  selectJobsSelectedIds,
} from "@/store/slices/jobs";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function JobsToolbar({
  search,
  onSearchChange,
  onOpenFilters,
  onCreate,
  mutationBusy,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  onCreate: () => void;
  mutationBusy?: boolean;
}) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectJobsFilters);
  const hasFilters = useAppSelector(selectHasActiveJobFilters);
  const selectedIds = useAppSelector(selectJobsSelectedIds);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative min-w-0 flex-1">
            <span className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              <MagnifyingGlass size={16} />
            </span>
            <Input
              aria-label="Search jobs"
              placeholder="Search title, description, location…"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-9"
            />
            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                className="text-muted hover:bg-surface-muted hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1"
                onClick={() => onSearchChange("")}
              >
                <X size={14} weight="bold" />
              </button>
            ) : null}
          </div>
          <Button variant="secondary" onClick={onOpenFilters}>
            <Funnel size={16} weight="bold" />
            Filters
            {hasFilters ? <Badge tone="accent">Active</Badge> : null}
          </Button>
        </div>
        <Button onClick={onCreate}>
          <Plus size={16} weight="bold" />
          Create job
        </Button>
      </div>

      {hasFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          {filters.status ? (
            <Badge tone="info">Status: {filters.status}</Badge>
          ) : null}
          {filters.priority ? (
            <Badge tone="warning">Priority: {filters.priority}</Badge>
          ) : null}
          {filters.agentId ? (
            <Badge tone="accent">Agent: {filters.agentId}</Badge>
          ) : null}
          {filters.customerId ? (
            <Badge>Customer: {filters.customerId}</Badge>
          ) : null}
          {filters.q ? <Badge>Search: {filters.q}</Badge> : null}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              dispatch(resetJobsFilters());
              onSearchChange("");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : null}

      {selectedIds.length > 0 ? (
        <div className="border-border bg-surface flex flex-col gap-2 rounded-md border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-foreground text-sm">
            {selectedIds.length} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              aria-label="Bulk status update"
              placeholder="Set status…"
              options={statusOptions}
              disabled={mutationBusy}
              onChange={(event) => {
                const status = event.target.value as JobStatus;
                if (!status) {
                  return;
                }
                void dispatch(
                  bulkUpdateJobStatus({ ids: selectedIds, status }),
                );
                event.target.value = "";
              }}
              className="min-w-44"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dispatch(clearJobSelection())}
            >
              Clear selection
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
