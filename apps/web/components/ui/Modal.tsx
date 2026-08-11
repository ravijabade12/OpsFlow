"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  className?: string;
}

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
  footer,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "border-border bg-surface text-foreground shadow-soft m-auto w-[min(100%-2rem,32rem)] rounded-md border p-0",
        "backdrop:bg-slate-950/45",
        className,
      )}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="border-border flex items-start justify-between gap-3 border-b px-4 py-3">
        <div>
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-muted mt-1 text-sm">
              {description}
            </p>
          ) : null}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close dialog"
        >
          Close
        </Button>
      </div>
      <div className="px-4 py-4">{children}</div>
      {footer ? (
        <div className="border-border flex justify-end gap-2 border-t px-4 py-3">
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}
