import type React from "react"

import { ChevronRight as CaretRight } from "lucide-react"

import { Link } from "@/i18n/routing"

interface SidebarMenuNavLinkProps {
  href: string
  icon: React.ComponentType<{
    size?: number
    weight?: "regular" | "duotone" | "fill"
    className?: string
  }>
  label: string
  onClick: () => void
}

export function SidebarMenuNavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: SidebarMenuNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex min-h-(--control-primary) items-center gap-4 rounded-lg px-4 tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) motion-reduce:transition-none hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
    >
      <Icon size={22} className="text-muted-foreground shrink-0" />
      <span className="text-sm font-medium text-foreground flex-1">{label}</span>
      <CaretRight size={16} className="text-muted-foreground shrink-0" />
    </Link>
  )
}
