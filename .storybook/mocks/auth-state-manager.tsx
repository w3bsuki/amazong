"use client"

import * as React from "react"
import type { Session, User } from "@supabase/supabase-js"

export type AuthState = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

export type AuthContextType = AuthState & {
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const defaultAuth: AuthContextType = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  signOut: async () => {},
  refreshSession: async () => {},
}

export function AuthStateManager({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useAuth(): AuthContextType {
  return defaultAuth
}

export function useAuthOptional(): AuthContextType | null {
  return defaultAuth
}

