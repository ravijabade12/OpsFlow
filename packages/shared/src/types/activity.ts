export interface Activity {
  id: string;
  jobId: string;
  type: string;
  description: string;
  createdAt: string;
  actorId?: string;
}
