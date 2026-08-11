export type JobStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type JobPriority = "low" | "medium" | "high" | "critical";

export interface Job {
  id: string;
  title: string;
  description: string;
  customerId: string;
  /** Assigned agent id, or empty string / null when unassigned. */
  agentId: string | null;
  status: JobStatus;
  priority: JobPriority;
  location: string;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
}
