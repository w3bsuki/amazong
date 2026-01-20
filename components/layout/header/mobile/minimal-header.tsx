"use client"

import { Link } from "@/i18n/routing"
import type { MinimalHeaderProps } from "../types"

/**
 * Mobile Minimal Header
 * 
 * Minimal header with just the logo centered.
 * 
 * Used for: Auth pages, checkout (mobile only)
 */
export function MobileMinimalHeader({ locale }: MinimalHeaderProps) {
  return (
    <div className="md:hidden bg-background border-b border-border/50 pt-safe">
      <div className="h-12 px-4 flex items-center justify-center">
        <Link href="/">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>
      </div>
    </div>
  )
}
