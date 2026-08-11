"use client";

import { useEffect, useState } from "react";
import type { Job } from "@opsflow/shared";

import {
  JobStatusBadge,
  PriorityBadge,
} from "@/components/data-display/JobBadges";
import { MetricCard } from "@/components/data-display/MetricCard";
import { Drawer } from "@/components/ui/Drawer";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton, SkeletonRows } from "@/components/ui/Skeleton";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import {
  fetchEntityJobStats,
  fetchRelatedJobs,
  type EntityJobStats,
} from "@/services/entityJobsService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedCustomer,
  fetchCustomerById,
  selectCustomersState,
} from "@/store/slices/customers";
import { formatDate } from "@/utils/date";

export function CustomerDetailsDrawer({
  open,
  customerId,
  onClose,
}: {
  open: boolean;
  customerId: string | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { selectedCustomer, detailStatus, detailError } =
    useAppSelector(selectCustomersState);

  const [stats, setStats] = useState<EntityJobStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [relatedStatus, setRelatedStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [relatedError, setRelatedError] = useState<string | null>(null);

  const customer =
    selectedCustomer && customerId && selectedCustomer.id === customerId
      ? selectedCustomer
      : null;

  useEffect(() => {
    if (!open || !customerId) {
      return;
    }

    let cancelled = false;

    const loadRelated = async () => {
      setRelatedStatus("loading");
      setRelatedError(null);
      try {
        const [jobStats, related] = await Promise.all([
          fetchEntityJobStats({ customerId }),
          fetchRelatedJobs({ customerId, page: 1, pageSize: 12 }),
        ]);
        if (cancelled) {
          return;
        }
        setStats(jobStats);
        setJobs(related.jobs);
        setRelatedStatus("succeeded");
      } catch (error) {
        if (cancelled) {
          return;
        }
        setRelatedStatus("failed");
        setRelatedError(
          error instanceof Error
            ? error.message
            : "Unable to load customer jobs",
        );
      }
    };

    void loadRelated();

    return () => {
      cancelled = true;
    };
  }, [open, customerId]);

  return (
    <Drawer
      open={open}
      title={customer?.name ?? "Customer details"}
      description={
        customer?.company
          ? `${customer.company} · ${customer.email}`
          : (customer?.email ?? "Inspect customer profile and related jobs")
      }
      onClose={() => {
        dispatch(clearSelectedCustomer());
        onClose();
      }}
    >
      {detailStatus === "loading" ? <SkeletonRows rows={4} /> : null}

      {detailStatus === "failed" ? (
        <ErrorState
          title="Unable to load customer"
          description={detailError ?? undefined}
          onRetry={() => {
            if (customerId) {
              void dispatch(fetchCustomerById(customerId));
            }
          }}
        />
      ) : null}

      {customer && detailStatus === "succeeded" ? (
        <div className="space-y-5">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted text-xs">Phone</dt>
              <dd className="mt-1 font-medium">{customer.phone}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Location</dt>
              <dd className="mt-1 font-medium">{customer.location}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Company</dt>
              <dd className="mt-1 font-medium">{customer.company ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Customer ID</dt>
              <dd className="mt-1 font-medium">{customer.id}</dd>
            </div>
          </dl>

          {relatedStatus === "loading" || !stats ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : relatedStatus === "failed" ? (
            <ErrorState
              title="Unable to load job stats"
              description={relatedError ?? undefined}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Total jobs" value={stats.total} />
              <MetricCard label="Active jobs" value={stats.active} />
              <MetricCard label="Completed jobs" value={stats.completed} />
              <MetricCard
                label="SLA %"
                value={
                  stats.slaCompliance === null ? "—" : `${stats.slaCompliance}%`
                }
              />
            </div>
          )}

          <div>
            <h3 className="text-foreground mb-2 text-sm font-semibold">
              Related jobs
            </h3>
            {relatedStatus === "loading" ? <SkeletonRows rows={5} /> : null}
            {relatedStatus === "succeeded" && jobs.length === 0 ? (
              <p className="text-muted text-sm">No jobs for this customer.</p>
            ) : null}
            {relatedStatus === "succeeded" && jobs.length > 0 ? (
              <div className="border-border overflow-hidden rounded-md border">
                <Table>
                  <THead>
                    <TR>
                      <TH>Job</TH>
                      <TH>Status</TH>
                      <TH>Priority</TH>
                      <TH>Due</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {jobs.map((job) => (
                      <TR key={job.id}>
                        <TD>
                          <p className="max-w-[12rem] truncate font-medium">
                            {job.title}
                          </p>
                          <p className="text-muted text-xs">{job.id}</p>
                        </TD>
                        <TD>
                          <JobStatusBadge status={job.status} />
                        </TD>
                        <TD>
                          <PriorityBadge priority={job.priority} />
                        </TD>
                        <TD className="whitespace-nowrap">
                          {formatDate(job.dueDate)}
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
