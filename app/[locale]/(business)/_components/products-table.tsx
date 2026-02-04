"use client"

import * as React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconExternalLink,
  IconPackage,
  IconSearch,
  IconChevronDown,
  IconChevronUp,
  IconSelector,
  IconCopy,
  IconDownload,
  IconDotsVertical,
  IconX,
  IconRefresh,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductFormModal, type ProductFormData } from "./product-form-modal"
import { cn } from "@/lib/utils"

export type ProductsTableServerActions = {
  createProduct: (input: ProductFormData) => Promise<{
    success: boolean
    data?: { id: string }
    error?: string
  }>
  updateProduct: (productId: string, input: Partial<ProductFormData>) => Promise<{
    success: boolean
    error?: string
  }>
  deleteProduct: (productId: string) => Promise<{
    success: boolean
    error?: string
  }>
  bulkDeleteProducts: (productIds: string[]) => Promise<{
    success: boolean
    data?: { deleted: number }
    error?: string
  }>
  bulkUpdateProductStatus: (
    productIds: string[],
    status: "active" | "draft" | "archived" | "out_of_stock"
  ) => Promise<{
    success: boolean
    data?: { updated: number }
    error?: string
  }>
  duplicateProduct: (productId: string) => Promise<{
    success: boolean
    data?: { id: string }
    error?: string
  }>
}

interface Product {
  id: string
  title: string
  price: number
  list_price: number | null
  cost_price?: number | null
  sku?: string | null
  barcode?: string | null
  stock: number
  variant_count?: number | null
  track_inventory?: boolean | null
  status?: string | null
  weight?: number | null
  weight_unit?: string | null
  condition?: string | null
  images: string[] | null
  rating: number | null
  review_count: number | null
  created_at: string
  updated_at?: string | null
  category_id?: string | null
  category?: { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null
}

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  display_order?: number | null
  children?: Category[]
}

interface ProductsTableProps {
  initialProducts: Product[]
  categories: Category[]
  total: number
  sellerId: string
  actions: ProductsTableServerActions
}

type SortField = "title" | "price" | "stock" | "created_at" | "sku" | "status"
type SortOrder = "asc" | "desc"
type StatusFilter = "all" | "active" | "draft" | "archived" | "out_of_stock"

