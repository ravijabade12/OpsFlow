import { describe, expect, it } from "vitest";

import { jobFormSchema } from "@/features/jobs/jobFormSchema";

const valid = {
  title: "Replace filter",
  description: "Customer reports weak airflow in living room.",
  customerId: "cust-001",
  agentId: "agent-001",
  status: "pending" as const,
  priority: "medium" as const,
  location: "Mumbai",
  dueDate: "2026-05-01",
};

describe("jobFormSchema", () => {
  it("accepts a valid payload", () => {
    expect(jobFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects short titles and missing customer", () => {
    const result = jobFormSchema.safeParse({
      ...valid,
      title: "ab",
      customerId: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toEqual(expect.arrayContaining(["title", "customerId"]));
    }
  });

  it("rejects invalid due dates", () => {
    const result = jobFormSchema.safeParse({
      ...valid,
      dueDate: "01-05-2026",
    });
    expect(result.success).toBe(false);
  });
});
