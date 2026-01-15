"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useOptimistic, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useAuth } from "./auth-state-manager"
import { useLocale } from "next-intl"

// Wishlist toast messages (i18n)
const messages = {
  en: {
    signInRequired: "Please sign in to add items to your wishlist",
    alreadyInWishlist: "Already in your wishlist",
    added: "Added to wishlist",
    addFailed: "Failed to add to wishlist",
    removed: "Removed from wishlist",
    removeFailed: "Failed to remove from wishlist",
  },
  bg: {
    signInRequired: "Влезте, за да добавите в списъка с желания",
    alreadyInWishlist: "Вече е в списъка с желания",
    added: "Добавено в списъка с желания",
    addFailed: "Неуспешно добавяне в списъка",
    removed: "Премахнато от списъка с желания",
    removeFailed: "Неуспешно премахване от списъка",
  },
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
  refreshWishlist: () => Promise<void>
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const locale = useLocale()
  const localeKey = locale === "bg" ? "bg" : "en"
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hasSyncedRef = useRef<string | null>(null)

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

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setItems([])
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Best-effort cleanup: if a product is sold/out_of_stock for > 1 day,
      // remove it from the wishlist server-side.
      try {
        await supabase.rpc("cleanup_sold_wishlist_items")
      } catch {
        // Ignore if function isn't deployed yet or RPC fails.
      }

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
        setItems([])
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
      }
    } catch (error) {
      console.error("Error in refreshWishlist:", error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Sync with server when auth state settles
  useEffect(() => {
    if (authLoading) return // Wait for auth to settle

    if (!user) {
      // User logged out - clear wishlist
      setItems([])
      hasSyncedRef.current = null
      setIsLoading(false)
      return
    }

    // Already synced for this user
    if (hasSyncedRef.current === user.id) return
    hasSyncedRef.current = user.id

    refreshWishlist()
  }, [user, authLoading, refreshWishlist])

  const isInWishlist = useCallback((productId: string) => {
    return optimisticItems.some(item => item.product_id === productId)
  }, [optimisticItems])

  const addToWishlist = async (product: { id: string; title: string; price: number; image: string }) => {
    const t = messages[localeKey]
    
    if (!user?.id) {
      toast.error(t.signInRequired, {
        action: {
          label: locale === "bg" ? "Вход" : "Sign In",
          onClick: () => {
            window.location.href = `/${locale}/auth/login`
          }
        },
        duration: 5000,
      })
      return
    }

    // Apply optimistic update BEFORE server call for instant feedback
    applyOptimistic({ type: "add", productId: product.id, title: product.title, price: product.price, image: product.image })

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
          toast.info(t.alreadyInWishlist)
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
        toast.success(t.added)
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast.error(t.addFailed)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    const t = messages[localeKey]
    
    if (!user?.id) return

    // Apply optimistic update BEFORE server call for instant feedback
    applyOptimistic({ type: "remove", productId })

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
      toast.success(t.removed)
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error(t.removeFailed)
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

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
