import { Link } from "@/i18n/routing"
import type { MinimalHeaderProps } from "../types"

/**
 * Mobile Minimal Header
 * 
 * Minimal header with just the logo centered.
 * 
 * Used for: Auth pages, checkout (mobile only)
 */
export function MobileMinimalHeader({}: MinimalHeaderProps) {
  return (
    <div className="border-b border-border-subtle bg-background pt-safe md:hidden">
      <div className="flex h-(--control-primary) items-center justify-center px-4">
        <Link href="/" className="rounded-sm tap-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
          <span className="text-lg font-extrabold tracking-tight text-foreground">treido<span className="text-primary">.</span></span>
        </Link>
      </div>
    </div>
  )
}

