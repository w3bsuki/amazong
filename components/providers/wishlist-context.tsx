"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// Detect locale from cookie (same pattern as Next-intl)
function getLocale(): "en" | "bg" {
  if (typeof document === "undefined") return "en"
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/)
  return (match?.[1] === "bg" ? "bg" : "en")
}

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
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const refreshWishlist = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setItems([])
        setUserId(null)
        setIsLoading(false)
        return
      }

      setUserId(user.id)

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
          return {
            id: item.id,
            product_id: item.product_id,
            title: prod?.title || "Unknown Product",
            price: prod?.price || 0,
            image: prod?.images?.[0] || "/placeholder.svg",
            created_at: item.created_at,
            slug: prod?.slug || undefined,
            username: prod?.seller?.username || undefined,
          }
        }))
      }
    } catch (error) {
      console.error("Error in refreshWishlist:", error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load wishlist on mount and auth state change
  useEffect(() => {
    refreshWishlist()

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshWishlist()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshWishlist])

  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId)
  }, [items])

  const addToWishlist = async (product: { id: string; title: string; price: number; image: string }) => {
    const t = messages[getLocale()]
    
    if (!userId) {
      toast.error(t.signInRequired)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("wishlists")
        .insert({
          user_id: userId,
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
        // Add optimistically
        setItems(prev => [{
          id: data?.id ?? crypto.randomUUID(),
          product_id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          created_at: data?.created_at ?? new Date().toISOString(),
        }, ...prev])
        toast.success(t.added)
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast.error(t.addFailed)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    const t = messages[getLocale()]
    
    if (!userId) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId)

      if (error) {
        throw error
      }

      // Remove optimistically
      setItems(prev => prev.filter(item => item.product_id !== productId))
      toast.success(t.removed)
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error(t.removeFailed)
    }
  }

  const toggleWishlist = async (product: { id: string; title: string; price: number; image: string }) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  const totalItems = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
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
