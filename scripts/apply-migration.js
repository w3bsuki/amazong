
const { Client } = require('pg');
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

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

if (!connectionString) {
    console.error('Missing POSTGRES_URL or DATABASE_URL');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function applyMigration() {
    try {
        await client.connect();
        
        // Get migration file from command line arg or default
        const migrationFile = process.argv[2] || 'supabase/migrations/20251124_audit_and_secure.sql';
        const migrationPath = path.isAbsolute(migrationFile) 
            ? migrationFile 
            : path.join(process.cwd(), migrationFile);

        if (!fs.existsSync(migrationPath)) {
            console.error(`Migration file not found: ${migrationPath}`);
            process.exit(1);
        }

        const sql = fs.readFileSync(migrationPath, 'utf8');
        console.log(`Applying migration from ${migrationPath}...`);
        await client.query(sql);
        console.log('Migration applied successfully.');
    } catch (err) {
        console.error('Error applying migration:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
