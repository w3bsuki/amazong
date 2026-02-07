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
    <div className="border-b border-border-subtle bg-background pt-safe md:hidden">
      <div className="flex h-(--control-primary) items-center justify-center px-4">
        <Link href="/">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido.</span>
        </Link>
      </div>
    </div>
  )
}
