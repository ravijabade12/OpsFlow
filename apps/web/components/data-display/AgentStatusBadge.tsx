import type { AgentStatus } from "@opsflow/shared";

import { Badge, type BadgeTone } from "@/components/ui/Badge";

const tone: Record<AgentStatus, BadgeTone> = {
  available: "success",
  busy: "warning",
  offline: "neutral",
};

const label: Record<AgentStatus, string> = {
  available: "Available",
  busy: "Busy",
  offline: "Offline",
};

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  return <Badge tone={tone[status]}>{label[status]}</Badge>;
}
