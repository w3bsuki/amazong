import * as React from "react"
import { cn } from "@/lib/utils"

export function CategoryChips({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; label: string }[]
  activeId?: string
  onSelect?: (id: string) => void
}) {
  return (
    <div className="mt-3 px-4">
      <div className="flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        {items.map((c) => {
          const active = c.id === activeId
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect?.(c.id)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-2 text-sm font-medium shadow-sm",
                "transition-colors",
                active
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/70 bg-background text-foreground/90",
                "active:scale-[0.98]"
              )}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
