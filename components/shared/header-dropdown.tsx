import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface HeaderDropdownProps {
  triggerHref: string
  trigger: ReactNode
  ariaLabel: string
  children: ReactNode
  align?: "start" | "center" | "end"
  widthClassName?: string
  triggerClassName?: string
  triggerTestId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  openDelay?: number
  closeDelay?: number
  sideOffset?: number
  collisionPadding?: number
}

export function HeaderDropdown({
  triggerHref,
  trigger,
  ariaLabel,
  children,
  align = "end",
  widthClassName = "w-64",
  triggerClassName = "block rounded-md outline-none focus-visible:outline-2 focus-visible:outline-ring",
  triggerTestId,
  open,
  onOpenChange,
  openDelay = 100,
  closeDelay = 200,
  sideOffset = 8,
  collisionPadding = 10,
}: HeaderDropdownProps) {
  return (
    <HoverCard
      {...(typeof open === "boolean" ? { open } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      <HoverCardTrigger asChild>
        <Link
          href={triggerHref}
          data-testid={triggerTestId}
          className={triggerClassName}
          aria-label={ariaLabel}
        >
          {trigger}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className={cn(
          widthClassName,
          "p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden shadow-dropdown"
        )}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}
