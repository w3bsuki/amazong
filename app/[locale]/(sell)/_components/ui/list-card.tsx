"use client";

import { type ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// LIST CARD - iOS-style grouped table view card
// Premium rounded corners, subtle shadows, proper spacing
// ============================================================================

interface ListCardProps {
  children: ReactNode;
  className?: string;
  /** Optional header content (title, description, etc.) */
  header?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
}

export const ListCard = forwardRef<HTMLDivElement, ListCardProps>(
  function ListCard({ children, className, header, footer }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs",
          className
        )}
      >
        {header && (
          <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
            {header}
          </div>
        )}
        <div className="divide-y divide-border/50">
          {children}
        </div>
        {footer && (
          <div className="px-4 py-3 bg-muted/20 border-t border-border/50">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

// ============================================================================
// LIST CARD HEADER - Title + optional description for card sections
// ============================================================================

interface ListCardHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ListCardHeader({
  title,
  description,
  icon,
  action,
  className,
}: ListCardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-foreground truncate">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
