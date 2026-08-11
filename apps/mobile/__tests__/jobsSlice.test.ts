import type { Job } from "@opsflow/shared";

import {
  fetchJobs,
  jobsReducer,
  selectJobsHasMore,
  selectJobsIsEmpty,
  setAgentId,
  updateJobStatus,
} from "../src/store/slices/jobsSlice";

const sampleJob: Job = {
  id: "job-m1",
  title: "Field visit",
  description: "On-site inspection for agent-001",
  status: "assigned",
  priority: "high",
  customerId: "cust-1",
  agentId: "agent-001",
  location: "Bengaluru",
  createdAt: "2026-01-01T00:00:00.000Z",
  dueDate: "2026-01-08T00:00:00.000Z",
};

describe("mobile jobsSlice", () => {
  const initial = jobsReducer(undefined, { type: "@@init" });

  it("defaults to demo agent-001", () => {
    expect(initial.agentId).toBe("agent-001");
    expect(initial.pageSize).toBe(30);
  });

  it("updates agent id", () => {
    const state = jobsReducer(initial, setAgentId("agent-042"));
    expect(state.agentId).toBe("agent-042");
  });

  it("replaces jobs on refresh and appends on load-more", () => {
    const refreshed = jobsReducer(
      initial,
      fetchJobs.fulfilled(
        {
          jobs: [sampleJob],
          totalCount: 2,
          page: 1,
          pageSize: 1,
          append: false,
        },
        "req-1",
        { refresh: true },
      ),
    );
    expect(refreshed.data).toHaveLength(1);
    expect(refreshed.hasMore).toBe(true);

    const appended = jobsReducer(
      refreshed,
      fetchJobs.fulfilled(
        {
          jobs: [{ ...sampleJob, id: "job-m2", title: "Second visit" }],
          totalCount: 2,
          page: 2,
          pageSize: 1,
          append: true,
        },
        "req-2",
        { append: true },
      ),
    );
    expect(appended.data).toHaveLength(2);
    expect(appended.hasMore).toBe(false);
    expect(selectJobsHasMore({ jobs: appended })).toBe(false);
  });

  it("updates selected job status from mutation", () => {
    const withSelection = {
      ...initial,
      selectedJob: sampleJob,
      data: [sampleJob],
    };
    const updated = {
      ...sampleJob,
      status: "completed" as const,
      completedAt: "2026-01-07T00:00:00.000Z",
    };
    const state = jobsReducer(
      withSelection,
      updateJobStatus.fulfilled(updated, "req-3", {
        id: sampleJob.id,
        status: "completed",
      }),
    );
    expect(state.selectedJob?.status).toBe("completed");
    expect(state.data[0]?.status).toBe("completed");
  });

  it("selectJobsIsEmpty requires a successful empty payload", () => {
    expect(selectJobsIsEmpty({ jobs: initial })).toBe(false);
    const empty = jobsReducer(
      initial,
      fetchJobs.fulfilled(
        {
          jobs: [],
          totalCount: 0,
          page: 1,
          pageSize: 30,
          append: false,
        },
        "req-4",
        { refresh: true },
      ),
    );
    expect(selectJobsIsEmpty({ jobs: empty })).toBe(true);
  });
});
