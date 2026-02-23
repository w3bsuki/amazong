import Image from "next/image"
import { Link } from "@/i18n/routing"
import { getProductUrl } from "@/lib/url-utils"
import {
  Eye,
  Package,
  ShoppingCart,
  Trash,
  CircleX as XCircle,
  Tag as IconTag,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DrawerBody, DrawerFooter } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import type { WishlistItem } from "../account-wishlist.types"
import type { WishlistGridLabels } from "./account-wishlist-grid.types"

export function WishlistMobileGrid({
  items,
  locale,
  labels,
  selectedItem,
  setSelectedItem,
  removingId,
  formatCurrency,
  formatDate,
  handleMoveToCart,
  handleRemove,
}: {
  items: WishlistItem[]
  locale: string
  labels: WishlistGridLabels
  selectedItem: WishlistItem | null
  setSelectedItem: (item: WishlistItem | null) => void
  removingId: string | null
  formatCurrency: (value: number) => string
  formatDate: (date: string) => string
  handleMoveToCart: (item: WishlistItem) => void | Promise<void>
  handleRemove: (productId: string) => void | Promise<void>
}) {
  return (
    <div className="grid grid-cols-2 gap-3 pb-20 md:hidden md:pb-0">
      {items.map((item) => (
        <div key={item.id}>
          <div
            onClick={() => setSelectedItem(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setSelectedItem(item)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={locale === "bg" ? `Отвори ${item.title}` : `Open ${item.title}`}
            aria-haspopup="dialog"
            aria-expanded={selectedItem?.id === item.id}
            className="flex flex-col rounded-md bg-card border border-border overflow-hidden transition-colors active:bg-active text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {/* Product Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-card">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className={cn("object-cover", item.stock <= 0 && "opacity-60 grayscale-30")}
                sizes="(max-width: 768px) 50vw, 200px"
              />
              {/* Stock indicator badge */}
              {item.stock > 0 ? (
                <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-success">
                  <Package className="size-3.5 text-primary-foreground" />
                </div>
              ) : (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-warning">
                  <XCircle className="size-3 text-foreground" />
                  <span className="text-2xs font-semibold text-foreground">{labels.outOfStock}</span>
                </div>
              )}
              {/* Category badge */}
              {item.category_name && (
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-surface-overlay">
                  <span className="text-2xs font-medium text-overlay-text">{item.category_name}</span>
                </div>
              )}
              {/* Quick add to cart button overlay */}
              {item.stock > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMoveToCart(item)
                  }}
                  aria-label={
                    locale === "bg"
                      ? `Добави ${item.title} в количката`
                      : `Add ${item.title} to cart`
                  }
                  className="absolute bottom-2 right-2 flex size-11 items-center justify-center rounded-full bg-foreground"
                >
                  <ShoppingCart className="size-4 text-overlay-text" />
                </button>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col p-3 flex-1">
              <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight mb-2">
                {item.title}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <p
                  className={cn(
                    "text-base font-bold",
                    item.stock > 0 ? "text-foreground" : "text-muted-foreground line-through"
                  )}
                >
                  {formatCurrency(item.price)}
                </p>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(item.product_id)
                  }}
                  disabled={removingId === item.product_id}
                  aria-label={locale === "bg" ? `Премахни ${item.title}` : `Remove ${item.title}`}
                  className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive-subtle transition-colors"
                >
                  <Trash className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Detail Drawer */}
          <DrawerShell
            open={selectedItem?.id === item.id}
            onOpenChange={(open) => !open && setSelectedItem(null)}
            title={item.title}
            titleClassName="line-clamp-2 text-lg"
            closeLabel={locale === "bg" ? "Затвори" : "Close"}
            contentAriaLabel={item.title}
            description={
              <>
                {labels.addedOn} {formatDate(item.created_at)}
                {item.category_name && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <Badge variant="outline" className="text-xs">
                      <IconTag className="size-3 mr-1" />
                      {item.category_name}
                    </Badge>
                  </>
                )}
              </>
            }
            descriptionClassName="flex items-center gap-2 flex-wrap"
            headerClassName="border-b border-border bg-background text-left"
            contentClassName="max-h-(--dialog-h-85vh) rounded-t-2xl gap-0 overflow-hidden"
          >
            <DrawerBody className="px-4 py-4">
              <div className="relative mx-auto aspect-square w-full max-w-60 overflow-hidden rounded-xl bg-muted">
                <Image src={item.image} alt={item.title} fill className="object-contain" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{labels.price}</span>
                  <span className="text-2xl font-bold text-foreground">{formatCurrency(item.price)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{labels.availability}</span>
                  {item.stock > 0 ? (
                    <Badge variant="outline" className="border-success/20 bg-success/10 text-success">
                      <Package className="size-3 mr-1" />
                      {item.stock} {labels.inStock}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-warning/20 bg-warning/10 text-warning">
                      <XCircle className="size-3 mr-1" />
                      {labels.outOfStock}
                    </Badge>
                  )}
                </div>
              </div>
            </DrawerBody>

            <DrawerFooter className="flex-col gap-2 sm:flex-col border-t border-border bg-background pb-safe-max">
              <Button onClick={() => handleMoveToCart(item)} disabled={item.stock <= 0} className="w-full h-12 text-base">
                <ShoppingCart className="size-5 mr-2" />
                {labels.moveToCart}
              </Button>
              <div className="flex gap-2 w-full">
                <Button variant="outline" asChild className="flex-1 h-11">
                  <Link
                    href={getProductUrl({
                      id: item.product_id,
                      slug: item.slug ?? null,
                      username: item.username ?? null,
                    })}
                  >
                    <Eye className="size-4 mr-2" />
                    {labels.viewProduct}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleRemove(item.product_id)
                    setSelectedItem(null)
                  }}
                  disabled={removingId === item.product_id}
                  className="text-destructive hover:text-destructive h-11 px-4"
                  aria-label={locale === "bg" ? `Премахни ${item.title}` : `Remove ${item.title}`}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
            </DrawerFooter>
          </DrawerShell>
        </div>
      ))}
    </div>
  )
}
