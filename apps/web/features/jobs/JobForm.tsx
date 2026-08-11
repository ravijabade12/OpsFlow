"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Agent, Customer, Job } from "@opsflow/shared";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  jobFormSchema,
  type JobFormValues,
} from "@/features/jobs/jobFormSchema";
import { fromDateInputValue, toDateInputValue } from "@/utils/date";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

function defaultsFromJob(job?: Job | null): JobFormValues {
  if (!job) {
    return {
      title: "",
      description: "",
      customerId: "",
      agentId: "",
      status: "pending",
      priority: "medium",
      location: "",
      dueDate: toDateInputValue(new Date().toISOString()),
    };
  }

  return {
    title: job.title,
    description: job.description,
    customerId: job.customerId,
    agentId: job.agentId ?? "",
    status: job.status,
    priority: job.priority,
    location: job.location,
    dueDate: toDateInputValue(job.dueDate),
  };
}

export function JobForm({
  job,
  customers,
  agents,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  job?: Job | null;
  customers: Customer[];
  agents: Agent[];
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (
    values: JobFormValues & { dueDateIso: string },
  ) => Promise<void> | void;
  onCancel: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: defaultsFromJob(job),
  });

  useEffect(() => {
    reset(defaultsFromJob(job));
  }, [job, reset]);

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          dueDateIso: fromDateInputValue(values.dueDate),
        });
      })}
      noValidate
    >
      <Input
        label="Title"
        error={errors.title?.message}
        {...register("title")}
      />
      <label className="flex w-full flex-col gap-1.5 text-sm">
        <span className="text-foreground font-medium">Description</span>
        <textarea
          className="border-border bg-surface text-foreground min-h-24 w-full rounded-md border px-3 py-2 text-sm"
          aria-invalid={Boolean(errors.description) || undefined}
          {...register("description")}
        />
        {errors.description ? (
          <span className="text-danger text-xs">
            {errors.description.message}
          </span>
        ) : null}
      </label>

      <Controller
        control={control}
        name="customerId"
        render={({ field }) => (
          <Select
            label="Customer"
            placeholder="Select customer"
            error={errors.customerId?.message}
            options={customers.map((customer) => ({
              value: customer.id,
              label: `${customer.name}${customer.company ? ` · ${customer.company}` : ""}`,
            }))}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        )}
      />

      <Controller
        control={control}
        name="agentId"
        render={({ field }) => (
          <Select
            label="Agent (optional)"
            placeholder="Unassigned"
            options={agents.map((agent) => ({
              value: agent.id,
              label: `${agent.name} (${agent.status})`,
            }))}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        )}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              label="Status"
              options={statusOptions}
              error={errors.status?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <Select
              label="Priority"
              options={priorityOptions}
              error={errors.priority?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
      </div>

      <Input
        label="Location"
        error={errors.location?.message}
        {...register("location")}
      />
      <Input
        label="Due date"
        type="date"
        error={errors.dueDate?.message}
        {...register("dueDate")}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
