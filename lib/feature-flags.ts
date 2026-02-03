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

// =============================================================================
// TYPES
// =============================================================================

export type FeatureFlagName =
  | "drawerSystem"           // Mobile drawer UX (product quick view, cart, messages, account)
  | "drawerProductQuickView" // Product quick view drawer specifically
  | "drawerCart"             // Cart drawer
  | "drawerMessages"         // Messages drawer
  | "drawerAccount"          // Account drawer
  | "routeModalProductQuickView" // Product quick view via intercepting route modal (search/categories)

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
  routeModalProductQuickView: {
    enabled: true,
    rolloutPercentage: 100,
    envOverride: "NEXT_PUBLIC_FEATURE_ROUTE_MODAL_PRODUCT_QUICK_VIEW",
    description: "Enable product quick view modal via Next.js intercepting routes from search/categories",
  },
}

// =============================================================================
// HELPERS
// =============================================================================

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
  
  // Check env override first
  if (flag.envOverride) {
    const envValue = process.env[flag.envOverride]
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
  }
}
