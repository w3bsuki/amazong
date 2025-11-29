import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
    console.log('Starting seed...')

    // 1. Categories
    const categories = [
        { name: 'Electronics', slug: 'electronics', image_url: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=500&q=80' },
        { name: 'Computers', slug: 'computers', image_url: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&q=80' },
        { name: 'Smart Home', slug: 'smart-home', image_url: 'https://images.unsplash.com/photo-1558002038-1091a166111c?w=500&q=80' },
        { name: 'Home & Kitchen', slug: 'home', image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80' },
        { name: 'Fashion', slug: 'fashion', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
        { name: 'Beauty', slug: 'beauty', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=500&q=80' },
        { name: 'Toys & Games', slug: 'toys', image_url: 'https://images.unsplash.com/photo-1566576912902-48f5d9307bb1?w=500&q=80' },
        { name: 'Sports & Outdoors', slug: 'sports', image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80' },
        { name: 'Automotive', slug: 'automotive', image_url: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=500&q=80' },
        { name: 'Books', slug: 'books', image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80' },
        { name: 'Gaming', slug: 'gaming', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80' }
    ]

    console.log('Seeding categories...')
    for (const cat of categories) {
        const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'name' })
        if (error) console.error(`Error inserting category ${cat.name}:`, error.message)
    }

    // 2. Sellers (Create a dummy seller if not exists)
    // We need a user ID. In a real script we might create a user via auth.admin.createUser
    // But for simplicity, let's check if we can insert into 'sellers' directly if we have an ID.
    // The seed.sql used a fixed UUID. Let's try to use that.
    const sellerId = '00000000-0000-0000-0000-000000000000'

    // We need to ensure the profile exists first.
    // Note: auth.users is not accessible via public API usually, but service role might allow it?
    // Actually, inserting into auth.users via client is not possible directly.
    // We should use auth.admin.createUser

    console.log('Seeding seller user...')
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: 'seller@example.com',
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: 'Test Seller' }
    })

    let finalSellerId = sellerId
    if (userError) {
        console.log('User creation error (might already exist):', userError.message)
        // Try to find the user?
        // If we can't find it, we might have trouble.
        // But let's assume if it exists, we can proceed if we knew the ID.
        // If we can't get the ID, we can't link products.
        // Let's try to fetch the user by email?
        // listUsers is available on admin.
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users.users.find(u => u.email === 'seller@example.com')
        if (existingUser) {
            finalSellerId = existingUser.id
            console.log('Found existing seller ID:', finalSellerId)
        } else {
            console.error('Could not create or find seller user.')
        }
    } else if (userData.user) {
        finalSellerId = userData.user.id
        console.log('Created new seller user:', finalSellerId)
    }

    // Create Profile (if not created by trigger)
    // Check if profile exists
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', finalSellerId).single()
    if (!profile) {
        console.log('Creating profile...')
        await supabase.from('profiles').insert({
            id: finalSellerId,
            email: 'seller@example.com',
            full_name: 'Test Seller',
            role: 'seller',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        })
    }

    // Create Seller record
    console.log('Creating seller record...')
    await supabase.from('sellers').upsert({
        id: finalSellerId,
        store_name: 'Tech Haven',
        description: 'Your one-stop shop for the latest gadgets and electronics.',
        verified: true
    }, { onConflict: 'id' })

    // 3. Products
    console.log('Seeding products...')

    // Helper to get category ID
    const getCatId = async (slug: string) => {
        const { data } = await supabase.from('categories').select('id').eq('slug', slug).single()
        return data?.id
    }

    const products = [
        {
            category_slug: 'electronics',
            title: 'Wireless Noise Cancelling Headphones',
            description: 'Experience premium sound quality with these wireless noise-cancelling headphones. Perfect for travel, work, or relaxing at home.',
            price: 299.99,
            list_price: 349.99,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
            rating: 4.5,
            review_count: 120,
            is_prime: true
        },
        {
            category_slug: 'computers',
            title: 'Ultra-Slim Laptop 15"',
            description: 'Powerful performance in a sleek, lightweight design. Features a high-resolution display and long battery life.',
            price: 1299.00,
            list_price: 1499.00,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
            rating: 4.8,
            review_count: 85,
            is_prime: true
        },
        {
            category_slug: 'smart-home',
            title: 'Smart Voice Assistant Speaker',
            description: 'Control your smart home devices, play music, and get answers with this compact voice assistant speaker.',
            price: 49.99,
            list_price: null,
            stock: 100,
            images: ['https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80'],
            rating: 4.2,
            review_count: 200,
            is_prime: false
        },
        {
            category_slug: 'gaming',
            title: 'Next-Gen Gaming Console',
            description: 'Immerse yourself in 4K gaming with the latest console. Includes one controller and a game bundle.',
            price: 499.00,
            list_price: null,
            stock: 10,
            images: ['https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&q=80'],
            rating: 4.9,
            review_count: 500,
            is_prime: true
        },
        {
            category_slug: 'fashion',
            title: 'Classic Leather Jacket',
            description: 'Timeless style with this genuine leather jacket. Durable, comfortable, and perfect for any occasion.',
            price: 199.50,
            list_price: 250.00,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80'],
            rating: 4.6,
            review_count: 45,
            is_prime: false
        }
    ]

    for (const p of products) {
        const catId = await getCatId(p.category_slug)
        if (!catId) {
            console.error(`Category not found: ${p.category_slug}`)
            continue
        }

        // Check if product exists (by title for simplicity)
        const { data: existing } = await supabase.from('products').select('id').eq('title', p.title).single()

        if (!existing) {
            const { error } = await supabase.from('products').insert({
                seller_id: finalSellerId,
                category_id: catId,
                title: p.title,
                description: p.description,
                price: p.price,
                list_price: p.list_price,
                stock: p.stock,
                images: p.images,
                rating: p.rating,
                review_count: p.review_count,
                is_prime: p.is_prime
            })
            if (error) console.error(`Error inserting product ${p.title}:`, error.message)
            else console.log(`Inserted product: ${p.title}`)
        } else {
            console.log(`Product already exists: ${p.title}`)
        }
    }

    console.log('Seed completed.')
}

seed().catch(console.error)
