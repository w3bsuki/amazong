import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Copy as IconCopy, EllipsisVertical as IconDotsVertical, ExternalLink as IconExternalLink, Package as IconPackage, Pencil as IconPencil, Trash as IconTrash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Product } from "./products-table.types"

interface ProductsTableRowProps {
  product: Product
  isSelected: boolean
  sellerUsername: string | null
  isLoading: boolean
  onToggleSelect: (id: string) => void
  onEditProduct: (product: Product) => void
  onDuplicate: (productId: string) => Promise<void>
  onDelete: (productId: string) => Promise<void>
}

function formatPrice(value: number) {
  return `${value.toFixed(2)} лв`
}

function getCategoryName(product: Product) {
  if (Array.isArray(product.category)) {
    return product.category[0]?.name || "—"
  }
  return product.category?.name || "—"
}

export function ProductsTableRow({
  product,
  isSelected,
  sellerUsername,
  isLoading,
  onToggleSelect,
  onEditProduct,
  onDuplicate,
  onDelete,
}: ProductsTableRowProps) {
  return (
    <TableRow
      className={cn(
        "group cursor-pointer",
        isSelected && "bg-selected"
      )}
      onClick={() => onEditProduct(product)}
    >
      <TableCell className="pl-4" onClick={(event) => event.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(product.id)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative size-10 rounded-md overflow-hidden bg-muted shrink-0 border">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <IconPackage className="size-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
              {product.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {getCategoryName(product)}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="text-xs text-muted-foreground font-mono">
          {product.variant_count ? "—" : (product.sku || "—")}
        </span>
      </TableCell>
      <TableCell>
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
          product.status === "active" && "bg-success/10 text-success border border-success/20",
          product.status === "draft" && "bg-muted text-muted-foreground border border-border",
          product.status === "archived" && "bg-destructive-subtle text-destructive border border-destructive/20",
          product.status === "out_of_stock" && "bg-warning/10 text-warning border border-warning/20",
          !product.status && "bg-muted text-muted-foreground border border-border"
        )}>
          {product.status === "out_of_stock" ? "Out of Stock" :
            product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "Draft"}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className={cn(
          "text-sm tabular-nums",
          product.stock === 0 && "text-destructive font-medium",
          product.stock > 0 && product.stock <= 5 && "text-warning",
        )}>
          {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
        </span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {product.list_price && product.list_price > product.price && (
            <span className="text-xs text-muted-foreground line-through ml-1.5">
              {formatPrice(product.list_price)}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="text-sm text-muted-foreground">
          {product.rating ? (
            <span>⭐ {product.rating.toFixed(1)} ({product.review_count || 0})</span>
          ) : (
            <span className="text-xs">No reviews</span>
          )}
        </div>
      </TableCell>
      <TableCell className="pr-4" onClick={(event) => event.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Open actions for ${product.title}`}
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEditProduct(product)}>
              <IconPencil className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={sellerUsername ? `/${sellerUsername}/${product.slug || product.id}` : "#"}
                target="_blank"
              >
                <IconExternalLink className="size-4 mr-2" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void onDuplicate(product.id)} disabled={isLoading}>
              <IconCopy className="size-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => void onDelete(product.id)}
              disabled={isLoading}
            >
              <IconTrash className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
