
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUser() {
    console.log('Creating confirmed user...');

    const randomId = Math.floor(Math.random() * 10000);
    const email = `seller_confirmed_${randomId}@example.com`;
    console.log(`Creating user with email: ${email}`);

    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: 'Seller Test' }
    });

    if (error) {
        console.error('Error creating user:', error);
    } else {
        console.log('User created successfully:', data.user.email);
    }
}

createUser();
