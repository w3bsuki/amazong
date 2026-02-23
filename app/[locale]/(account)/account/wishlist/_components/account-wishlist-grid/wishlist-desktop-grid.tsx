import Image from "next/image"
import { Link } from "@/i18n/routing"
import { getProductUrl } from "@/lib/url-utils"
import { Eye, Heart as IconHeart, Package, ShoppingCart, Trash, CircleX as XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type { WishlistItem } from "../account-wishlist.types"
import type { WishlistGridLabels } from "./account-wishlist-grid.types"

export function WishlistDesktopGrid({
  items,
  locale,
  labels,
  removingId,
  formatCurrency,
  formatDate,
  handleMoveToCart,
  handleRemove,
}: {
  items: WishlistItem[]
  locale: string
  labels: WishlistGridLabels
  removingId: string | null
  formatCurrency: (value: number) => string
  formatDate: (date: string) => string
  handleMoveToCart: (item: WishlistItem) => void | Promise<void>
  handleRemove: (productId: string) => void | Promise<void>
}) {
  return (
    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative flex flex-col rounded-md bg-card border border-border overflow-hidden transition-colors hover:border-hover-border"
        >
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-card">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className={cn("object-cover", item.stock <= 0 && "opacity-60 grayscale-30")}
              sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />

            <Link
              href={getProductUrl({
                id: item.product_id,
                slug: item.slug ?? null,
                username: item.username ?? null,
              })}
              className="absolute inset-0 z-10"
              aria-label={locale === "bg" ? `Виж ${item.title}` : `View ${item.title}`}
            />

            {/* Stock indicator */}
            {item.stock > 0 ? (
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success">
                <Package className="size-3.5 text-primary-foreground" />
                <span className="text-xs font-semibold text-primary-foreground">{item.stock}</span>
              </div>
            ) : (
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning">
                <XCircle className="size-3.5 text-foreground" />
                <span className="text-xs font-semibold text-foreground">{labels.outOfStock}</span>
              </div>
            )}
            {/* Category badge */}
            {item.category_name && (
              <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-full bg-surface-overlay">
                <span className="text-xs font-medium text-overlay-text">{item.category_name}</span>
              </div>
            )}
            {/* Hover overlay with quick actions */}
            <div className="absolute inset-0 z-20 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-background text-foreground hover:bg-muted" asChild>
                  <Link
                    href={getProductUrl({
                      id: item.product_id,
                      slug: item.slug ?? null,
                      username: item.username ?? null,
                    })}
                  >
                    <Eye className="size-4 mr-1.5" />
                    {labels.viewProduct}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col p-4 flex-1">
            <Link
              href={getProductUrl({
                id: item.product_id,
                slug: item.slug ?? null,
                username: item.username ?? null,
              })}
              className="text-sm font-medium text-foreground line-clamp-2 leading-tight hover:text-primary transition-colors mb-2"
            >
              {item.title}
            </Link>

            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    "text-lg font-bold",
                    item.stock > 0 ? "text-foreground" : "text-muted-foreground line-through"
                  )}
                >
                  {formatCurrency(item.price)}
                </p>
                <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleMoveToCart(item)} disabled={item.stock <= 0} className="flex-1">
                  <ShoppingCart className="size-4 mr-1.5" />
                  {labels.moveToCart}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(item.product_id)}
                  disabled={removingId === item.product_id}
                  className="text-destructive hover:text-destructive hover:bg-destructive-subtle"
                  aria-label={locale === "bg" ? `Премахни ${item.title}` : `Remove ${item.title}`}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Wishlist heart indicator */}
          <div className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full bg-background">
            <IconHeart className="size-4 text-destructive fill-destructive" />
          </div>
        </div>
      ))}
    </div>
  )
}
