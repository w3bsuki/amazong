export const PRODUCT_LIST_SELECT =
  `id, title, price, seller_id, list_price, is_on_sale, sale_percent, sale_end_date, rating, review_count, images, is_boosted, boost_expires_at, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, free_shipping, category_id, slug,
   seller:profiles!seller_id(id,username,avatar_url,tier,account_type,is_verified_business,user_verification(email_verified,phone_verified,id_verified)),
   categories(id,slug,name,name_bg,icon)` as const

export const PRODUCT_LIST_BY_CATEGORY_SLUG_SELECT =
  `id, title, price, seller_id, list_price, is_on_sale, sale_percent, sale_end_date, rating, review_count, images, is_boosted, boost_expires_at, created_at, ships_to_bulgaria, ships_to_uk, ships_to_europe, ships_to_usa, ships_to_worldwide, pickup_only, free_shipping, category_id, slug,
   seller:profiles!seller_id(id,username,avatar_url,tier,account_type,is_verified_business,user_verification(email_verified,phone_verified,id_verified)),
   categories!inner(id,slug,name,name_bg,icon)` as const

export const PRODUCT_BY_ID_SELECT =
  "id,title,price,seller_id,category_id,slug,description,condition,brand_id,images,is_boosted,boost_expires_at,is_on_sale,list_price,sale_percent,sale_end_date,rating,review_count,pickup_only,ships_to_bulgaria,ships_to_uk,ships_to_europe,ships_to_usa,ships_to_worldwide,free_shipping,created_at,updated_at,status,stock,tags,seller_city,listing_type,meta_title,meta_description,track_inventory,weight,weight_unit,attributes" as const

