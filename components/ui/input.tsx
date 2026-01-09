import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Treido pattern: bg-zinc-50 (distinct from white), h-11 touch targets, text-[16px] iOS zoom-safe
        // Focus: border-zinc-900 (not ring), clean transition
        "flex h-11 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-[16px] font-medium text-zinc-900 placeholder:text-zinc-400 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 tap-highlight-transparent transition-colors",
        "focus:bg-white focus:border-zinc-900 focus:outline-none",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
