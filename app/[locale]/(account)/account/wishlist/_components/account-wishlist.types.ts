export interface WishlistItem {
  id: string
  product_id: string
  title: string
  price: number
  image: string
  stock: number
  created_at: string
  category_id?: string | null
  category_name?: string | null
  category_slug?: string | null
  slug?: string | null
  username?: string | null
}

export interface AccountWishlistGridProps {
  items: WishlistItem[]
  locale: string
  onRemove: (productId: string) => void
}
