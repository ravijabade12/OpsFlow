import type { AgentStatus, JobPriority, JobStatus } from "../types";

export const JOB_STATUSES: readonly JobStatus[] = [
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export const JOB_PRIORITIES: readonly JobPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const AGENT_STATUSES: readonly AgentStatus[] = [
  "available",
  "busy",
  "offline",
] as const;

export const DEFAULT_PAGE_SIZE = 20;

export const SEARCH_DEBOUNCE_MS = 350;

/** Default local JSON Server URL for development. */
export const DEFAULT_API_BASE_URL = "http://localhost:3001";
