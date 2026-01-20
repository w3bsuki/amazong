"use client"

import { Link } from "@/i18n/routing"
import type { MinimalHeaderProps } from "../types"

/**
 * Desktop Minimal Header
 * 
 * Minimal desktop header with just the logo centered.
 * 
 * Used for: Auth pages, checkout (desktop only)
 */
export function DesktopMinimalHeader({ locale }: MinimalHeaderProps) {
  return (
    <div className="hidden md:block bg-header-bg border-b border-header-border">
      <div className="container h-16 flex items-center justify-center">
        <Link href="/">
          <span className="text-xl font-bold tracking-tight text-header-text">treido.</span>
        </Link>
      </div>
    </div>
  )
}
