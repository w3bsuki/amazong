import { ReactNode } from "react"
import { ShoppingBag, Tag } from "@phosphor-icons/react/dist/ssr"
import { getCategoryIconForSlug } from "@/lib/category-icons"

// Centralized icon mapping for L0/L1 categories used by mega menu and subheader.
// Keep UI renderers free of bulky data objects.
// This is a legacy wrapper around the more flexible lib/category-icons.tsx
export function getCategoryIcon(
  slug: string,
  fallback: ReactNode = <ShoppingBag size={20} weight="regular" className="mega-menu-icon" />
) {
  if (slug === "deals") {
    return <Tag size={20} weight="regular" className="mega-menu-icon" />
  }

  const Icon = getCategoryIconForSlug(slug)
  if (Icon === ShoppingBag && slug !== "wholesale") {
    return fallback
  }

  return <Icon size={20} weight="regular" className="mega-menu-icon" />
}

