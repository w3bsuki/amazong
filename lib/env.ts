/**
 * Type-safe environment variable access
 *
 * This module provides runtime-validated environment variables with proper TypeScript types.
 * Never use process.env.X! directly - use these helpers instead.
 */

import "server-only"

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

export function parseWebhookSecrets(raw: string): string[] {
  return raw
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean)
}

// =============================================================================
// Stripe Configuration
// =============================================================================

export function getStripeSecretKey(): string {
  return getRequiredEnvVar('STRIPE_SECRET_KEY')
}

export function getStripeWebhookSecrets(): string[] {
  const raw = getRequiredEnvVar('STRIPE_WEBHOOK_SECRET')
  return parseWebhookSecrets(raw)
}

export function getStripeSubscriptionWebhookSecrets(): string[] {
  const raw = getRequiredEnvVar('STRIPE_SUBSCRIPTION_WEBHOOK_SECRET')
  return parseWebhookSecrets(raw)
}

export function getStripeConnectWebhookSecrets(): string[] {
  const raw = getRequiredEnvVar('STRIPE_CONNECT_WEBHOOK_SECRET')
  return parseWebhookSecrets(raw)
}
