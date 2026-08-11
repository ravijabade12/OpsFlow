import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function MetricCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border bg-surface shadow-soft rounded-md border px-4 py-3",
        className,
      )}
    >
      <p className="text-muted text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p className="text-foreground mt-2 text-2xl font-semibold tracking-tight">
        {value}
      </p>
      {hint ? <p className="text-muted mt-1 text-xs">{hint}</p> : null}
    </div>
  );
}
