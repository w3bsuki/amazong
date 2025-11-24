
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables.');
  process.exit(1);
}

console.log(`Testing connection to Supabase project: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);

    if (error) {
      console.error('Supabase connection failed:', error.message);
    } else {
      console.log('Supabase connection successful!');
      console.log('Query result:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
