"use client";

import type { ReactNode } from "react";
import { Tray } from "@phosphor-icons/react";

import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-surface flex flex-col items-center justify-center gap-3 rounded-md border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      <div className="bg-surface-muted text-muted rounded-md p-3">
        <Tray size={28} weight="duotone" />
      </div>
      <div>
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="text-muted mt-1 max-w-sm text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
