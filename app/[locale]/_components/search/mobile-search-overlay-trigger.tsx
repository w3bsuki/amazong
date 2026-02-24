import type { RefObject } from "react"
import { Search as MagnifyingGlass } from "lucide-react"

import { cn } from "@/lib/utils"

type MobileSearchOverlayTriggerProps = {
  hideDefaultTrigger: boolean
  triggerRef: RefObject<HTMLButtonElement | null>
  isOpen: boolean
  className?: string | undefined
  onOpen: () => void
  searchLabel: string
}

export function MobileSearchOverlayTrigger({
  hideDefaultTrigger,
  triggerRef,
  isOpen,
  className,
  onOpen,
  searchLabel,
}: MobileSearchOverlayTriggerProps) {
  if (hideDefaultTrigger) return null

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onOpen}
      className={cn(
        "flex items-center justify-center",
        "size-(--control-default) p-0",
        "rounded-lg text-header-text",
        "hover:bg-header-hover active:bg-header-active",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "transition-colors duration-150",
        "md:hidden touch-manipulation",
        className
      )}
      aria-label={searchLabel}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
    >
      <MagnifyingGlass size={24} aria-hidden="true" />
    </button>
  )
}
