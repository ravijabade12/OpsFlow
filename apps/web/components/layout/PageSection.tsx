import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function PageSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {title || description ? (
        <div>
          {title ? (
            <h2 className="text-foreground text-sm font-semibold">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-muted mt-1 text-sm">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
