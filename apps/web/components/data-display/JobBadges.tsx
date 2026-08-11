import type { JobPriority, JobStatus } from "@opsflow/shared";

import { Badge, type BadgeTone } from "@/components/ui/Badge";

const statusTone: Record<JobStatus, BadgeTone> = {
  pending: "neutral",
  assigned: "info",
  in_progress: "accent",
  completed: "success",
  cancelled: "danger",
};

const statusLabel: Record<JobStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
}

const priorityTone: Record<JobPriority, BadgeTone> = {
  low: "neutral",
  medium: "info",
  high: "warning",
  critical: "danger",
};

const priorityLabel: Record<JobPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function PriorityBadge({ priority }: { priority: JobPriority }) {
  return <Badge tone={priorityTone[priority]}>{priorityLabel[priority]}</Badge>;
}
