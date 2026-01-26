"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthStateManager({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const isInitializedRef = useRef(false)
  const pendingRefreshRef = useRef<Promise<void> | null>(null)

  const refreshSession = useCallback(async () => {
    // Prevent concurrent refreshes
    if (pendingRefreshRef.current) {
      return pendingRefreshRef.current
    }

    pendingRefreshRef.current = (async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error

        setState({
          user: session?.user ?? null,
          session: session,
          isLoading: false,
          isAuthenticated: !!session?.user,
        })
      } catch (error) {
        console.error("Failed to refresh session:", error)
        setState((prev) => ({ ...prev, isLoading: false }))
      } finally {
        pendingRefreshRef.current = null
      }
    })()

    return pendingRefreshRef.current
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // State will be updated by onAuthStateChange
  }, [])

  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    const supabase = createClient()

    // Initial session fetch
    refreshSession()

    // SINGLE auth state listener for the entire app
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setState({
          user: session?.user ?? null,
          session: session,
          isLoading: false,
          isAuthenticated: !!session?.user,
        })

        // Clear cart localStorage on sign out (server cart will be preserved)
        if (event === "SIGNED_OUT") {
          try {
            localStorage.removeItem("cart")
          } catch {
            // Ignore storage access errors
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshSession])

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  // In Storybook, use the mock context if available
  if (typeof window !== "undefined" && (window as any).__STORYBOOK_AUTH_CONTEXT__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockContext = useContext((window as any).__STORYBOOK_AUTH_CONTEXT__)
    if (mockContext) return mockContext
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthStateManager")
  }
  return context
}

/**
 * Optional hook for components that might be rendered outside AuthStateManager.
 * Returns null if not within the provider, allowing graceful degradation.
 */
export function useAuthOptional() {
  return useContext(AuthContext)
}
