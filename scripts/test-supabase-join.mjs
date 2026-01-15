import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load from .env.local first, then .env
config({ path: '.env.local' })
config({ path: '.env' })

const c = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const { data, error } = await c
  .from('products')
  .select(`
    id, 
    title, 
    seller:profiles!seller_id(
      id, 
      username, 
      user_verification(email_verified, phone_verified, id_verified)
    )
  `)
  .limit(5)

if (error) {
  console.error('Error:', error)
  process.exit(1)
}

console.log('Results:')
for (const p of data) {
  console.log(`- ${p.title}: seller=${p.seller?.username}, uv=${JSON.stringify(p.seller?.user_verification)}`)
}
