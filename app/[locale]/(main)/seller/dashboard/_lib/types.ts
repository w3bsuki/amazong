export interface Seller {
  id: string
  store_name: string
  username?: string | null
  description?: string | null
  verified?: boolean | null
  created_at?: string
  [key: string]: unknown
}

export interface Product {
  id: string
  title: string
  price: number
  stock: number
  images: string[]
  slug?: string | null
  created_at: string
  category?: { name: string } | null
}
