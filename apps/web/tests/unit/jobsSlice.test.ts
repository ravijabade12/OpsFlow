import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import type { Job } from "@opsflow/shared";

import { rootReducer, type RootState } from "@/store/rootReducer";
import {
  clearJobSelection,
  fetchJobs,
  jobsReducer,
  resetJobsFilters,
  setJobsFilters,
  setJobsPage,
  setJobsPageSize,
  toggleJobSelection,
} from "@/store/slices/jobs";
import {
  selectHasActiveJobFilters,
  selectJobsIsEmpty,
  selectJobsPagination,
} from "@/store/slices/jobs/jobsSelectors";
import { jobsInitialState } from "@/store/slices/jobs/jobsTypes";

const sampleJob: Job = {
  id: "job-100",
  title: "Inspect panel",
  description: "Quarterly electrical inspection",
  status: "assigned",
  priority: "medium",
  customerId: "cust-1",
  agentId: "agent-1",
  location: "Delhi",
  createdAt: "2026-01-01T00:00:00.000Z",
  dueDate: "2026-01-10T00:00:00.000Z",
};

function rootState(partial: Partial<RootState["jobs"]> = {}): RootState {
  const base = configureStore({ reducer: rootReducer }).getState();
  return {
    ...base,
    jobs: { ...jobsInitialState, ...partial },
  };
}

describe("jobsSlice reducers", () => {
  it("resets page when page size changes", () => {
    const state = jobsReducer(
      { ...jobsInitialState, page: 4 },
      setJobsPageSize(50),
    );
    expect(state.pageSize).toBe(50);
    expect(state.page).toBe(1);
  });

  it("merges filters and resets to page 1", () => {
    const state = jobsReducer(
      { ...jobsInitialState, page: 3 },
      setJobsFilters({ status: "pending", q: "hvac" }),
    );
    expect(state.filters.status).toBe("pending");
    expect(state.filters.q).toBe("hvac");
    expect(state.page).toBe(1);
  });

  it("resets filters to defaults", () => {
    const dirty = jobsReducer(
      jobsInitialState,
      setJobsFilters({ priority: "high", agentId: "agent-9" }),
    );
    const state = jobsReducer(dirty, resetJobsFilters());
    expect(state.filters.priority).toBe("");
    expect(state.filters.agentId).toBe("");
  });

  it("toggles and clears row selection", () => {
    let state = jobsReducer(jobsInitialState, toggleJobSelection("a"));
    state = jobsReducer(state, toggleJobSelection("b"));
    expect(state.selectedIds).toEqual(["a", "b"]);
    state = jobsReducer(state, toggleJobSelection("a"));
    expect(state.selectedIds).toEqual(["b"]);
    state = jobsReducer(state, clearJobSelection());
    expect(state.selectedIds).toEqual([]);
  });

  it("handles fetchJobs pending/fulfilled/rejected", () => {
    let state = jobsReducer(jobsInitialState, { type: fetchJobs.pending.type });
    expect(state.status).toBe("loading");

    state = jobsReducer(
      state,
      fetchJobs.fulfilled(
        { jobs: [sampleJob], totalCount: 1, page: 1, pageSize: 20 },
        "req-1",
        undefined,
      ),
    );
    expect(state.status).toBe("succeeded");
    expect(state.data).toHaveLength(1);
    expect(state.totalCount).toBe(1);

    state = jobsReducer(
      state,
      fetchJobs.rejected(new Error("boom"), "req-2", undefined, "Network down"),
    );
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Network down");
  });

  it("clamps page to at least 1", () => {
    const state = jobsReducer(jobsInitialState, setJobsPage(0));
    expect(state.page).toBe(1);
  });
});

describe("jobs selectors", () => {
  it("selectJobsPagination computes total pages", () => {
    expect(
      selectJobsPagination(
        rootState({ totalCount: 45, pageSize: 20, page: 2 }),
      ),
    ).toEqual({
      page: 2,
      pageSize: 20,
      totalCount: 45,
      totalPages: 3,
    });
  });

  it("selectJobsIsEmpty is true only after a successful empty load", () => {
    expect(selectJobsIsEmpty(rootState({ status: "loading", data: [] }))).toBe(
      false,
    );
    expect(
      selectJobsIsEmpty(rootState({ status: "succeeded", data: [] })),
    ).toBe(true);
    expect(
      selectJobsIsEmpty(rootState({ status: "succeeded", data: [sampleJob] })),
    ).toBe(false);
  });

  it("selectHasActiveJobFilters detects any non-empty filter", () => {
    expect(selectHasActiveJobFilters(rootState())).toBe(false);
    expect(
      selectHasActiveJobFilters(
        rootState({
          filters: { ...jobsInitialState.filters, q: "pump" },
        }),
      ),
    ).toBe(true);
  });
});
