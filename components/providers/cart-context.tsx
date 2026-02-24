"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import { createClient } from "@/lib/supabase/client"

import { useAuth } from "./auth-state-manager"
import { calculateCartSubtotal, calculateCartTotalItems } from "./cart-calculations"
import {
  MAX_CART_QUANTITY,
  asString,
  asStringArray,
  normalizeCartImageUrl,
  normalizePrice,
  normalizeQuantity,
  normalizeSellerSlugs,
  parseStoredCartItems,
  readCartFromStorage,
  sanitizeCartItems,
  toRecord,
} from "./cart-helpers"
import type { CartItem } from "./cart-types"

export type { CartItem } from "./cart-types"

async function fetchServerCart(activeUserId: string, unknownProductLabel: string): Promise<CartItem[]> {
  const supabase = createClient()

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
    return []
  }

  const rows: unknown[] = Array.isArray(data) ? data : []
  return rows
    .map((row): CartItem | null => {
      const record = toRecord(row)
      const productId = asString(record?.product_id) ?? ""
      const variantId = asString(record?.variant_id) ?? undefined
      const quantity = normalizeQuantity(record?.quantity)

      const products = toRecord(record?.products)
      const title = asString(products?.title) ?? unknownProductLabel
      const price = normalizePrice(products?.price)

      const images = asStringArray(products?.images)
      const image = normalizeCartImageUrl(images?.[0] ?? null)
      const slug = asString(products?.slug)
      const seller = toRecord(products?.seller)
      const username = asString(seller?.username)

      const variant = toRecord(record?.variant)
      const variantName = asString(variant?.name) ?? undefined

      if (!productId || quantity === null || price === null) {
        return null
      }

      return {
        id: productId,
        ...(variantId ? { variantId } : {}),
        ...(variantName ? { variantName } : {}),
        title,
        price,
        image,
        quantity,
        ...(slug ? { slug } : {}),
        ...(username ? { username, storeSlug: username } : {}),
      }
    })
    .filter((item): item is CartItem => Boolean(item))
}

async function syncLocalCartToServerStorage(): Promise<boolean> {
  const savedCart = localStorage.getItem("cart")

  const localItems = parseStoredCartItems(savedCart)

  if (localItems.length === 0) {
    if (savedCart) localStorage.removeItem("cart")
    return true
  }

  if (savedCart) {
    localStorage.setItem("cart", JSON.stringify(localItems))
  }

  const supabase = createClient()

  for (const item of localItems) {
    const qty = normalizeQuantity(item.quantity)
    if (!item.id || qty === null) continue

    const { error } = await supabase.rpc("cart_add_item", {
      p_product_id: item.id,
      p_quantity: qty,
      ...(item.variantId ? { p_variant_id: item.variantId } : {}),
    })

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Cart sync skipped (RPC unavailable):", error.message || error.code || "unknown")
      }
      return false
    }
  }

  localStorage.removeItem("cart")
  return true
}

async function addServerCartItem(item: CartItem): Promise<void> {
  const supabase = createClient()
  const qty = normalizeQuantity(item.quantity)
  if (!qty) return

  const { error } = await supabase.rpc("cart_add_item", {
    p_product_id: item.id,
    p_quantity: qty,
    ...(item.variantId ? { p_variant_id: item.variantId } : {}),
  })

  if (error) {
    console.error("Error adding to server cart:", error)
  }
}

async function setServerCartQuantity(id: string, quantity: number, variantId?: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.rpc("cart_set_quantity", {
    p_product_id: id,
    p_quantity: quantity,
    ...(variantId ? { p_variant_id: variantId } : {}),
  })

  if (error) {
    console.error("Error updating server cart quantity:", error)
  }
}

async function clearServerCart(): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.rpc("cart_clear")
  if (error) {
    console.error("Error clearing server cart:", error)
  }
}

interface CartContextType {
  items: CartItem[]
  isReady: boolean
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, variantId?: string) => void
  updateQuantity: (id: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}
