/**
 * Analytics tracking for drawer interactions.
 * 
 * Tracks drawer opens, closes, CTA clicks, and performance metrics.
 * Integrates with GA4/PostHog in production via window.gtag or posthog.
 * 
 * Metrics tracked:
 * - drawer_open: When a drawer is opened
 * - drawer_close: When a drawer is closed (with method: swipe/backdrop/button/escape)
 * - drawer_cta_click: When a user clicks a CTA in a drawer
 * - drawer_conversion: When a drawer leads to a conversion action
 * - drawer_view_time: Time spent viewing a drawer
 */

import "client-only"

import { logger } from "@/lib/logger"

export type DrawerType =
  | "product_quick_view"
  | "cart"
  | "messages"
  | "wishlist"
  | "account"
  | "auth"
export type DrawerCloseMethod = "swipe" | "backdrop" | "button" | "escape"

interface DrawerOpenEvent {
  type: DrawerType
  productId?: string
  metadata?: Record<string, unknown>
}

interface DrawerCloseEvent {
  type: DrawerType
  method: DrawerCloseMethod
  duration_ms?: number
  metadata?: Record<string, unknown>
}

// =============================================================================
// SESSION TRACKING
// =============================================================================

/** Track drawer open times for duration calculation */
const drawerOpenTimes = new Map<DrawerType, number>()

/** Track drawer views per session for funnel analysis */
const sessionDrawerViews: Record<DrawerType, number> = {
  product_quick_view: 0,
  cart: 0,
  messages: 0,
  wishlist: 0,
  account: 0,
  auth: 0,
}

// =============================================================================
// ANALYTICS DISPATCH
// =============================================================================

const isDev = process.env.NODE_ENV === "development"
const isProd = process.env.NODE_ENV === "production"

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void }
  }
}

function sendAnalytics(eventName: string, data: Record<string, unknown>) {
  // Always log in development
  if (isDev) {
    logger.debug(`[Analytics] ${eventName}`, data)
  }
  
  // Send to GA4 in production
  if (isProd && typeof window !== "undefined") {
    window.gtag?.("event", eventName, {
      ...data,
      event_category: "drawer_system",
    })
    
    // Send to PostHog if available
    window.posthog?.capture(eventName, {
      ...data,
      $set: {
        last_drawer_interaction: new Date().toISOString(),
      },
    })
  }
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Track drawer open event
 */
export function trackDrawerOpen(event: DrawerOpenEvent) {
  // Track open time for duration calculation
  drawerOpenTimes.set(event.type, Date.now())
  
  // Increment session view count
  sessionDrawerViews[event.type]++
  
  sendAnalytics("drawer_open", {
    drawer_type: event.type,
    product_id: event.productId,
    session_view_count: sessionDrawerViews[event.type],
    ...event.metadata,
  })
}

/**
 * Track drawer close event
 */
export function trackDrawerClose(event: DrawerCloseEvent) {
  // Calculate duration if we have an open time
  let duration_ms = event.duration_ms
  const openTime = drawerOpenTimes.get(event.type)
  if (openTime && !duration_ms) {
    duration_ms = Date.now() - openTime
    drawerOpenTimes.delete(event.type)
  }
  
  sendAnalytics("drawer_close", {
    drawer_type: event.type,
    close_method: event.method,
    duration_ms,
    // Performance buckets for easy analysis
    duration_bucket: getDurationBucket(duration_ms),
    ...event.metadata,
  })
}

// =============================================================================
// HELPERS
// =============================================================================

function getDurationBucket(ms?: number): string {
  if (!ms) return "unknown"
  if (ms < 1000) return "quick_glance" // <1s
  if (ms < 5000) return "brief_view"   // 1-5s
  if (ms < 15000) return "engaged"     // 5-15s
  if (ms < 30000) return "interested"  // 15-30s
  return "deep_engagement"              // >30s
}
