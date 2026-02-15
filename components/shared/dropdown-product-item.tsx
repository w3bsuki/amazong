"use client"

import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Package, Trash } from "@/lib/icons/phosphor"
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
  children?: ReactNode
}

export function DropdownProductItem({
  item,
  formatPrice,
  onRemove,
  removeLabel,
  children,
}: DropdownProductItemProps) {
  return (
    <div className="flex gap-2 p-2 border-b border-border hover:bg-hover">
      <Link href={item.href} className="shrink-0">
        <div className="size-12 bg-muted rounded-md overflow-hidden border border-border">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              width={48}
              height={48}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-muted-foreground">
              <Package size={18} weight="regular" />
            </div>
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={item.href}
          className="text-sm text-foreground hover:text-primary line-clamp-2 leading-snug"
        >
          {item.title}
        </Link>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-sm font-semibold text-price">{formatPrice(item.price)}</span>
        </div>
        {children}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          onRemove()
        }}
        className="size-6 self-start flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive-subtle hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={removeLabel}
      >
        <Trash size={14} weight="regular" />
      </button>
    </div>
  )
}
