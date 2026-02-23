import {
  Check as IconCheck,
  Filter as IconFilter,
  Package as IconPackage,
  PackageX as IconPackageOff,
} from "lucide-react"

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import type {
  StockFilter,
  WishlistToolbarLabels,
  WishlistUrlParams,
} from "./account-wishlist-toolbar.types"

export function StockFilterDropdownContent({
  widthClassName,
  labels,
  stockFilter,
  query,
  categoryFilter,
  setStockFilter,
  applyUrl,
}: {
  widthClassName: string
  labels: Pick<WishlistToolbarLabels, "all" | "inStock" | "outOfStock">
  stockFilter: StockFilter
  query: string
  categoryFilter: string | null
  setStockFilter: (next: StockFilter) => void
  applyUrl: (next: WishlistUrlParams) => void
}) {
  return (
    <DropdownMenuContent align="end" className={widthClassName}>
      <DropdownMenuItem
        onClick={() => {
          setStockFilter("all")
          applyUrl({ q: query, category: categoryFilter, stock: null })
        }}
      >
        <IconFilter className="size-4 mr-2 text-muted-foreground" />
        <span className="flex-1">{labels.all}</span>
        {stockFilter === "all" && <IconCheck className="size-4 text-primary" />}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setStockFilter("in-stock")
          applyUrl({ q: query, category: categoryFilter, stock: "in-stock" })
        }}
      >
        <IconPackage className="size-4 mr-2 text-success" />
        <span className="flex-1">{labels.inStock}</span>
        {stockFilter === "in-stock" && <IconCheck className="size-4 text-primary" />}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setStockFilter("out-of-stock")
          applyUrl({ q: query, category: categoryFilter, stock: "out-of-stock" })
        }}
      >
        <IconPackageOff className="size-4 mr-2 text-warning" />
        <span className="flex-1">{labels.outOfStock}</span>
        {stockFilter === "out-of-stock" && <IconCheck className="size-4 text-primary" />}
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
