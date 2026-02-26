"use client"
import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import type { ProductFormData } from "./product-form-modal"
import { ProductsTableGrid } from "./products-table-grid"
import { toNewProduct, toUpdatedProduct } from "./products-table-mappers"
import { ProductsTableToolbar } from "./products-table-toolbar"
import type {
  Product,
  ProductsTableProps,
  SortField,
  SortOrder,
  StatusFilter,
} from "./products-table.types"
export type { ProductsTableServerActions } from "./products-table.types"

const ProductFormModal = dynamic(
  () => import("./product-form-modal").then((mod) => mod.ProductFormModal),
  { ssr: false },
)
export function ProductsTable({
  initialProducts,
  categories,
  total,
  sellerUsername,
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
  const statusCounts = React.useMemo<Record<StatusFilter, number>>(() => {
    const counts: Record<StatusFilter, number> = {
      all: products.length,
      active: 0,
      draft: 0,
      archived: 0,
      out_of_stock: 0,
    }
    products.forEach((product) => {
      const status = (product.status || "draft") as StatusFilter
      if (status in counts) counts[status] += 1
    })
    return counts
  }, [products])
  const filteredProducts = React.useMemo(() => {
    let result = [...products]
    if (statusFilter !== "all") {
      result = result.filter((product) => (product.status || "draft") === statusFilter)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((product) =>
        product.title.toLowerCase().includes(query) ||
        (product.variant_count ? false : (product.sku && product.sku.toLowerCase().includes(query))) ||
        (product.barcode && product.barcode.toLowerCase().includes(query))
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
      return
    }
    setSelectedIds(new Set(filteredProducts.map((product) => product.id)))
    setIsAllSelected(true)
  }
  const toggleSelect = (id: string) => {
    const nextSelected = new Set(selectedIds)
    if (nextSelected.has(id)) {
      nextSelected.delete(id)
    } else {
      nextSelected.add(id)
    }
    setSelectedIds(nextSelected)
    setIsAllSelected(nextSelected.size > 0 && nextSelected.size === filteredProducts.length)
  }
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
      return
    }
    setSortField(field)
    setSortOrder("asc")
  }
  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }
  const clearSelection = () => {
    setSelectedIds(new Set())
    setIsAllSelected(false)
  }
  const handleProductSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      if (editingProduct) {
        const result = await actions.updateProduct(editingProduct.id, data)
        if (!result.success) {
          toast.error(result.error || "Failed to update")
          throw new Error(result.error)
        }
        toast.success("Product updated")
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingProduct.id
              ? toUpdatedProduct(product, data)
              : product
          )
        )
        router.refresh()
        return
      }
      const result = await actions.createProduct(data)
      if (!result.success || !result.data?.id) {
        toast.error(result.error || "Failed to create")
        throw new Error(result.error)
      }
      toast.success("Product created")
      const createdId = result.data.id
      setProducts((prev) => [toNewProduct(createdId, data), ...prev])
      router.refresh()
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
        setProducts((prev) => prev.filter((product) => !selectedIds.has(product.id)))
        clearSelection()
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }
  const handleBulkStatusUpdate = async (nextStatus: Exclude<StatusFilter, "all">) => {
    setIsLoading(true)
    try {
      const result = await actions.bulkUpdateProductStatus([...selectedIds], nextStatus)
      if (!result.success) {
        toast.error(result.error || "Failed to update status")
        return
      }
      toast.success(`${selectedIds.size} product(s) set to ${nextStatus}`)
      setProducts((prev) => prev.map((product) =>
        selectedIds.has(product.id) ? { ...product, status: nextStatus } : product
      ))
      clearSelection()
      router.refresh()
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
        setProducts((prev) => prev.filter((product) => product.id !== productId))
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <div className="flex flex-col h-full">
        <ProductsTableToolbar
          total={total}
          statusFilter={statusFilter}
          statusCounts={statusCounts}
          searchQuery={searchQuery}
          selectedCount={selectedIds.size}
          isLoading={isLoading}
          onStatusFilterChange={setStatusFilter}
          onSearchQueryChange={setSearchQuery}
          onAddProduct={handleAddProduct}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          onBulkDelete={handleBulkDelete}
          onClearSelection={clearSelection}
        />
        <div className="flex-1 overflow-auto">
          <ProductsTableGrid
            filteredProducts={filteredProducts}
            selectedIds={selectedIds}
            isAllSelected={isAllSelected}
            sortField={sortField}
            sortOrder={sortOrder}
            sellerUsername={sellerUsername}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onAddProduct={handleAddProduct}
            onSort={handleSort}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelect={toggleSelect}
            onEditProduct={handleEditProduct}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        </div>
        {filteredProducts.length > 0 && (
          <div className="px-4 lg:px-6 py-3 border-t bg-surface-subtle text-xs text-muted-foreground">
            Showing {filteredProducts.length} of {total} products
          </div>
        )}
      </div>
      {isModalOpen ? (
        <ProductFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          product={editingProduct}
          categories={categories}
          onSubmit={handleProductSubmit}
        />
      ) : null}
    </>
  )
}
