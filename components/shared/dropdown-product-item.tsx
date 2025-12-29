"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Package, Trash } from "@phosphor-icons/react"
import type { ReactNode } from "react"

export interface DropdownItemData {
  id: string
  title: string
  price: number
  image?: string | null
  href: string
}

interface DropdownProductItemProps {
  item: DropdownItemData
  formatPrice: (price: number) => string
  onRemove: () => void
  removeLabel: string
  /** Optional slot for extra content (e.g., quantity controls) */
  children?: ReactNode
}

/**
 * Shared product item component for dropdown menus (cart, wishlist).
 * Displays product image, title, price, and remove button with consistent styling.
 */
export function DropdownProductItem({
  item,
  formatPrice,
  onRemove,
  removeLabel,
  children,
}: DropdownProductItemProps) {
  return (
    <div className="flex gap-3 p-3 border-b border-border hover:bg-muted">
      <Link href={item.href} className="shrink-0">
        <div className="w-16 h-16 bg-muted rounded overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Package size={24} weight="regular" />
            </div>
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={item.href}
          className="text-sm font-normal text-foreground hover:text-brand line-clamp-2"
        >
          {item.title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium text-foreground">{formatPrice(item.price)}</span>
        </div>
        {children}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault()
          onRemove()
        }}
        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive self-start"
        aria-label={removeLabel}
      >
        <Trash size={16} weight="regular" />
      </button>
    </div>
  )
}
