/**
 * Sales types - extracted to prevent circular dependencies
 */

export interface SaleItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  created_at: string
  status: string
  product: {
    id: string
    title: string
    images: string[]
    price: number
    slug?: string | null
    username?: string | null
  } | null
  order: {
    id: string
    status: string
    created_at: string
    shipping_address: {
      city?: string
      country?: string
    } | null
    buyer: {
      email: string
      full_name: string | null
    } | null
  } | null
}
