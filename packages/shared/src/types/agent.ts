export type AgentStatus = "available" | "busy" | "offline";

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: AgentStatus;
  phone: string;
}
