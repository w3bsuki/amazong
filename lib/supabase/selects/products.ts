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
