import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

function loadEnvFiles() {
  const cwd = process.cwd()
  const candidates = ['.env.local', '.env']
  for (const file of candidates) {
    const fullPath = path.join(cwd, file)
    if (!fs.existsSync(fullPath)) continue
    dotenv.config({ path: fullPath, override: false })
  }
}

function env(name) {
  const value = process.env[name]
  return value && value.trim().length > 0 ? value.trim() : undefined
}

function getArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

function requireEnv(name) {
  const value = env(name)
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

async function main() {
  loadEnvFiles()

  const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  const email =
    getArg('--email') ||
    env('TEST_USER_EMAIL') ||
    env('E2E_USER_EMAIL') ||
    // Use a fresh unique user by default. This avoids relying on admin user
    // listing APIs (which may be disabled or temporarily failing).
    `e2e_${Date.now()}_${Math.random().toString(16).slice(2)}@example.test`

  const password =
    getArg('--password') ||
    env('TEST_USER_PASSWORD') ||
    env('E2E_USER_PASSWORD') ||
    'E2ETestPassword123!'

  const makeSeller = (getArg('--seller') ?? 'true') !== 'false'

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'E2E Test User' },
  })

  if (error) {
    // If the caller supplied --email and it already exists, ask them to
    // rerun without --email (default unique) or choose a new one.
    const msg = error?.message || ''
    if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
      throw new Error(
        `Auth user already exists for ${email}. Rerun without --email to generate a unique user (recommended for E2E).`
      )
    }
    throw error
  }

  const user = data.user

  if (!user) throw new Error('Failed to create user')

  if (makeSeller) {
    const { error: profileError } = await admin
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email,
          role: 'seller',
          is_seller: true,
          onboarding_completed: true,
        },
        { onConflict: 'id' }
      )

    if (profileError) throw profileError
  }

  // Verify auth works using anon key (what the app uses for normal sign-in).
  const anon = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const { data: signInData, error: signInError } = await anon.auth.signInWithPassword({ email, password })
  if (signInError) throw signInError

  const accessToken = signInData.session?.access_token
  if (!accessToken) throw new Error('Sign-in succeeded but access token missing')

  const authed = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })

  // Lightweight sanity check: can the user read their own profile row?
  const { data: profile, error: profileReadError } = await authed
    .from('profiles')
    .select('id, role, is_seller, onboarding_completed')
    .eq('id', user.id)
    .maybeSingle()

  if (profileReadError) throw profileReadError

  console.log('[e2e-user] OK')
  console.log(`[e2e-user] email: ${email}`)
  console.log(`[e2e-user] password: ${password}`)
  console.log(`[e2e-user] profile: ${profile ? JSON.stringify(profile) : 'not found (check trigger/RLS)'}`)
  console.log('')
  console.log('To run authenticated Playwright tests:')
  console.log(`  cross-env TEST_USER_EMAIL="${email}" TEST_USER_PASSWORD="${password}" pnpm test:e2e`)
}

main().catch((err) => {
  console.error('[e2e-user] FAILED')
  console.error(err?.message || err)
  process.exit(1)
})
