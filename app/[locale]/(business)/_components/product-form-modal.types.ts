import type { ProductFormData } from "./product-form-modal.schema"

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  display_order?: number | null
  children?: Category[]
}

export interface ProductFormModalProduct {
  id: string
  title: string
  description?: string | null
  price: number
  list_price?: number | null
  cost_price?: number | null
  sku?: string | null
  barcode?: string | null
  stock: number
  track_inventory?: boolean | null
  category_id?: string | null
  status?: string | null
  weight?: number | null
  weight_unit?: string | null
  condition?: string | null
  images?: string[] | null
}

export interface ProductFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: ProductFormModalProduct | null
  categories: Category[]
  onSubmit: (data: ProductFormData) => Promise<void>
}
