
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyProduct() {
    console.log('Verifying product creation...');

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('title', '%API Product 999%');

    if (error) {
        console.error('Error fetching products:', error);
    } else {
        console.log('Products found:', data);
    }

    console.log('Checking seller...');
    const { data: seller, error: sellerError } = await supabase
        .from('sellers')
        .select('*')
        .ilike('store_name', '%Seller 6777%');

    if (sellerError) {
        console.error('Error fetching seller:', sellerError);
    } else {
        console.log('Seller found:', seller);
    }

    console.log('Checking categories...');
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*');

    if (catError) {
        console.error('Error fetching categories:', catError);
    } else {
        console.log('Categories count:', categories.length);
        if (categories.length > 0) {
            console.log('First category:', categories[0]);

            // Try inserting a product
            console.log('Attempting to insert product via script...');
            const { data: newProduct, error: insertError } = await supabase
                .from('products')
                .insert({
                    seller_id: seller[0].id,
                    title: 'Script Test Product',
                    description: 'Created via script',
                    price: 99.99,
                    category_id: categories[0].id,
                    images: ['https://placehold.co/600x400']
                    // subcategory removed
                })
                .select();

            if (insertError) {
                console.error('Error inserting product:', insertError);
            } else {
                console.log('Product inserted successfully:', newProduct);
            }
        }
    }
}

verifyProduct();
