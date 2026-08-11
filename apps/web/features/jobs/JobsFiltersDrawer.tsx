"use client";

import type { Agent, Customer } from "@opsflow/shared";
import { JOB_PRIORITIES, JOB_STATUSES } from "@opsflow/shared";

import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Select } from "@/components/ui/Select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  resetJobsFilters,
  selectJobsFilters,
  setJobsFilters,
} from "@/store/slices/jobs";

export function JobsFiltersDrawer({
  open,
  onClose,
  agents,
  customers,
  onResetSearch,
}: {
  open: boolean;
  onClose: () => void;
  agents: Agent[];
  customers: Customer[];
  onResetSearch?: () => void;
}) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectJobsFilters);

  return (
    <Drawer
      open={open}
      title="Filter jobs"
      description="Combine status, priority, agent, and customer filters."
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(resetJobsFilters());
              onResetSearch?.();
            }}
          >
            Reset
          </Button>
          <Button onClick={onClose}>Done</Button>
        </div>
      }
    >
      <div className="space-y-3">
        <Select
          label="Status"
          placeholder="All statuses"
          value={filters.status}
          options={JOB_STATUSES.map((status) => ({
            value: status,
            label: status.replaceAll("_", " "),
          }))}
          onChange={(event) =>
            dispatch(
              setJobsFilters({
                status: event.target.value as typeof filters.status,
              }),
            )
          }
        />
        <Select
          label="Priority"
          placeholder="All priorities"
          value={filters.priority}
          options={JOB_PRIORITIES.map((priority) => ({
            value: priority,
            label: priority,
          }))}
          onChange={(event) =>
            dispatch(
              setJobsFilters({
                priority: event.target.value as typeof filters.priority,
              }),
            )
          }
        />
        <Select
          label="Agent"
          placeholder="All agents"
          value={filters.agentId}
          options={agents.map((agent) => ({
            value: agent.id,
            label: agent.name,
          }))}
          onChange={(event) =>
            dispatch(setJobsFilters({ agentId: event.target.value }))
          }
        />
        <Select
          label="Customer"
          placeholder="All customers"
          value={filters.customerId}
          options={customers.slice(0, 200).map((customer) => ({
            value: customer.id,
            label: customer.name,
          }))}
          onChange={(event) =>
            dispatch(setJobsFilters({ customerId: event.target.value }))
          }
        />
      </div>
    </Drawer>
  );
}
