import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, hint, error, id, options, placeholder, ...props },
    ref,
  ) => {
    const selectId = id ?? props.name;

    return (
      <label className="flex w-full flex-col gap-1.5 text-sm">
        {label ? (
          <span className="text-foreground font-medium">{label}</span>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "bg-surface text-foreground h-10 w-full rounded-md border px-3 text-sm",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error ? "border-danger" : "border-border",
            className,
          )}
          aria-invalid={Boolean(error) || undefined}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="text-danger text-xs">{error}</span>
        ) : hint ? (
          <span className="text-muted text-xs">{hint}</span>
        ) : null}
      </label>
    );
  },
);

Select.displayName = "Select";