const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const tCart = useTranslations("Cart")
  const [items, setItems] = useState<CartItem[]>([])
  const hasSyncedRef = useRef<string | null>(null)
  const lastUserIdRef = useRef<string | null>(null)
  const serverLoadSeqRef = useRef(0)
  const [storageLoaded, setStorageLoaded] = useState(false)
  const [serverSyncDone, setServerSyncDone] = useState(false)
  const loadServerCart = useCallback(async (activeUserId: string) => {
    const requestSeq = ++serverLoadSeqRef.current
    const nextItems = await fetchServerCart(activeUserId, tCart("unknownProduct"))
    if (requestSeq !== serverLoadSeqRef.current) return
    if (lastUserIdRef.current !== activeUserId) return
    setItems(nextItems)
  }, [tCart])

  const syncLocalCartToServer = useCallback(async () => {
    await syncLocalCartToServerStorage()
  }, [])

  useEffect(() => {
    try {
      const { items: storageItems, hadRawValue, wasCorrupt, wasSanitized } = readCartFromStorage()
      if (storageItems.length > 0) {
        setItems(storageItems)
        if (wasSanitized) {
          localStorage.setItem("cart", JSON.stringify(storageItems))
        }
      } else if (hadRawValue && (wasCorrupt || wasSanitized)) {
        localStorage.removeItem("cart")
      }
    } catch {
      // Ignore storage access errors
    } finally {
      setStorageLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!storageLoaded) return
    if (authLoading) return
    const syncCart = async () => {
      const activeUserId = user?.id ?? null
      const previousUserId = lastUserIdRef.current

      if (!activeUserId) {
        if (previousUserId) {
          hasSyncedRef.current = null
          serverLoadSeqRef.current += 1
          setItems([])
          try {
            localStorage.removeItem("cart")
          } catch {
            // Ignore storage access errors
          }
        }

        lastUserIdRef.current = null
        setServerSyncDone(true)
        return
      }
      if (previousUserId && previousUserId !== activeUserId) {
        hasSyncedRef.current = null
        serverLoadSeqRef.current += 1
        setItems([])
        try {
          localStorage.removeItem("cart")
        } catch {
          // Ignore storage access errors
        }
      }

      lastUserIdRef.current = activeUserId

      if (hasSyncedRef.current === activeUserId) {
        setServerSyncDone(true)
        return
      }
      hasSyncedRef.current = activeUserId
      setServerSyncDone(false)

      try {
        await syncLocalCartToServer()
        await loadServerCart(activeUserId)
      } finally {
        setServerSyncDone(true)
      }
    }
    syncCart()
  }, [storageLoaded, user, authLoading, loadServerCart, syncLocalCartToServer])

  useEffect(() => {
    if (!storageLoaded) return
    try {
      localStorage.setItem("cart", JSON.stringify(sanitizeCartItems(items)))
    } catch {
      // Ignore storage access errors
    }
  }, [items, storageLoaded])

  const addToCart = (newItem: CartItem) => {
    const normalizedPrice = normalizePrice(newItem.price)
    const normalizedQuantity = normalizeQuantity(newItem.quantity ?? 1)

    if (!newItem.id || normalizedPrice === null || normalizedQuantity === null) {
      console.error("Invalid cart item:", newItem)
      return
    }
    const itemWithValidPrice = {
      ...newItem,
      ...normalizeSellerSlugs({ username: newItem.username, storeSlug: newItem.storeSlug ?? null }),
      image: normalizeCartImageUrl(newItem.image),
      price: normalizedPrice,
      quantity: normalizedQuantity,
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.id === itemWithValidPrice.id &&
          (item.variantId ?? null) === (itemWithValidPrice.variantId ?? null)
      )
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemWithValidPrice.id &&
          (item.variantId ?? null) === (itemWithValidPrice.variantId ?? null)
            ? {
                ...item,
                quantity:
                  normalizeQuantity(item.quantity + itemWithValidPrice.quantity) ?? MAX_CART_QUANTITY,
              }
            : item
        )
      }
      return [...prevItems, itemWithValidPrice]
    })

    const activeUserId = user?.id
    if (activeUserId) {
      void (async () => {
        try {
          await addServerCartItem(itemWithValidPrice)
        } finally {
          await loadServerCart(activeUserId)
        }
      })()
    }
  }

  const removeFromCart = (id: string, variantId?: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && (item.variantId ?? null) === (variantId ?? null)))
    )

    const activeUserId = user?.id
    if (activeUserId) {
      void (async () => {
        try {
          await setServerCartQuantity(id, 0, variantId)
        } finally {
          await loadServerCart(activeUserId)
        }
      })()
    }
  }

  const updateQuantity = (id: string, quantity: number, variantId?: string) => {
    const normalizedQuantity = normalizeQuantity(quantity)
    if (normalizedQuantity === null) {
      removeFromCart(id, variantId)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && (item.variantId ?? null) === (variantId ?? null)
          ? { ...item, quantity: normalizedQuantity }
          : item
      )
    )

    const activeUserId = user?.id
    if (activeUserId) {
      void (async () => {
        try {
          await setServerCartQuantity(id, normalizedQuantity, variantId)
        } finally {
          await loadServerCart(activeUserId)
        }
      })()
    }
  }

  const clearCart = () => {
    setItems([])
    const activeUserId = user?.id
    if (activeUserId) {
      void (async () => {
        try {
          await clearServerCart()
        } finally {
          await loadServerCart(activeUserId)
        }
      })()
    }
  }

  const totalItems = useMemo(() => calculateCartTotalItems(items), [items])
  const subtotal = useMemo(() => calculateCartSubtotal(items), [items])

  const isReady = storageLoaded && !authLoading && serverSyncDone

  return (
    <CartContext.Provider
      value={{
        items,
        isReady,
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

export function useCart(): CartContextType {
  const storybookCartContext = (
    typeof window !== "undefined"
      ? (window as unknown as { __STORYBOOK_CART_CONTEXT__?: unknown }).__STORYBOOK_CART_CONTEXT__
      : undefined
  ) as React.Context<CartContextType | undefined> | undefined

  const context = useContext(CartContext)
  const storybookContextValue = useContext(storybookCartContext ?? CartContext)
  if (storybookCartContext && storybookContextValue) {
    return storybookContextValue
  }

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
