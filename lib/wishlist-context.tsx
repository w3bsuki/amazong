"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface WishlistItem {
  id: string
  product_id: string
  title: string
  price: number
  image: string
  created_at: string
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

      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          id,
          product_id,
          created_at,
          products (
            title,
            price,
            images
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching wishlist:", error)
        setItems([])
      } else if (data) {
        setItems(data.map((item: { id: string; product_id: string; created_at: string; products: { title: string; price: number; images: string[] | null } | null }) => {
          const prod = item.products
          return {
            id: item.id,
            product_id: item.product_id,
            title: prod?.title || "Unknown Product",
            price: prod?.price || 0,
            image: prod?.images?.[0] || "/placeholder.svg",
            created_at: item.created_at,
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
    if (!userId) {
      toast.error("Please sign in to add items to your wishlist")
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("wishlists")
        .insert({
          user_id: userId,
          product_id: product.id,
        })

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - already in wishlist
          toast.info("Already in your wishlist")
        } else {
          throw error
        }
      } else {
        // Add optimistically
        setItems(prev => [{
          id: crypto.randomUUID(),
          product_id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          created_at: new Date().toISOString(),
        }, ...prev])
        toast.success("Added to wishlist")
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast.error("Failed to add to wishlist")
    }
  }

  const removeFromWishlist = async (productId: string) => {
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
      toast.success("Removed from wishlist")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove from wishlist")
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
