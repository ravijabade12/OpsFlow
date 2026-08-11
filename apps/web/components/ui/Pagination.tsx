"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-muted text-xs">
        Showing <span className="text-foreground font-medium">{from}</span>–
        <span className="text-foreground font-medium">{to}</span> of{" "}
        <span className="text-foreground font-medium">{totalCount}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <CaretLeft size={14} weight="bold" />
          Prev
        </Button>
        <span className="text-muted text-xs">
          Page {page} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <CaretRight size={14} weight="bold" />
        </Button>
      </div>
    </div>
  );
}
