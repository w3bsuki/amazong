export const PRODUCT_PAGE_CORE_SELECT =
  "id,title,slug,price,list_price,description,condition,images,attributes,meta_description,rating,review_count,stock,pickup_only,free_shipping,seller_city,seller_id,category_id,view_count,created_at" as const

export const PRODUCT_SELLER_IDENTITY_SELECT =
  "id,username,display_name,avatar_url,verified,is_seller,created_at" as const

export const PRODUCT_CATEGORY_SUMMARY_SELECT =
  "id,name,name_bg,slug,parent_id,icon" as const

export const PRODUCT_IMAGES_SELECT =
  "id,image_url,display_order,is_primary" as const

export const PRODUCT_VARIANTS_SELECT =
  "id,name,sku,stock,price_adjustment,is_default,sort_order" as const

export const PRODUCT_PAGE_SELECT = `
  id, title, slug, price, list_price, description, condition, images, attributes, meta_description, rating, review_count, stock, pickup_only, free_shipping, seller_city, seller_id, category_id, view_count, created_at,
  seller:profiles!products_seller_id_fkey (
    id,username,display_name,avatar_url,verified,is_seller,created_at
  ),
  category:categories (
    id,name,name_bg,slug,parent_id,icon
  ),
  product_images (
    id,image_url,display_order,is_primary
  ),
  product_variants (
    id,name,sku,stock,price_adjustment,is_default,sort_order
  )
` as const

/**
 * API list views — fields needed by `normalizeProductRow` + `toUI`.
 * Keep these centralized to avoid drift between `/api/products/*` endpoints.
 */
export const PRODUCT_API_NEWEST_SELECT = `
  id,
  title,
  price,
  list_price,
  rating,
  review_count,
  images,
  free_shipping,
  seller_city,
  category_ancestors,
  is_boosted,
  boost_expires_at,
  created_at,
  slug,
  seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),
  categories(id,slug,name,name_bg,icon)
` as const

export const PRODUCT_API_FEED_SELECT = `
  id,
  title,
  price,
  list_price,
  is_on_sale,
  sale_percent,
  sale_end_date,
  rating,
  review_count,
  images,
  is_boosted,
  boost_expires_at,
  created_at,
  free_shipping,
  seller_city,
  slug,
  attributes,
  seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),
  categories!inner(
    id,slug,name,name_bg,icon,
    parent:categories!parent_id(
      id,slug,name,name_bg,icon,
      parent:categories!parent_id(id,slug,name,name_bg,icon)
    )
  )
` as const

export const DEAL_PRODUCTS_API_FEED_SELECT = `
  id,
  title,
  price,
  list_price,
  is_on_sale,
  sale_percent,
  sale_end_date,
  effective_discount,
  rating,
  review_count,
  images,
  is_boosted,
  boost_expires_at,
  created_at,
  free_shipping,
  seller_city,
  slug,
  attributes,
  seller:profiles(id,username,display_name,business_name,avatar_url,tier,account_type,is_verified_business),
  categories!inner(
    id,slug,name,name_bg,icon,
    parent:categories!parent_id(
      id,slug,name,name_bg,icon,
      parent:categories!parent_id(id,slug,name,name_bg,icon)
    )
  )
` as const

export const PRODUCT_API_QUICK_SEARCH_SELECT = `
  id,
  title,
  price,
  images,
  slug,
  seller:profiles(username)
` as const
