"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  type Context,
} from "react"
import { usePathname } from "next/navigation"
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

  const pathname = usePathname()
  const isInitializedRef = useRef(false)
  const pendingRefreshRef = useRef<Promise<void> | null>(null)
  const lastPathnameRef = useRef<string | null>(null)
  const lastRefreshRef = useRef<number>(0)

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
        // Avoid logging raw error objects in client (can contain request details).
        console.error("Failed to refresh session")
        setState((prev) => ({ ...prev, isLoading: false }))
      } finally {
        pendingRefreshRef.current = null
      }
    })()

    return pendingRefreshRef.current
  }, [])

  const refreshWithThrottle = useCallback(async () => {
    const now = Date.now()
    if (now - lastRefreshRef.current < 30_000) return
    lastRefreshRef.current = now
    await refreshSession()
  }, [refreshSession])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // State will be updated by onAuthStateChange
  }, [])

  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    const supabase = createClient()

    // SINGLE auth state listener for the entire app
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setState({
          user: session?.user ?? null,
          session: session,
          isLoading: false,
          isAuthenticated: !!session?.user,
        })

      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshSession])

  // Sync session on navigation when leaving auth routes. This fixes cases where auth is
  // performed on the server (server actions setting cookies), which won't trigger the
  // browser client's onAuthStateChange event.
  useEffect(() => {
    if (!pathname) return

    const previous = lastPathnameRef.current
    if (previous === pathname) return
    lastPathnameRef.current = pathname

    // First load: always fetch once.
    if (!previous) {
      void refreshSession()
      return
    }

    const wasAuthRoute = previous.includes("/auth")
    const isAuthRoute = pathname.includes("/auth")

    if (wasAuthRoute && !isAuthRoute) {
      void refreshWithThrottle()
    }
  }, [pathname, refreshWithThrottle])

  useEffect(() => {
    if (!state.isAuthenticated) return

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshWithThrottle()
      }
    }

    const interval = window.setInterval(() => {
      void refreshWithThrottle()
    }, 10 * 60 * 1000)

    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [state.isAuthenticated, refreshWithThrottle])

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  // In Storybook, use the mock context if available
  const storybookAuthContext =
    typeof window !== "undefined"
      ? (window as unknown as { __STORYBOOK_AUTH_CONTEXT__?: unknown }).__STORYBOOK_AUTH_CONTEXT__
      : undefined

  if (storybookAuthContext) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockContext = useContext(storybookAuthContext as Context<AuthContextType | null>)
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
