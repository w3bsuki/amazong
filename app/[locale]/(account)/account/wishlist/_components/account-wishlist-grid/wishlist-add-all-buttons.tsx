import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { WishlistItem } from "../account-wishlist.types"
import type { WishlistGridLabels } from "./account-wishlist-grid.types"

export function WishlistAddAllButtons({
  items,
  labels,
  handleAddAllToCart,
}: {
  items: WishlistItem[]
  labels: WishlistGridLabels
  handleAddAllToCart: () => void
}) {
  const inStockCount = items.filter((i) => i.stock > 0).length
  const hasInStock = inStockCount > 0

  return (
    <>
      {/* Add All to Cart Button (Desktop only) */}
      {hasInStock && (
        <div className="hidden md:flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleAddAllToCart}
            className="border-border-subtle hover:bg-hover active:bg-active"
          >
            <ShoppingCart className="size-4 mr-2" />
            {labels.addAllToCart} ({inStockCount})
          </Button>
        </div>
      )}

      {/* Mobile: Floating Add All button */}
      {hasInStock && items.length > 2 && (
        <div className="fixed bottom-tabbar-offset left-4 right-4 z-40 md:hidden">
          <Button onClick={handleAddAllToCart} className="w-full h-12 rounded-full">
            <ShoppingCart className="size-5 mr-2" />
            {labels.addAllToCart} ({inStockCount})
          </Button>
        </div>
      )}
    </>
  )
}
