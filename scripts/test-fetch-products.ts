
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing env vars")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function main() {
  console.log("Fetching products...")
  const { data, error } = await supabase
    .from('products')
    .select(`
        id, 
        title, 
        price, 
        list_price, 
        rating, 
        review_count, 
        images, 
        product_images(image_url,thumbnail_url,display_order,is_primary),
        product_attributes(name,value),
        is_prime, 
        is_boosted,
        boost_expires_at,
        created_at, 
        slug,
        attributes,
        seller:profiles(username),
        categories!inner(slug)
      `)
    .limit(5)

  if (error) {
    console.error("Error fetching products:", error)
  } else {
    console.log(`Found ${data.length} products`)
    console.log(JSON.stringify(data, null, 2))
  }
}

main()
