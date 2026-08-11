import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className="flex w-full flex-col gap-1.5 text-sm">
        {label ? (
          <span className="text-foreground font-medium">{label}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "bg-surface text-foreground h-10 w-full rounded-md border px-3 text-sm",
            "placeholder:text-muted",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error ? "border-danger" : "border-border",
            className,
          )}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error ? (
          <span id={`${inputId}-error`} className="text-danger text-xs">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="text-muted text-xs">
            {hint}
          </span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
