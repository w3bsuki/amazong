"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { safeJsonParse } from "@/lib/safe-json"

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
  slug?: string
  /** Seller username for SEO-friendly URLs */
  username?: string
  /** @deprecated Use 'username' instead */
  storeSlug?: string | null
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    try {
      const parsed = safeJsonParse<CartItem[]>(savedCart)
      if (parsed) {
        setItems(parsed)
      } else if (savedCart) {
        // Corrupt/partial data: clear it so it can't break the app or tests.
        localStorage.removeItem("cart")
      }
    } catch {
      // Ignore storage access errors
    }
  }, [])

  const loadServerCart = useCallback(async (activeUserId: string) => {
    const supabase = createClient()

    // Note: cart_items is introduced via migration; keep runtime-safe casts.
    const { data, error } = await (supabase as unknown as any)
      .from("cart_items")
      .select(`
        product_id,
        quantity,
        products (
          title,
          price,
          images,
          slug,
          seller:profiles!products_seller_id_fkey(username)
        )
      `)
      .eq("user_id", activeUserId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching server cart:", error)
      return
    }

    const nextItems: CartItem[] = (data || []).map((row: any) => {
      const prod = row.products
      return {
        id: row.product_id,
        title: prod?.title || "Unknown Product",
        price: typeof prod?.price === "number" ? prod.price : Number(prod?.price) || 0,
        image: prod?.images?.[0] || "/placeholder.svg",
        quantity: typeof row.quantity === "number" ? row.quantity : Number(row.quantity) || 1,
        slug: prod?.slug || undefined,
        username: prod?.seller?.username || undefined,
      }
    })

    setItems(nextItems)
  }, [])

  const syncLocalCartToServer = useCallback(async (activeUserId: string) => {
    const savedCart = localStorage.getItem("cart")
    const localItems = safeJsonParse<CartItem[]>(savedCart) || []

    if (localItems.length === 0) return

    const supabase = createClient()

    // Best-effort merge: add/increment each item via RPC.
    // If the RPC isn't deployed yet, we keep localStorage as-is.
    for (const item of localItems) {
      const qty = typeof item.quantity === "number" ? item.quantity : Number(item.quantity) || 1
      if (!item.id || qty <= 0) continue

      const { error } = await supabase.rpc("cart_add_item", {
        p_product_id: item.id,
        p_quantity: qty,
      } as any)

      if (error) {
        console.error("Error syncing cart item:", error)
        return
      }
    }

    // Only clear local cart if sync succeeded.
    localStorage.removeItem("cart")
  }, [])

  // Keep cart in sync with auth state (prefer server cart when signed in)
  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    const bootstrap = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (!user) {
        setUserId(null)
        return
      }

      setUserId(user.id)
      await syncLocalCartToServer(user.id)
      await loadServerCart(user.id)
    }

    void bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUserId = session?.user?.id ?? null
      setUserId(nextUserId)

      if (!nextUserId) {
        // On logout, fall back to whatever local cart exists.
        const savedCart = localStorage.getItem("cart")
        const parsed = safeJsonParse<CartItem[]>(savedCart) || []
        setItems(parsed)
        return
      }

      await syncLocalCartToServer(nextUserId)
      await loadServerCart(nextUserId)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [loadServerCart, syncLocalCartToServer])

  // Save cart to local storage whenever it changes (guest only)
  useEffect(() => {
    if (userId) return
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items, userId])

  const addToCart = (newItem: CartItem) => {
    // Ensure price is a valid number
    const itemWithValidPrice = {
      ...newItem,
      price: typeof newItem.price === 'string' ? parseFloat(newItem.price) : newItem.price,
      quantity: newItem.quantity || 1
    }
    
    // Guard against NaN
    if (isNaN(itemWithValidPrice.price)) {
      console.error('Invalid price for cart item:', newItem)
      itemWithValidPrice.price = 0
    }
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemWithValidPrice.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemWithValidPrice.id ? { ...item, quantity: item.quantity + itemWithValidPrice.quantity } : item,
        )
      }
      return [...prevItems, itemWithValidPrice]
    })

    // Server-side cart (best-effort)
    if (userId) {
      const qty = itemWithValidPrice.quantity
      void (async () => {
        const supabase = createClient()
        const { error } = await supabase.rpc("cart_add_item", {
          p_product_id: itemWithValidPrice.id,
          p_quantity: qty,
        } as any)

        if (error) {
          console.error("Error adding to server cart:", error)
        }
      })()
    }
  }

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))

    if (userId) {
      void (async () => {
        const supabase = createClient()
        const { error } = await supabase.rpc("cart_set_quantity", {
          p_product_id: id,
          p_quantity: 0,
        } as any)

        if (error) {
          console.error("Error removing from server cart:", error)
        }
      })()
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))

    if (userId) {
      void (async () => {
        const supabase = createClient()
        const { error } = await supabase.rpc("cart_set_quantity", {
          p_product_id: id,
          p_quantity: quantity,
        } as any)

        if (error) {
          console.error("Error updating server cart quantity:", error)
        }
      })()
    }
  }

  const clearCart = () => {
    setItems([])

    if (userId) {
      void (async () => {
        const supabase = createClient()
        const { error } = await supabase.rpc("cart_clear")
        if (error) {
          console.error("Error clearing server cart:", error)
        }
      })()
    }
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price)) || 0
    const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity)) || 0
    return total + price * quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
