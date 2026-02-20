import * as React from "react"
import { ChevronDown as IconChevronDown, ChevronUp as IconChevronUp, Package as IconPackage, Plus as IconPlus, ChevronsUpDown as IconSelector } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ProductsTableRow } from "./products-table-row"
import type { Product, SortField, SortOrder } from "./products-table.types"

interface ProductsTableGridProps {
  filteredProducts: Product[]
  selectedIds: Set<string>
  isAllSelected: boolean
  sortField: SortField
  sortOrder: SortOrder
  sellerUsername: string | null
  isLoading: boolean
  searchQuery: string
  onAddProduct: () => void
  onSort: (field: SortField) => void
  onToggleSelectAll: () => void
  onToggleSelect: (id: string) => void
  onEditProduct: (product: Product) => void
  onDuplicate: (productId: string) => Promise<void>
  onDelete: (productId: string) => Promise<void>
}

const SORTABLE_COLUMNS: Array<{
  field: SortField
  tableHeadClassName: string
  label: string
}> = [
  { field: "title", tableHeadClassName: "min-w-(--container-3xs)", label: "Product" },
  { field: "sku", tableHeadClassName: "hidden md:table-cell w-24", label: "SKU" },
  { field: "status", tableHeadClassName: "w-24", label: "Status" },
  { field: "stock", tableHeadClassName: "hidden md:table-cell w-28", label: "Inventory" },
  { field: "price", tableHeadClassName: "w-24", label: "Price" },
]

function SortHeader({
  field,
  sortField,
  sortOrder,
  className,
  children,
  onSort,
}: {
  field: SortField
  sortField: SortField
  sortOrder: SortOrder
  className?: string
  children: React.ReactNode
  onSort: (field: SortField) => void
}) {
  return (
    <button
      onClick={() => onSort(field)}
      className={cn("flex items-center gap-1 hover:text-foreground transition-colors text-xs font-medium", className)}
    >
      {children}
      {sortField === field ? (
        sortOrder === "asc" ? <IconChevronUp className="size-3" /> : <IconChevronDown className="size-3" />
      ) : (
        <IconSelector className="size-3 opacity-40" />
      )}
    </button>
  )
}

export function ProductsTableGrid({
  filteredProducts,
  selectedIds,
  isAllSelected,
  sortField,
  sortOrder,
  sellerUsername,
  isLoading,
  searchQuery,
  onAddProduct,
  onSort,
  onToggleSelectAll,
  onToggleSelect,
  onEditProduct,
  onDuplicate,
  onDelete,
}: ProductsTableGridProps) {
  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <IconPackage className="size-12 text-muted-foreground mb-4" />
        <h3 className="font-medium mb-1">
          {searchQuery ? "No products found" : "No products yet"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {searchQuery ? "Try a different search" : "Add your first product to get started"}
        </p>
        {!searchQuery && (
          <Button size="sm" onClick={onAddProduct}>
            <IconPlus className="size-4 mr-1.5" />
            Add product
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className="overflow-x-auto"
      style={{ "--business-table-min-w": "68rem" } as React.CSSProperties}
    >
      <Table className="min-w-(--business-table-min-w)">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-surface-subtle">
            <TableHead className="w-10 pl-4">
              <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
            </TableHead>
            {SORTABLE_COLUMNS.map(({ field, tableHeadClassName, label }) => (
              <TableHead key={field} className={tableHeadClassName}>
                <SortHeader field={field} sortField={sortField} sortOrder={sortOrder} onSort={onSort}>
                  {label}
                </SortHeader>
              </TableHead>
            ))}
            <TableHead className="hidden md:table-cell w-24">Rating</TableHead>
            <TableHead className="w-10 pr-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <ProductsTableRow
              key={product.id}
              product={product}
              isSelected={selectedIds.has(product.id)}
              sellerUsername={sellerUsername}
              isLoading={isLoading}
              onToggleSelect={onToggleSelect}
              onEditProduct={onEditProduct}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
