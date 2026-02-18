export interface CartItem {
  id: string
  /** Optional product variant id (for listings with variants). */
  variantId?: string
  /** Optional variant display name for UX (cart rendering). */
  variantName?: string
  title: string
  price: number
  image: string
  quantity: number
  slug?: string
  /** Seller username for SEO-friendly URLs */
  username?: string
  /** @deprecated Use 'username' instead */
  storeSlug?: string | null
}
