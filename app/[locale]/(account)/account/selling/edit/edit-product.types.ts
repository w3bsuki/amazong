export interface EditableProduct {
  id: string
  title: string
  slug?: string | null
  description: string | null
  price: number
  list_price: number | null
  is_on_sale?: boolean | null
  sale_percent?: number | null
  sale_end_date?: string | null
  seller_city?: string | null
  stock: number
  images: string[] | null
  is_boosted: boolean | null
  boost_expires_at: string | null
  is_featured: boolean | null
  ships_to_bulgaria: boolean | null
  ships_to_europe: boolean | null
  ships_to_usa: boolean | null
  ships_to_worldwide: boolean | null
  [key: string]: unknown
}

export interface EditProductClientProps {
  productId: string
  locale: string
}
