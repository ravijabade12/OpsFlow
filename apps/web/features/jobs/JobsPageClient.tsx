"use client";

import { useCallback, useEffect, useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "@opsflow/shared";
import type { Job } from "@opsflow/shared";

import { AppShell } from "@/components/layout/AppShell";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { JobDetailsDrawer } from "@/features/jobs/JobDetailsDrawer";
import { JobForm } from "@/features/jobs/JobForm";
import { JobsFiltersDrawer } from "@/features/jobs/JobsFiltersDrawer";
import { JobsTable } from "@/features/jobs/JobsTable";
import { JobsToolbar } from "@/features/jobs/JobsToolbar";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAgents,
  selectAgents,
  selectAgentsById,
} from "@/store/slices/agents";
import {
  fetchCustomers,
  selectCustomers,
  selectCustomersById,
} from "@/store/slices/customers";
import {
  clearSelectedJob,
  createJob,
  fetchJobById,
  fetchJobs,
  selectHasActiveJobFilters,
  selectJobs,
  selectJobsError,
  selectJobsFilters,
  selectJobsIsEmpty,
  selectJobsPagination,
  selectJobsState,
  selectJobsStatus,
  setJobsFilters,
  setJobsPage,
  updateJob,
} from "@/store/slices/jobs";

type FormMode = { type: "create" } | { type: "edit"; job: Job } | null;

export function JobsPageClient() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const status = useAppSelector(selectJobsStatus);
  const error = useAppSelector(selectJobsError);
  const isEmpty = useAppSelector(selectJobsIsEmpty);
  const pagination = useAppSelector(selectJobsPagination);
  const filters = useAppSelector(selectJobsFilters);
  const hasFilters = useAppSelector(selectHasActiveJobFilters);
  const { mutationStatus, mutationError } = useAppSelector(selectJobsState);
  const agents = useAppSelector(selectAgents);
  const customers = useAppSelector(selectCustomers);
  const agentsById = useAppSelector(selectAgentsById);
  const customersById = useAppSelector(selectCustomersById);

  const [search, setSearch] = useState(filters.q);
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailsJobId, setDetailsJobId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>(null);

  useEffect(() => {
    if (agents.length === 0) {
      void dispatch(fetchAgents({ page: 1, pageSize: 500 }));
    }
    if (customers.length === 0) {
      void dispatch(fetchCustomers({ page: 1, pageSize: 500 }));
    }
  }, [dispatch, agents.length, customers.length]);

  useEffect(() => {
    if (debouncedSearch !== filters.q) {
      dispatch(setJobsFilters({ q: debouncedSearch }));
    }
  }, [debouncedSearch, dispatch, filters.q]);

  useEffect(() => {
    void dispatch(fetchJobs());
  }, [
    dispatch,
    filters.status,
    filters.priority,
    filters.agentId,
    filters.customerId,
    filters.q,
    filters.sort,
    filters.order,
    pagination.page,
    pagination.pageSize,
  ]);

  const openJob = useCallback(
    (jobId: string) => {
      setDetailsJobId(jobId);
      void dispatch(fetchJobById(jobId));
    },
    [dispatch],
  );

  const closeDetails = useCallback(() => {
    setDetailsJobId(null);
    dispatch(clearSelectedJob());
  }, [dispatch]);

  return (
    <AppShell
      title="Jobs"
      description="Search, filter, sort, and manage service jobs across the operations team."
    >
      <div className="space-y-4">
        <JobsToolbar
          search={search}
          onSearchChange={setSearch}
          onOpenFilters={() => setFiltersOpen(true)}
          onCreate={() => setFormMode({ type: "create" })}
          mutationBusy={mutationStatus === "loading"}
        />

        {mutationError ? (
          <p className="border-danger/30 bg-danger-soft/50 text-danger rounded-md border px-3 py-2 text-sm">
            {mutationError}
          </p>
        ) : null}

        <Card>
          <CardBody className="p-0">
            {status === "loading" || status === "idle" ? (
              <div className="p-4">
                <SkeletonRows rows={8} />
              </div>
            ) : null}

            {status === "failed" ? (
              <div className="p-4">
                <ErrorState
                  title="Unable to load jobs"
                  description={
                    error ?? "Check that the API is running on port 3001."
                  }
                  onRetry={() => {
                    void dispatch(fetchJobs());
                  }}
                />
              </div>
            ) : null}

            {status === "succeeded" && isEmpty ? (
              <div className="p-4">
                <EmptyState
                  title="No jobs found"
                  description={
                    hasFilters
                      ? "Adjust your filters or clear search to see more results."
                      : "Create the first job to get started."
                  }
                  action={
                    hasFilters ? undefined : (
                      <button
                        type="button"
                        className="text-accent hover:text-accent-hover text-sm font-medium"
                        onClick={() => setFormMode({ type: "create" })}
                      >
                        Create job
                      </button>
                    )
                  }
                />
              </div>
            ) : null}

            {status === "succeeded" && !isEmpty ? (
              <JobsTable
                jobs={jobs}
                agentsById={agentsById}
                customersById={customersById}
                onOpenJob={openJob}
              />
            ) : null}
          </CardBody>
        </Card>

        {status === "succeeded" && !isEmpty ? (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            onPageChange={(page) => {
              dispatch(setJobsPage(page));
            }}
          />
        ) : null}
      </div>

      <JobsFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        agents={agents}
        customers={customers}
        onResetSearch={() => setSearch("")}
      />

      <JobDetailsDrawer
        open={Boolean(detailsJobId)}
        jobId={detailsJobId}
        agentsById={agentsById}
        customersById={customersById}
        onClose={closeDetails}
        onEdit={(job) => {
          setFormMode({ type: "edit", job });
        }}
      />

      <Modal
        open={Boolean(formMode)}
        title={formMode?.type === "edit" ? "Edit job" : "Create job"}
        description="Validated with React Hook Form and Zod."
        onClose={() => setFormMode(null)}
      >
        <JobForm
          job={formMode?.type === "edit" ? formMode.job : null}
          customers={customers}
          agents={agents}
          submitting={mutationStatus === "loading"}
          submitLabel={
            formMode?.type === "edit" ? "Save changes" : "Create job"
          }
          onCancel={() => setFormMode(null)}
          onSubmit={async (values) => {
            if (formMode?.type === "edit") {
              const result = await dispatch(
                updateJob({
                  id: formMode.job.id,
                  patch: {
                    title: values.title,
                    description: values.description,
                    customerId: values.customerId,
                    agentId: values.agentId || "",
                    status: values.status,
                    priority: values.priority,
                    location: values.location,
                    dueDate: values.dueDateIso,
                    completedAt:
                      values.status === "completed"
                        ? new Date().toISOString()
                        : undefined,
                  },
                }),
              );
              if (updateJob.fulfilled.match(result)) {
                setFormMode(null);
                if (detailsJobId === formMode.job.id) {
                  void dispatch(fetchJobById(formMode.job.id));
                }
              }
              return;
            }

            const result = await dispatch(
              createJob({
                id: `job-${Date.now()}`,
                title: values.title,
                description: values.description,
                customerId: values.customerId,
                agentId: values.agentId || "",
                status: values.status,
                priority: values.priority,
                location: values.location,
                createdAt: new Date().toISOString(),
                dueDate: values.dueDateIso,
                completedAt:
                  values.status === "completed"
                    ? new Date().toISOString()
                    : undefined,
              }),
            );

            if (createJob.fulfilled.match(result)) {
              setFormMode(null);
              void dispatch(fetchJobs());
            }
          }}
        />
      </Modal>
    </AppShell>
  );
}
