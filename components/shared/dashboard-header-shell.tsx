import type { ReactNode } from "react"

import { SidebarTrigger } from "@/components/layout/sidebar/sidebar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface DashboardHeaderShellProps {
  children: ReactNode
  className?: string
  rowClassName?: string
  triggerClassName?: string
  separatorClassName?: string
}

const DEFAULT_HEADER_CLASS =
  "flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
const DEFAULT_ROW_CLASS = "flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6"
const DEFAULT_TRIGGER_CLASS = "-ml-1"
const DEFAULT_SEPARATOR_CLASS = "mx-2 data-[orientation=vertical]:h-4"

export function DashboardHeaderShell({
  children,
  className,
  rowClassName = DEFAULT_ROW_CLASS,
  triggerClassName = DEFAULT_TRIGGER_CLASS,
  separatorClassName = DEFAULT_SEPARATOR_CLASS,
}: DashboardHeaderShellProps) {
  return (
    <header className={cn(DEFAULT_HEADER_CLASS, className)}>
      <div className={rowClassName}>
        <SidebarTrigger className={triggerClassName} />
        <Separator orientation="vertical" className={separatorClassName} />
        {children}
      </div>
    </header>
  )
}
