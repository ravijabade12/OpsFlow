"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface DropdownItem {
  id: string;
  label: string;
  onSelect: () => void;
  danger?: boolean;
}

export function Dropdown({
  label,
  items,
  className,
}: {
  label: ReactNode;
  items: DropdownItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <Button
        variant="secondary"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <CaretDown size={14} weight="bold" />
      </Button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="border-border bg-surface shadow-soft absolute top-full right-0 z-20 mt-1 min-w-44 rounded-md border p-1"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={cn(
                "flex w-full rounded-md px-3 py-2 text-left text-sm",
                item.danger
                  ? "text-danger hover:bg-danger-soft"
                  : "text-foreground hover:bg-surface-muted",
              )}
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
