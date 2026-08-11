import type { Activity } from "@opsflow/shared";

import { apiRequest, apiRequestWithMeta, toQueryString } from "./apiClient";

export async function fetchActivities(
  query: {
    page?: number;
    pageSize?: number;
    jobId?: string;
    sort?: string;
    order?: "asc" | "desc";
  } = {},
): Promise<{ activities: Activity[]; totalCount: number }> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;

  const result = await apiRequestWithMeta<Activity[]>(
    `/activities${toQueryString({
      _page: page,
      _limit: pageSize,
      jobId: query.jobId || undefined,
      _sort: query.sort ?? "createdAt",
      _order: query.order ?? "desc",
    })}`,
  );

  return {
    activities: result.data,
    totalCount: result.meta.totalCount ?? result.data.length,
  };
}

export async function fetchActivityById(id: string): Promise<Activity> {
  return apiRequest<Activity>(`/activities/${id}`);
}
