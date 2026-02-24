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
import { usePathname } from "@/i18n/routing"
import { createClient, createFreshClient } from "@/lib/supabase/client"
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  refreshSession: (options?: { forceRetry?: boolean }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
const EMPTY_AUTH_STATE: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
}

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
  const pendingForceRetryRef = useRef(false)
  const lastPathnameRef = useRef<string | null>(null)
  const lastRefreshRef = useRef<number>(0)

  const syncSingletonSession = useCallback(async (session: Session | null) => {
    const singletonClient = createClient()

    const {
      data: { session: singletonSession },
    } = await singletonClient.auth.getSession()

    if (!session?.access_token || !session.refresh_token) {
      // Avoid recursive SIGNED_OUT loops: only clear local auth state
      // when the singleton currently has an active session.
      if (singletonSession) {
        await singletonClient.auth.signOut({ scope: "local" })
      }
      return
    }

    if (singletonSession?.access_token === session.access_token) return

    await singletonClient.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })
  }, [])
  const setStateFromSession = useCallback((session: Session | null) => {
    setState({
      user: session?.user ?? null,
      session,
      isLoading: false,
      isAuthenticated: Boolean(session?.user),
    })
  }, [])

  const refreshSessionOnce = useCallback(
    async (forceRetry: boolean) => {
      try {
        const readFreshSession = async () => {
          // Fresh client ensures we re-read auth cookies written by server actions.
          const supabase = createFreshClient()
          return supabase.auth.getSession()
        }

        let {
          data: { session },
          error,
        } = await readFreshSession()

        if (error) throw error
        if (!session && forceRetry) {
          await new Promise((resolve) => setTimeout(resolve, 180))
          const retry = await readFreshSession()
          session = retry.data.session
          error = retry.error
          if (error) throw error
        }

        setStateFromSession(session)
        await syncSingletonSession(session)
      } catch {
        // Avoid logging raw error objects in client (can contain request details).
        console.error("Failed to refresh session")
        setState((prev) => ({ ...prev, isLoading: false, isAuthenticated: Boolean(prev.user) }))
      }
    },
    [setStateFromSession, syncSingletonSession]
  )

  const refreshSession = useCallback(
    async (options?: { forceRetry?: boolean }) => {
      if (options?.forceRetry) {
        pendingForceRetryRef.current = true
      }

      // Reuse active refresh. Force requests are queued and executed immediately
      // after the current pass completes.
      if (pendingRefreshRef.current) {
        return pendingRefreshRef.current
      }

      pendingRefreshRef.current = (async () => {
        try {
          // Always run at least one refresh pass.
          const initialForceRetry = pendingForceRetryRef.current
          pendingForceRetryRef.current = false
          await refreshSessionOnce(initialForceRetry)

          // Drain any force-refresh requests that arrived while the first pass
          // was in flight (e.g., login success racing with initial guest refresh).
          while (pendingForceRetryRef.current) {
            pendingForceRetryRef.current = false
            await refreshSessionOnce(true)
          }
        } finally {
          pendingRefreshRef.current = null
        }
      })()

      return pendingRefreshRef.current
    },
    [refreshSessionOnce]
  )

  const refreshWithThrottle = useCallback(async (forceRetry = false) => {
    const now = Date.now()

    // Route-exit refresh after auth success is latency-sensitive and should
    // never be skipped by the periodic refresh throttle.
    if (!forceRetry && now - lastRefreshRef.current < 30_000) return

    lastRefreshRef.current = now
    await refreshSession({ forceRetry })
  }, [refreshSession])

  const signOut = useCallback(async () => {
    try {
      const supabase = createFreshClient()
      await supabase.auth.signOut()
      await syncSingletonSession(null)
    } finally {
      setState(EMPTY_AUTH_STATE)
    }
  }, [syncSingletonSession])

  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    const supabase = createClient()

    // SINGLE auth state listener for the entire app
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setStateFromSession(session)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [setStateFromSession, syncSingletonSession])

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
      void refreshWithThrottle(true)
    }
  }, [pathname, refreshSession, refreshWithThrottle])

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

