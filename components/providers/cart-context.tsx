"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { safeJsonParse } from "@/lib/safe-json"
import { useAuth } from "./auth-state-manager"

export interface CartItem {
  id: string
  /** Optional product variant id (for listings with variants). */
  variantId?: string
  /** Optional variant display name for UX (cart rendering). */
  variantName?: string
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
  removeFromCart: (id: string, variantId?: string) => void
  updateQuantity: (id: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const out: string[] = []
  for (const item of value) {
    if (typeof item !== "string") return null
    out.push(item)
  }
  return out
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const hasSyncedRef = useRef<string | null>(null)

  const loadServerCart = useCallback(async (activeUserId: string) => {
    const supabase = createClient()

    // Note: cart_items is introduced via migration; keep runtime-safe casts.
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        product_id,
        variant_id,
        quantity,
        products (
          title,
          price,
          images,
          slug,
          seller:profiles!products_seller_id_fkey(username)
        ),
        variant:product_variants!cart_items_variant_id_fkey(
          id,
          name
        )
      `)
      .eq("user_id", activeUserId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching server cart:", error)
      return
    }

    const rows: unknown[] = Array.isArray(data) ? data : []
    const nextItems: CartItem[] = rows.map((row) => {
      const record = toRecord(row)
      const productId = asString(record?.product_id) ?? ""
      const variantId = asString(record?.variant_id) ?? undefined
      const quantity = asNumber(record?.quantity) ?? 1

      const products = toRecord(record?.products)
      const title = asString(products?.title) ?? "Unknown Product"
      const price = asNumber(products?.price) ?? 0

      const images = asStringArray(products?.images)
      const image = images?.[0] ?? "/placeholder.svg"

      const slug = asString(products?.slug)
      const seller = toRecord(products?.seller)
      const username = asString(seller?.username)

      const variant = toRecord(record?.variant)
      const variantName = asString(variant?.name) ?? undefined

      return {
        id: productId,
        ...(variantId ? { variantId } : {}),
        ...(variantName ? { variantName } : {}),
        title,
        price,
        image,
        quantity,
        ...(slug ? { slug } : {}),
        ...(username ? { username } : {}),
      }
    })
    .filter((item) => Boolean(item.id))

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
        ...(item.variantId ? { p_variant_id: item.variantId } : {}),
      })

      if (error) {
        console.error("Error syncing cart item:", error)
        return
      }
    }

    // Only clear local cart if sync succeeded.
    localStorage.removeItem("cart")
  }, [])

  // Load from localStorage immediately (for SSR hydration)
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

  // Sync with server when auth state settles
  useEffect(() => {
    if (authLoading) return // Wait for auth to settle

    const syncCart = async () => {
      if (!user) {
        // User logged out - keep localStorage cart, reset sync ref
        hasSyncedRef.current = null
        return
      }

      // Already synced for this user
      if (hasSyncedRef.current === user.id) return
      hasSyncedRef.current = user.id

      // Sync local → server
      await syncLocalCartToServer(user.id)
      // Load server → state
      await loadServerCart(user.id)
    }

    syncCart()
  }, [user, authLoading, loadServerCart, syncLocalCartToServer])

  // Save cart to local storage whenever it changes.
  // This keeps the cart resilient across route-group layout boundaries and
  // provides an immediate UX even if server sync is delayed.
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch {
      // Ignore storage access errors
    }
  }, [items])

  const addToCart = (newItem: CartItem) => {
    // Ensure price is a valid number
    const itemWithValidPrice = {
      ...newItem,
      price: typeof newItem.price === 'string' ? Number.parseFloat(newItem.price) : newItem.price,
      quantity: newItem.quantity || 1
    }
    
    // Guard against NaN
    if (isNaN(itemWithValidPrice.price)) {
      console.error('Invalid price for cart item:', newItem)
      itemWithValidPrice.price = 0
    }
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) =>
        item.id === itemWithValidPrice.id && (item.variantId ?? null) === (itemWithValidPrice.variantId ?? null)
      )
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemWithValidPrice.id && (item.variantId ?? null) === (itemWithValidPrice.variantId ?? null)
            ? { ...item, quantity: item.quantity + itemWithValidPrice.quantity }
            : item,
        )
      }
      return [...prevItems, itemWithValidPrice]
    })

    // Server-side cart (best-effort)
    if (user?.id) {
      const qty = itemWithValidPrice.quantity
      void (async () => {
        const supabase = createClient()
        const { error } = await supabase.rpc("cart_add_item", {
          p_product_id: itemWithValidPrice.id,
          p_quantity: qty,
          ...(itemWithValidPrice.variantId ? { p_variant_id: itemWithValidPrice.variantId } : {}),
        })

        if (error) {
          console.error("Error adding to server cart:", error)
        }
      })()
    }
  }

  const removeFromCart = (id: string, variantId?: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.id === id && (item.variantId ?? null) === (variantId ?? null))))

    if (user?.id) {
      void (async () => {
        const supabase = createClient()
        const { error } = await supabase.rpc("cart_set_quantity", {
          p_product_id: id,
          p_quantity: 0,
          ...(variantId ? { p_variant_id: variantId } : {}),
        })

        if (error) {
          console.error("Error removing from server cart:", error)
        }
      })()
    }
  }

  const updateQuantity = (id: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, variantId)
      return
    }
    setItems((prevItems) => prevItems.map((item) =>
      item.id === id && (item.variantId ?? null) === (variantId ?? null)
        ? { ...item, quantity }
        : item
    ))

    if (user?.id) {
      void (async () => {
        const supabase = createClient()
        const { error } = await supabase.rpc("cart_set_quantity", {
          p_product_id: id,
          p_quantity: quantity,
          ...(variantId ? { p_variant_id: variantId } : {}),
        })

        if (error) {
          console.error("Error updating server cart quantity:", error)
        }
      })()
    }
  }

  const clearCart = () => {
    setItems([])

    if (user?.id) {
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
    const price = typeof item.price === 'number' ? item.price : Number.parseFloat(String(item.price)) || 0
    const quantity = typeof item.quantity === 'number' ? item.quantity : Number.parseInt(String(item.quantity)) || 0
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
