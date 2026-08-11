import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  JobStatusBadge,
  PriorityBadge,
} from "@/components/data-display/JobBadges";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

describe("Button", () => {
  it("renders children and forwards clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects the disabled state", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled save
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Disabled save" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("EmptyState", () => {
  it("renders title, description, and optional action", () => {
    render(
      <EmptyState
        title="No jobs found"
        description="Try clearing filters."
        action={<button type="button">Create job</button>}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "No jobs found" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Try clearing filters.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create job" }),
    ).toBeInTheDocument();
  });
});

describe("Job badges", () => {
  it("renders human-readable status and priority labels", () => {
    const { rerender } = render(<JobStatusBadge status="in_progress" />);
    expect(screen.getByText("In progress")).toBeInTheDocument();

    rerender(<PriorityBadge priority="critical" />);
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });
});
