import type { ProductFormData } from "./product-form-modal"

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

export interface Product {
  id: string
  title: string
  slug?: string | null
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

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  display_order?: number | null
  children?: Category[]
}

export interface ProductsTableProps {
  initialProducts: Product[]
  categories: Category[]
  total: number
  sellerId: string
  sellerUsername: string | null
  actions: ProductsTableServerActions
}

export type SortField = "title" | "price" | "stock" | "created_at" | "sku" | "status"
export type SortOrder = "asc" | "desc"
export type StatusFilter = "all" | "active" | "draft" | "archived" | "out_of_stock"
