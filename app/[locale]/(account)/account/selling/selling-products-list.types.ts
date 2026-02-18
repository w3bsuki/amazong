export type SellingProductsListServerActions = {
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>
  bulkUpdateProductStatus: (
    productIds: string[],
    status: "active" | "draft" | "archived" | "out_of_stock"
  ) => Promise<{ success: boolean; error?: string }>
  setProductDiscountPrice: (
    productId: string,
    newPrice: number
  ) => Promise<{ success: boolean; error?: string }>
  clearProductDiscount: (productId: string) => Promise<{ success: boolean; error?: string }>
}

export interface SellingProduct {
  id: string
  slug: string
  title: string
  description: string | null
  price: number
  list_price: number | null
  is_on_sale: boolean | null
  sale_percent: number | null
  sale_end_date: string | null
  stock: number
  images: string[]
  rating: number | null
  review_count: number | null
  created_at: string
  is_boosted: boolean
  boost_expires_at: string | null
  status?: "active" | "draft" | "archived" | "out_of_stock"
  category?: {
    name: string
    slug: string
  } | null
}

export interface SellingProductsListProps {
  products: SellingProduct[]
  sellerUsername: string
  locale: string
  actions: SellingProductsListServerActions
}

export interface BoostTimeLeft {
  days: number
  hours: number
}

export type TranslateFn = (key: string, values?: Record<string, string | number>) => string
