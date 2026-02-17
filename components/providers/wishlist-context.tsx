import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useOptimistic, useRef, startTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useAuth } from "./auth-state-manager"
import { useTranslations } from "next-intl"

function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  const maybeLocale = segments[0]
  if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
    segments.shift()
  }
  const normalized = `/${segments.join("/")}`
  return normalized === "/" ? "/" : normalized.replace(/\/+$/, "")
}

export interface WishlistItem {
  id: string
  product_id: string
  title: string
  price: number
  image: string
  created_at: string
  /** Product slug for SEO-friendly URLs */
  slug?: string
  /** Seller username for SEO-friendly URLs */
  username?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  isInWishlist: (productId: string) => boolean
  addToWishlist: (product: { id: string; title: string; price: number; image: string }) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  toggleWishlist: (product: { id: string; title: string; price: number; image: string }) => Promise<void>
  refreshWishlist: () => Promise<boolean>
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const tWishlist = useTranslations("Wishlist")
  const tAuth = useTranslations("Auth")
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hasSyncedRef = useRef<string | null>(null)
  const lastUserIdRef = useRef<string | null>(null)

  // useOptimistic for instant heart toggle feedback
  type OptimisticAction = 
    | { type: "add"; productId: string; title: string; price: number; image: string }
    | { type: "remove"; productId: string }
  
  const [optimisticItems, applyOptimistic] = useOptimistic(
    items,
    (state, action: OptimisticAction) => {
      if (action.type === "add") {
        // Don't add if already present
        if (state.some(item => item.product_id === action.productId)) return state
        return [{
          id: `optimistic-${action.productId}`,
          product_id: action.productId,
          title: action.title,
          price: action.price,
          image: action.image,
          created_at: new Date().toISOString(),
        }, ...state]
      } else {
        return state.filter(item => item.product_id !== action.productId)
      }
    }
  )

  const refreshWishlist = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setItems([])
      setIsLoading(false)
      return false
    }

    try {
      setIsLoading(true)
      const supabase = createClient()

      // Note: cleanup_sold_wishlist_items() is called server-side when the user
      // visits the /account/wishlist page. We don't call it here to avoid
      // unnecessary DB writes on every context refresh.

      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          id,
          product_id,
          created_at,
          products (
            title,
            price,
            images,
            slug,
            seller:profiles!products_seller_id_fkey(username)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching wishlist:", error)
        return false
      } else if (data) {
        setItems(data.map((item: { 
          id: string
          product_id: string
          created_at: string
          products: { 
            title: string
            price: number
            images: string[] | null
            slug: string | null
            seller: { username: string | null } | null
          } | null 
        }) => {
          const prod = item.products
          const slug = prod?.slug
          const username = prod?.seller?.username
          return {
            id: item.id,
            product_id: item.product_id,
            title: prod?.title || "Unknown Product",
            price: prod?.price || 0,
            image: prod?.images?.[0] || "/placeholder.svg",
            created_at: item.created_at,
            ...(slug ? { slug } : {}),
            ...(username ? { username } : {}),
          }
        }))
        return true
      }
    } catch (error) {
      console.error("Error in refreshWishlist:", error)
      return false
    } finally {
      setIsLoading(false)
    }
    return true
  }, [user])

  // Sync with server when auth state settles
  useEffect(() => {
    if (authLoading) return // Wait for auth to settle

    const activeUserId = user?.id ?? null

    if (!activeUserId) {
      // User logged out - clear wishlist
      setItems([])
      hasSyncedRef.current = null
      lastUserIdRef.current = null
      setIsLoading(false)
      return
    }

    if (lastUserIdRef.current && lastUserIdRef.current !== activeUserId) {
      setItems([])
      hasSyncedRef.current = null
    }
    lastUserIdRef.current = activeUserId

    // Already synced for this user
    if (hasSyncedRef.current === activeUserId) return

    const run = async () => {
      const ok = await refreshWishlist()
      if (ok) {
        hasSyncedRef.current = activeUserId
      } else {
        hasSyncedRef.current = null
      }
    }

    run()
  }, [user, authLoading, refreshWishlist])

  const isInWishlist = useCallback((productId: string) => {
    return optimisticItems.some(item => item.product_id === productId)
  }, [optimisticItems])

  const addToWishlist = async (product: { id: string; title: string; price: number; image: string }) => {
    if (!user?.id) {
      toast.error(tWishlist("signInRequired"), {
        action: {
          label: tAuth("signIn"),
          onClick: () => {
            if (typeof window === "undefined") return
            const currentPathname = window.location.pathname || "/"
            const next = stripLocalePrefix(currentPathname)

            const localeMatch = currentPathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?:\/|$)/i)
            const localePrefix = localeMatch?.[1] ? `/${localeMatch[1]}` : ""
            const query = `next=${encodeURIComponent(next)}`
            window.location.assign(`${localePrefix}/auth/login?${query}`)
          }
        },
        duration: 5000,
      })
      return
    }

    // Apply optimistic update BEFORE server call for instant feedback
    // React 19 requires optimistic updates to be wrapped in startTransition
    startTransition(() => {
      applyOptimistic({ type: "add", productId: product.id, title: product.title, price: product.price, image: product.image })
    })

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          product_id: product.id,
        })
        .select("id, created_at")
        .single()

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - already in wishlist
          toast.info(tWishlist("alreadyInWishlist"))
        } else {
          throw error
        }
      } else {
        // Commit the real data to state
        setItems(prev => [{
          id: data?.id ?? crypto.randomUUID(),
          product_id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
           created_at: data?.created_at ?? new Date().toISOString(),
        }, ...prev.filter(item => item.product_id !== product.id)])
        toast.success(tWishlist("addedToWishlist"))
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast.error(tWishlist("addToWishlistFailed"))
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user?.id) return

    // Apply optimistic update BEFORE server call for instant feedback
    // React 19 requires optimistic updates to be wrapped in startTransition
    startTransition(() => {
      applyOptimistic({ type: "remove", productId })
    })

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)

      if (error) {
        throw error
      }

      // Commit to real state
      setItems(prev => prev.filter(item => item.product_id !== productId))
      toast.success(tWishlist("removedFromWishlist"))
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error(tWishlist("removeFromWishlistFailed"))
      // On error, refresh to restore correct state
      refreshWishlist()
    }
  }

  const toggleWishlist = async (product: { id: string; title: string; price: number; image: string }) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  // Use optimistic items count for instant badge updates
  const totalItems = optimisticItems.length

  return (
    <WishlistContext.Provider
      value={{
        items: optimisticItems, // Expose optimistic state for instant UI updates
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        refreshWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist(): WishlistContextType {
  // In Storybook, use the mock context if available
  const storybookWishlistContext =
    typeof window !== "undefined"
      ? (window as unknown as { __STORYBOOK_WISHLIST_CONTEXT__?: unknown }).__STORYBOOK_WISHLIST_CONTEXT__
      : undefined

  if (storybookWishlistContext) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockContext = useContext(
      storybookWishlistContext as React.Context<WishlistContextType | undefined>
    )
    if (mockContext) return mockContext
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