export function ProductsTable({
  initialProducts,
  categories,
  total,
  sellerId: _sellerId,
  actions,
}: ProductsTableProps) {
  const router = useRouter()
  const [products, setProducts] = React.useState<Product[]>(initialProducts)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [isAllSelected, setIsAllSelected] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [sortField, setSortField] = React.useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("desc")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // Count products by status
  const statusCounts = React.useMemo(() => {
    const counts = { all: products.length, active: 0, draft: 0, archived: 0, out_of_stock: 0 }
    products.forEach((p) => {
      const status = (p.status || "draft") as keyof typeof counts
      if (status in counts) counts[status]++
    })
    return counts
  }, [products])

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let result = [...products]

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => (p.status || "draft") === statusFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        (p.variant_count ? false : (p.sku && p.sku.toLowerCase().includes(query))) ||
        (p.barcode && p.barcode.toLowerCase().includes(query))
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "price":
          comparison = a.price - b.price
          break
        case "stock":
          comparison = a.stock - b.stock
          break
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case "sku":
          comparison = (a.variant_count ? "" : (a.sku || "")).localeCompare(
            b.variant_count ? "" : (b.sku || "")
          )
          break
        case "status":
          comparison = (a.status || "draft").localeCompare(b.status || "draft")
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [products, searchQuery, statusFilter, sortField, sortOrder])

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
      setIsAllSelected(false)
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)))
      setIsAllSelected(true)
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
    setIsAllSelected(newSelected.size === filteredProducts.length)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleProductSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      if (editingProduct) {
        const result = await actions.updateProduct(editingProduct.id, data)
        if (result.success) {
          toast.success("Product updated")
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingProduct.id
                ? {
                  ...p,
                  title: data.title,
                  price: data.price,
                  list_price: data.compareAtPrice || null,
                  cost_price: data.costPrice || null,
                  sku: data.sku || null,
                  barcode: data.barcode || null,
                  stock: data.stock,
                  track_inventory: data.trackInventory ?? true,
                  status: data.status || "draft",
                  weight: data.weight || null,
                  weight_unit: data.weightUnit || "kg",
                  condition: data.condition || "new",
                  images: data.images,
                  category_id: data.categoryId || null,
                  updated_at: new Date().toISOString()
                }
                : p
            )
          )
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update")
          throw new Error(result.error)
        }
      } else {
        const result = await actions.createProduct(data)
        if (result.success && result.data) {
          toast.success("Product created")
          const newProduct: Product = {
            id: result.data.id,
            title: data.title,
            price: data.price,
            list_price: data.compareAtPrice || null,
            cost_price: data.costPrice || null,
            sku: data.sku || null,
            barcode: data.barcode || null,
            stock: data.stock,
            track_inventory: data.trackInventory ?? true,
            status: data.status || "draft",
            weight: data.weight || null,
            weight_unit: data.weightUnit || "kg",
            condition: data.condition || "new",
            images: data.images,
            rating: null,
            review_count: null,
            created_at: new Date().toISOString(),
            category_id: data.categoryId || null,
          }
          setProducts((prev) => [newProduct, ...prev])
          router.refresh()
        } else {
          toast.error(result.error || "Failed to create")
          throw new Error(result.error)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} product(s)?`)) return
    setIsLoading(true)
    try {
      const result = await actions.bulkDeleteProducts([...selectedIds])
      if (result.success) {
        toast.success(`${selectedIds.size} deleted`)
        setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)))  
        setSelectedIds(new Set())
        setIsAllSelected(false)
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkStatusUpdate = async (newStatus: "active" | "draft" | "archived" | "out_of_stock") => {
    setIsLoading(true)
    try {
      const result = await actions.bulkUpdateProductStatus([...selectedIds], newStatus)
      if (result.success) {
        toast.success(`${selectedIds.size} product(s) set to ${newStatus}`)
        setProducts((prev) => prev.map((p) =>
          selectedIds.has(p.id) ? { ...p, status: newStatus } : p
        ))
        setSelectedIds(new Set())
        setIsAllSelected(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update status")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = async (productId: string) => {
    setIsLoading(true)
    try {
      const result = await actions.duplicateProduct(productId)
      if (result.success) {
        toast.success("Product duplicated")
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Delete this product?")) return
    setIsLoading(true)
    try {
      const result = await actions.deleteProduct(productId)
      if (result.success) {
        toast.success("Product deleted")
        setProducts((prev) => prev.filter((p) => p.id !== productId))      
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (value: number) => `${value.toFixed(2)} лв`

  const SortHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
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

  const getCategoryName = (product: Product) => {
    if (Array.isArray(product.category)) {
      return product.category[0]?.name || "—"
    }
    return product.category?.name || "—"
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Shopify-style Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between px-4 lg:px-6 py-4 border-b bg-background">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold">Products</h1>
              {/* Product status badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                  <span className="tabular-nums">{total}</span>
                  <span className="opacity-70">total</span>
                </span>
                {statusCounts.active > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                    <span className="tabular-nums">{statusCounts.active}</span>
                    <span className="opacity-70">active</span>
                  </span>
                )}
                {statusCounts.draft > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                    <span className="tabular-nums">{statusCounts.draft}</span>
                    <span className="opacity-70">draft</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <IconDownload className="size-4 mr-1.5" />
              Export
            </Button>
            <Button size="sm" onClick={handleAddProduct}>
              <IconPlus className="size-4 mr-1.5" />
              Add product
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="px-4 lg:px-6 border-b bg-background">
          <div className="flex gap-1 -mb-px">
            {([
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" },
              { value: "out_of_stock", label: "Out of Stock" },
            ] as const).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  "px-3 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  statusFilter === tab.value
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                {tab.label}
                  <span className={cn(
                  "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                  statusFilter === tab.value
                    ? "bg-selected text-primary"
                    : "bg-muted text-muted-foreground"
                )}>
                  {statusCounts[tab.value]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 lg:px-6 py-3 border-b bg-surface-subtle space-y-3">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 size-7"
                  onClick={() => setSearchQuery("")}
                >
                  <IconX className="size-3" />
                </Button>
              )}
            </div>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="h-8 text-xs">
                <IconRefresh className="size-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 py-2 px-3 rounded-md bg-background border flex-wrap">
              <span className="text-sm font-medium">{selectedIds.size} selected</span>
              <div className="flex items-center gap-1.5 ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled={isLoading}>
                      Set Status
                      <IconChevronDown className="size-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleBulkStatusUpdate("active")}>
                      <span className="size-2 rounded-full bg-success mr-2" />
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusUpdate("draft")}>
                      <span className="size-2 rounded-full bg-muted-foreground/50 mr-2" />
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusUpdate("archived")}>
                      <span className="size-2 rounded-full bg-destructive mr-2" />
                      Archived
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusUpdate("out_of_stock")}>
                      <span className="size-2 rounded-full bg-warning mr-2" />
                      Out of Stock
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={handleBulkDelete} disabled={isLoading}>
                  <IconTrash className="size-3 mr-1" />
                  Delete
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs ml-auto"
                onClick={() => { setSelectedIds(new Set()); setIsAllSelected(false) }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <IconPackage className="size-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-1">
                {searchQuery ? "No products found" : "No products yet"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? "Try a different search" : "Add your first product to get started"}
              </p>
              {!searchQuery && (
                <Button size="sm" onClick={handleAddProduct}>
                  <IconPlus className="size-4 mr-1.5" />
                  Add product
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-surface-subtle">
                  <TableHead className="w-10 pl-4">
                    <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="min-w-(--container-3xs)">
                    <SortHeader field="title">Product</SortHeader>
                  </TableHead>
                  <TableHead className="w-24">
                    <SortHeader field="sku">SKU</SortHeader>
                  </TableHead>
                  <TableHead className="w-24">
                    <SortHeader field="status">Status</SortHeader>
                  </TableHead>
                  <TableHead className="w-28">
                    <SortHeader field="stock">Inventory</SortHeader>
                  </TableHead>
                  <TableHead className="w-24">
                    <SortHeader field="price">Price</SortHeader>
                  </TableHead>
                  <TableHead className="w-24">Rating</TableHead>
                  <TableHead className="w-10 pr-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className={cn(
                      "group cursor-pointer",
                      selectedIds.has(product.id) && "bg-selected"
                    )}
                    onClick={() => handleEditProduct(product)}
                  >
                    <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Image */}
                        <div className="relative size-10 rounded-md overflow-hidden bg-muted shrink-0 border">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center">
                              <IconPackage className="size-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        {/* Title + Category */}
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
                    <TableCell>
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
                    <TableCell>
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
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {product.rating ? (
                          <span>⭐ {product.rating.toFixed(1)} ({product.review_count || 0})</span>
                        ) : (
                          <span className="text-xs">No reviews</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <IconPencil className="size-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/product/${product.id}`} target="_blank">
                              <IconExternalLink className="size-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(product.id)} disabled={isLoading}>
                            <IconCopy className="size-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(product.id)}
                            disabled={isLoading}
                          >
                            <IconTrash className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Footer */}
        {filteredProducts.length > 0 && (
          <div className="px-4 lg:px-6 py-3 border-t bg-surface-subtle text-xs text-muted-foreground">
            Showing {filteredProducts.length} of {total} products
          </div>
        )}
      </div>

      <ProductFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={editingProduct}
        categories={categories}
        onSubmit={handleProductSubmit}
      />
    </>
  )
}
