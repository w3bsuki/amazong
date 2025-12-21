"use client";

import { CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldContent } from "@/components/common/field";

interface FieldRowProps {
  label: string;
  value: string;
  placeholder: string;
  isRequired?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
  locale?: string;
  /** Optional error state */
  hasError?: boolean;
  /** Optional error message */
  errorMessage?: string;
}

/**
 * FieldRow - Touchable row component that opens a drawer/modal on tap
 * 
 * Phase 3: Updated to use shadcn Field pattern internally while
 * maintaining backward compatibility with the existing API.
 * 
 * Displays a label, current value (or placeholder), and optional icon.
 * Used throughout the mobile sell form for consistent field presentation.
 */
export function FieldRow({ 
  label, 
  value, 
  placeholder, 
  isRequired, 
  icon, 
  onClick,
  hasError = false,
  errorMessage,
}: FieldRowProps) {
  return (
    <Field data-invalid={hasError} orientation="vertical" className="w-full">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left min-h-11 touch-manipulation",
          "bg-background hover:bg-accent active:bg-accent/80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          hasError 
            ? "border-destructive" 
            : "border-dashed border-input"
        )}
        aria-invalid={hasError}
        aria-describedby={hasError && errorMessage ? `${label}-error` : undefined}
      >
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <FieldContent className="flex-1 min-w-0 space-y-0">
          <FieldLabel className="flex items-center gap-1 text-xs text-muted-foreground font-normal">
            {label}
            {isRequired && <span className="text-destructive">*</span>}
          </FieldLabel>
          <span className={cn(
            "text-sm truncate block",
            value ? "font-medium text-foreground" : "text-muted-foreground"
          )}>
            {value || placeholder}
          </span>
        </FieldContent>
        <CaretRight className="size-4 text-muted-foreground shrink-0" />
      </button>
      {hasError && errorMessage && (
        <p 
          id={`${label}-error`} 
          className="text-xs text-destructive mt-1.5 px-1"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </Field>
  );
}
