import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

function loadEnvFiles() {
  const cwd = process.cwd()
  for (const file of ['.env.local', '.env']) {
    const fullPath = path.join(cwd, file)
    if (!fs.existsSync(fullPath)) continue
    dotenv.config({ path: fullPath, override: false })
  }
}

function env(name) {
  const value = process.env[name]
  return value && value.trim().length > 0 ? value.trim() : undefined
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
  const email = requireEnv('TEST_USER_EMAIL')
  const password = requireEnv('TEST_USER_PASSWORD')

  const anon = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const { data, error } = await anon.auth.signInWithPassword({ email, password })
  if (error) throw error

  if (!data.session?.access_token) throw new Error('Sign-in succeeded but no access token returned')

  console.log('[verify-e2e-login] OK')
  console.log(`[verify-e2e-login] email: ${email}`)
  console.log(`[verify-e2e-login] user: ${data.user?.id ?? 'unknown'}`)
}

main().catch((err) => {
  console.error('[verify-e2e-login] FAILED')
  console.error(err?.message || err)
  process.exit(1)
})
