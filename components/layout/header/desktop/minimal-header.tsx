import { Link } from "@/i18n/routing"
import type { MinimalHeaderProps } from "../types"

/**
 * Desktop Minimal Header
 * 
 * Minimal desktop header with just the logo centered.
 * 
 * Used for: Auth pages, checkout (desktop only)
 */
export function DesktopMinimalHeader({}: MinimalHeaderProps) {
  return (
    <div className="hidden md:block bg-header-bg border-b border-header-border">
      <div className="container h-16 flex items-center justify-center">
        <Link href="/" className="rounded-sm tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
          <span className="text-xl font-bold tracking-tight text-header-text">treido<span className="text-primary">.</span></span>
        </Link>
      </div>
    </div>
  )
}

