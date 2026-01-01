/**
 * Type-safe environment variable access
 *
 * This module provides runtime-validated environment variables with proper TypeScript types.
 * Never use process.env.X! directly - use these helpers instead.
 */

// =============================================================================
// Validation helpers
// =============================================================================

function getRequiredEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please ensure it is configured in your .env file or deployment environment.`
    )
  }
  return value
}

function getOptionalEnvVar(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

// =============================================================================
// Supabase Configuration
// =============================================================================

export function getSupabaseUrl(): string {
  return getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL')
}

export function getSupabaseAnonKey(): string {
  return getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

function getSupabaseServiceRoleKey(): string {
  return getRequiredEnvVar('SUPABASE_SERVICE_ROLE_KEY')
}

// =============================================================================
// Stripe Configuration
// =============================================================================

export function getStripeSecretKey(): string {
  return getRequiredEnvVar('STRIPE_SECRET_KEY')
}

export function getStripeWebhookSecret(): string {
  return getRequiredEnvVar('STRIPE_WEBHOOK_SECRET')
}

export function getStripeSubscriptionWebhookSecret(): string {
  return getRequiredEnvVar('STRIPE_SUBSCRIPTION_WEBHOOK_SECRET')
}

export function getStripePublishableKey(): string {
  return getRequiredEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
}

// =============================================================================
// Application Configuration
// =============================================================================

function getAppUrl(): string {
  return getRequiredEnvVar('NEXT_PUBLIC_APP_URL')
}

function getAuthCookieDomain(): string | undefined {
  return process.env.AUTH_COOKIE_DOMAIN
}

function getSupabaseFetchTimeout(): number {
  const value = process.env.SUPABASE_FETCH_TIMEOUT_MS
  if (!value) return 8000
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 8000
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

// =============================================================================
// Validated env object (for cases where you need multiple values)
// =============================================================================

/**
 * Get validated Supabase configuration.
 * Throws at startup if required vars are missing.
 */
function getSupabaseConfig() {
  return {
    url: getSupabaseUrl(),
    anonKey: getSupabaseAnonKey(),
  } as const
}

/**
 * Get validated Stripe configuration.
 * Throws at startup if required vars are missing.
 */
function getStripeConfig() {
  return {
    secretKey: getStripeSecretKey(),
    publishableKey: getStripePublishableKey(),
    webhookSecret: getStripeWebhookSecret(),
    subscriptionWebhookSecret: getStripeSubscriptionWebhookSecret(),
  } as const
}
