import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const categories = [
  { title: "Gaming Accessories", image: "/gaming-setup.png", link: "/search?q=gaming" },
  { title: "Computers & Tablets", image: "/modern-computer-setup.png", link: "/search?q=computer" },
  { title: "Electronics", image: "/electronics-components.png", link: "/search?q=electronics" },
  { title: "Home & Kitchen", image: "/modern-minimalist-kitchen.png", link: "/search?q=home" },
]

const products = [
  {
    title: "Wireless Noise Cancelling Headphones",
    price: 299.99,
    image: "/diverse-people-listening-headphones.jpg",
    rating: 4.5,
    reviews_count: 120,
    is_prime: true
  },
  { title: "Smartphone 5G 128GB Unlocked", price: 699.0, image: "/modern-smartphone.jpg", rating: 4.8, reviews_count: 85, is_prime: true },
  { title: "4K Ultra HD Smart TV 55 Inch", price: 449.99, image: "/retro-living-room-tv.jpg", rating: 4.2, reviews_count: 200, is_prime: false },
  { title: "Professional DSLR Camera Kit", price: 1299.0, image: "/vintage-camera-still-life.jpg", rating: 4.9, reviews_count: 45, is_prime: true },
]

const deals = [
  { title: "Smart Home Speaker", price: 29.99, list_price: 49.99, image: "/smart-speaker.jpg" },
  {
    title: "Ergonomic Office Chair",
    price: 149.99,
    list_price: 199.99,
    image: "/office-chair.jpg",
  },
  { title: "Fitness Tracker Watch", price: 79.99, list_price: 129.99, image: "/fitness-watch.jpg" },
  {
    title: "Bluetooth Portable Speaker",
    price: 39.99,
    list_price: 59.99,
    image: "/portable-speaker.png",
  },
]

async function seed() {
  console.log('Seeding categories...')
  const { error: catError } = await supabase.from('categories').insert(categories)
  if (catError) console.error('Error seeding categories:', catError)
  else console.log('Categories seeded.')

  console.log('Seeding products...')
  const { error: prodError } = await supabase.from('products').insert(products)
  if (prodError) console.error('Error seeding products:', prodError)
  else console.log('Products seeded.')

  console.log('Seeding deals...')
  const { error: dealsError } = await supabase.from('deals').insert(deals)
  if (dealsError) console.error('Error seeding deals:', dealsError)
  else console.log('Deals seeded.')
}

seed()
