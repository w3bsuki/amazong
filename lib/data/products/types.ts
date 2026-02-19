import type { UIProduct } from "@/lib/types/products"

export type { UIProduct }

// =============================================================================
// Types - Minimal, practical types
// =============================================================================

export interface Product {
  id: string
  title: string
  price: number
  seller_id?: string | null
  list_price?: number | null
  is_on_sale?: boolean | null
  sale_percent?: number | null
  sale_end_date?: string | null
  rating?: number | null
  review_count?: number | null
  images: string[] | null
  product_images?: Array<{
    image_url: string
    thumbnail_url?: string | null
    display_order?: number | null
    is_primary?: boolean | null
  }> | null
  /** True if product has a boost flag; check `boost_expires_at` for active boost status. */
  is_boosted?: boolean | null
  /** Boost expiration timestamp - used with is_boosted to determine active boost status */
  boost_expires_at?: string | null
  /** @deprecated Legacy field - not used. For promoted listings, use is_boosted + boost_expires_at */
  is_featured?: boolean | null
  created_at?: string | null
  ships_to_bulgaria?: boolean | null
  ships_to_uk?: boolean | null
  ships_to_europe?: boolean | null
  ships_to_usa?: boolean | null
  ships_to_worldwide?: boolean | null
  pickup_only?: boolean | null
  free_shipping?: boolean | null
  seller_city?: string | null
  category_slug?: string | null
  slug?: string | null
  store_slug?: string | null
  /**
   * Embedded leaf category with parent chain (up to 4 levels).
   * Supabase nested selects return parents as arrays, but the normalizeCategoryNode
   * function handles both single objects and arrays, so we accept unknown here.
   */
  categories?: {
    id?: string
    slug?: string
    name?: string
    name_bg?: string | null
    icon?: string | null
    parent?: unknown // Supabase returns array[], normalizeCategoryNode handles both
  } | null
  seller_profile?: {
    id?: string | null
    username?: string | null
    display_name?: string | null
    business_name?: string | null
    avatar_url?: string | null
    tier?: string | null
    account_type?: string | null
    is_verified_business?: boolean | null
    // Verification fields from user_verification join
    email_verified?: boolean | null
    phone_verified?: boolean | null
    id_verified?: boolean | null
  } | null
  /** Product attributes - Json from DB, we accept any */
  attributes?: import("@/lib/supabase/database.types").Json | null
  product_attributes?: Array<{
    name: string
    value: string
  }> | null
}

export type ShippingZone = "BG" | "UK" | "EU" | "US" | "WW"
