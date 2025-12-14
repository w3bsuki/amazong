"use client"

import * as React from "react"
import Link from "next/link"
import { IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Breadcrumb[]
  badges?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function BusinessPageHeader({
  title,
  description,
  breadcrumbs,
  badges,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <IconChevronRight className="size-3" />}
              {crumb.href ? (
                <Link 
                  href={crumb.href} 
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      {/* Title Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {badges}
          </div>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
      
      {/* Optional children (tabs, filters, etc) */}
      {children}
    </div>
  )
}

// Compact inline badge for page headers
interface PageBadgeProps {
  label: string
  value: number | string
  variant?: "default" | "success" | "warning" | "error" | "info"
  className?: string
}

const variantStyles = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400",
  error: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
}

export function PageBadge({ label, value, variant = "default", className }: PageBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
      variantStyles[variant],
      className
    )}>
      <span className="tabular-nums">{value}</span>
      <span className="opacity-70">{label}</span>
    </span>
  )
}
