
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars from .env.local if available
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.log('Could not load .env.local', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);

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
];

async function seed() {
    console.log('Seeding categories...');

    // Upsert categories
    const { data, error } = await supabase
        .from('categories')
        .upsert(categories, { onConflict: 'name', ignoreDuplicates: true })
        .select();

    if (error) {
        console.error('Error seeding categories:', error);
    } else {
        console.log('Categories seeded successfully:', data?.length || 0, 'rows');
    }
}

seed();
