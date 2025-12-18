/**
 * Types Barrel Export
 * Central export for all TypeScript types
 * 
 * This is the canonical location for importing types.
 * Use: import type { Database, DisplayBadge } from "@/types"
 */

// Database types (Supabase generated - source in lib/supabase/database.types.ts)
// Duplicated here for consolidated access; regenerate with `supabase gen types`
export * from './database.types'

// Badge & verification system types
export * from './badges'
