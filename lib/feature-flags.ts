/**
 * Feature Flags System
 * 
 * Centralized feature flags for gradual rollout of new features.
 * Supports env-based overrides and percentage-based rollouts.
 * 
 * Usage:
 *   import { isFeatureEnabled, getFeatureFlags } from "@/lib/feature-flags"
 *   
 *   if (isFeatureEnabled("drawerSystem")) {
 *     // Use new drawer system
 *   }
 */

import "client-only"

// =============================================================================
// TYPES
// =============================================================================

export type FeatureFlagName =
  | "drawerSystem"           // Mobile drawer UX (product quick view, cart, messages, account)
  | "drawerProductQuickView" // Product quick view drawer specifically
  | "drawerCart"             // Cart drawer
  | "drawerMessages"         // Messages drawer
  | "drawerAccount"          // Account drawer
  | "drawerAuth"             // Auth drawer

export interface FeatureFlag {
  /** Whether the feature is enabled by default */
  enabled: boolean
  /** Percentage of users to enable (0-100). Only applies if enabled=true */
  rolloutPercentage: number
  /** Environment variable override name */
  envOverride?: string
  /** Description of what this flag controls */
  description: string
}

// =============================================================================
// FLAG DEFINITIONS
// =============================================================================

const FEATURE_FLAGS: Record<FeatureFlagName, FeatureFlag> = {
  drawerSystem: {
    enabled: true,
    rolloutPercentage: 100, // Full rollout
    envOverride: "NEXT_PUBLIC_FEATURE_DRAWER_SYSTEM",
    description: "Enable the new mobile drawer UX system (product quick view, cart, messages, account drawers)",
  },
  drawerProductQuickView: {
    enabled: true,
    rolloutPercentage: 100,
    envOverride: "NEXT_PUBLIC_FEATURE_DRAWER_PRODUCT_QUICK_VIEW",
    description: "Enable product quick view drawer on mobile",
  },
  drawerCart: {
    enabled: true,
    rolloutPercentage: 100,
    envOverride: "NEXT_PUBLIC_FEATURE_DRAWER_CART",
    description: "Enable cart drawer on mobile",
  },
  drawerMessages: {
    enabled: true,
    rolloutPercentage: 100,
    envOverride: "NEXT_PUBLIC_FEATURE_DRAWER_MESSAGES",
    description: "Enable messages drawer on mobile",
  },
  drawerAccount: {
    enabled: true,
    rolloutPercentage: 100,
    envOverride: "NEXT_PUBLIC_FEATURE_DRAWER_ACCOUNT",
    description: "Enable account drawer on mobile",
  },
  drawerAuth: {
    enabled: true,
    rolloutPercentage: 100,
    envOverride: "NEXT_PUBLIC_FEATURE_DRAWER_AUTH",
    description: "Enable auth drawer on mobile",
  },
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Next.js only inlines `process.env.NEXT_PUBLIC_*` when accessed statically.
 * Dynamic access like `process.env[flag.envOverride]` will be `undefined` in
 * the browser bundle, causing SSR/client mismatches.
 *
 * Keep a single static map so env overrides work consistently in SSR + client.
 */
const PUBLIC_ENV_OVERRIDES: Record<string, string | undefined> = {
  NEXT_PUBLIC_FEATURE_DRAWER_SYSTEM: process.env.NEXT_PUBLIC_FEATURE_DRAWER_SYSTEM,
  NEXT_PUBLIC_FEATURE_DRAWER_PRODUCT_QUICK_VIEW: process.env.NEXT_PUBLIC_FEATURE_DRAWER_PRODUCT_QUICK_VIEW,
  NEXT_PUBLIC_FEATURE_DRAWER_CART: process.env.NEXT_PUBLIC_FEATURE_DRAWER_CART,
  NEXT_PUBLIC_FEATURE_DRAWER_MESSAGES: process.env.NEXT_PUBLIC_FEATURE_DRAWER_MESSAGES,
  NEXT_PUBLIC_FEATURE_DRAWER_ACCOUNT: process.env.NEXT_PUBLIC_FEATURE_DRAWER_ACCOUNT,
  NEXT_PUBLIC_FEATURE_DRAWER_AUTH: process.env.NEXT_PUBLIC_FEATURE_DRAWER_AUTH,
}

/**
 * Get a stable user identifier for percentage-based rollouts.
 * Uses localStorage in browser, falls back to random for SSR.
 */
function getStableUserId(): string {
  if (typeof window === "undefined") {
    return Math.random().toString(36).substring(2)
  }
  
  const storageKey = "treido_feature_user_id"
  let userId = localStorage.getItem(storageKey)
  
  if (!userId) {
    userId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(storageKey, userId)
  }
  
  return userId
}

/**
 * Hash a string to a number between 0-99 for percentage rollouts.
 * Uses simple djb2 hash for consistency.
 */
function hashToPercentage(str: string, salt: string): number {
  const combined = `${str}:${salt}`
  let hash = 5381
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash) ^ combined.charCodeAt(i)
  }
  return Math.abs(hash) % 100
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Check if a feature flag is enabled.
 * 
 * Priority order:
 * 1. Environment variable override (if set)
 * 2. Percentage-based rollout (if enabled)
 * 3. Default enabled state
 */
export function isFeatureEnabled(flagName: FeatureFlagName): boolean {
  const flag = FEATURE_FLAGS[flagName]
  
  if (!flag) {
    console.warn(`[FeatureFlags] Unknown flag: ${flagName}`)
    return false
  }

  const isServer = typeof window === "undefined"
  
  // Check env override first
  if (flag.envOverride) {
    const envValue = PUBLIC_ENV_OVERRIDES[flag.envOverride]
    if (envValue !== undefined) {
      return envValue === "true" || envValue === "1"
    }
  }
  
  // If not enabled by default, return false
  if (!flag.enabled) {
    return false
  }
  
  // Check percentage rollout
  if (flag.rolloutPercentage < 100) {
    // Avoid SSR/client mismatches: only apply percentage logic on the client.
    if (isServer) return false
    const userId = getStableUserId()
    const userPercentile = hashToPercentage(userId, flagName)
    return userPercentile < flag.rolloutPercentage
  }
  
  // Fully enabled
  return true
}

/**
 * Check if any drawer feature is enabled.
 * Shorthand for checking if drawer system should be initialized.
 */
export function isDrawerSystemEnabled(): boolean {
  return isFeatureEnabled("drawerSystem")
}

/**
 * Check which specific drawers are enabled.
 */
export function getEnabledDrawers() {
  return {
    productQuickView: isFeatureEnabled("drawerProductQuickView"),
    cart: isFeatureEnabled("drawerCart"),
    messages: isFeatureEnabled("drawerMessages"),
    account: isFeatureEnabled("drawerAccount"),
    auth: isFeatureEnabled("drawerAuth"),
  }
}
