import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-border bg-surface shadow-soft rounded-md border",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  title,
  description,
  action,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-border flex items-start justify-between gap-3 border-b px-4 py-3",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        {title ? (
          <h2 className="text-foreground text-sm font-semibold">{title}</h2>
        ) : null}
        {description ? (
          <p className="text-muted mt-0.5 text-xs">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 py-4", className)} {...props} />;
}
