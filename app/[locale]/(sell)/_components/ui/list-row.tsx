"use client";

import { type ReactNode, forwardRef } from "react";
import { CaretRight, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ============================================================================
// LIST ROW - iOS-style tappable row with label/value/chevron
// 56px minimum height, proper touch targets, chevron for navigation
// ============================================================================

interface ListRowProps {
  /** Primary label (left side) */
  label: string;
  /** Value or content (right side, before accessory) */
  value?: ReactNode;
  /** Helper text below the label */
  description?: string;
  /** Icon on the left side */
  icon?: ReactNode;
  /** Accessory type: chevron, checkmark, or custom */
  accessory?: "chevron" | "check" | "none" | ReactNode;
  /** Whether this row is selected */
  isSelected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether this row is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Whether the value should be muted (placeholder-like) */
  valueMuted?: boolean;
}

export const ListRow = forwardRef<HTMLButtonElement, ListRowProps>(
  function ListRow(
    {
      label,
      value,
      description,
      icon,
      accessory = "chevron",
      isSelected = false,
      onClick,
      disabled = false,
      className,
      valueMuted = false,
    },
    ref
  ) {
    const renderAccessory = () => {
      if (accessory === "none") return null;
      
      if (accessory === "check") {
        if (!isSelected) return <div className="size-5" />;
        return (
          <div className="size-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="size-3 text-primary-foreground" weight="bold" />
          </div>
        );
      }
      
      if (accessory === "chevron") {
        return (
          <CaretRight
            className={cn(
              "size-4 shrink-0",
              isSelected ? "text-primary" : "text-muted-foreground/40"
            )}
            weight="bold"
          />
        );
      }
      
      return accessory;
    };

    const content = (
      <>
        {/* Icon */}
        {icon && (
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg shrink-0",
              isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            {icon}
          </div>
        )}

        {/* Label + Description */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[15px] font-medium truncate",
                isSelected ? "text-primary" : "text-foreground"
              )}
            >
              {label}
            </span>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {description}
            </p>
          )}
        </div>

        {/* Value */}
        {value !== undefined && (
          <span
            className={cn(
              "text-[15px] font-medium truncate max-w-[40%] shrink-0",
              valueMuted
                ? "text-muted-foreground/60"
                : isSelected
                  ? "text-primary"
                  : "text-muted-foreground"
            )}
          >
            {value}
          </span>
        )}

        {/* Accessory */}
        {renderAccessory()}
      </>
    );

    if (onClick) {
      return (
        <button
          ref={ref}
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "w-full flex items-center gap-3 min-h-14 px-4 py-3",
            "transition-colors active:bg-muted/50",
            "focus-visible:outline-none focus-visible:bg-muted/50",
            "disabled:opacity-50 disabled:pointer-events-none",
            isSelected && "bg-primary/5",
            className
          )}
        >
          {content}
        </button>
      );
    }

    return (
      <div
        className={cn(
          "flex items-center gap-3 min-h-14 px-4 py-3",
          isSelected && "bg-primary/5",
          className
        )}
      >
        {content}
      </div>
    );
  }
);

// ============================================================================
// LIST ROW GROUP - Section wrapper with optional title
// ============================================================================

interface ListRowGroupProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function ListRowGroup({ title, children, className }: ListRowGroupProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {title && (
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-4 mb-2">
          {title}
        </h4>
      )}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden divide-y divide-border/50 shadow-xs">
        {children}
      </div>
    </div>
  );
}
