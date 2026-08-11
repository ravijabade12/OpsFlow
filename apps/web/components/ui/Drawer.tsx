"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface DrawerProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  side?: "left" | "right";
  footer?: ReactNode;
}

export function Drawer({
  open,
  title,
  description,
  children,
  onClose,
  side = "right",
  footer,
}: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <button
        type="button"
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-slate-950/45"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "bg-surface shadow-soft relative z-10 flex h-full w-full max-w-md flex-col",
          side === "right" ? "ml-auto" : "mr-auto",
        )}
      >
        <div className="border-border flex items-start justify-between gap-3 border-b px-4 py-3">
          <div>
            <h2 className="text-foreground text-base font-semibold">{title}</h2>
            {description ? (
              <p className="text-muted mt-1 text-sm">{description}</p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} weight="bold" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer ? (
          <div className="border-border border-t px-4 py-3">{footer}</div>
        ) : null}
      </aside>
    </div>
  );
}
