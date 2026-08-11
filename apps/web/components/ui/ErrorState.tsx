"use client";

import type { ReactNode } from "react";
import { WarningCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  action,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "border-danger/30 bg-danger-soft/40 flex flex-col items-center justify-center gap-3 rounded-md border px-6 py-10 text-center",
        className,
      )}
    >
      <div className="text-danger">
        <WarningCircle size={28} weight="duotone" />
      </div>
      <div>
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="text-muted mt-1 max-w-sm text-sm">{description}</p>
        ) : null}
      </div>
      {action ??
        (onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null)}
    </div>
  );
}
