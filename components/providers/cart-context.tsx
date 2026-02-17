import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { safeJsonParse } from "@/lib/safe-json"
import { normalizeImageUrl } from "@/lib/normalize-image-url"
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
  /** True once initial cart hydration + auth sync has completed. */
  isReady: boolean
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, variantId?: string) => void
  updateQuantity: (id: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const MAX_CART_QUANTITY = 99

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

function normalizeQuantity(value: unknown): number | null {
  const numeric = asNumber(value)
  if (numeric === null) return null
  const rounded = Math.floor(numeric)
  if (!Number.isSafeInteger(rounded) || rounded <= 0) return null
  return Math.min(rounded, MAX_CART_QUANTITY)
}

function normalizePrice(value: unknown): number | null {
  const numeric = asNumber(value)
  if (numeric === null || numeric < 0) return null
  return numeric
}

function normalizeSellerSlugs(item: { username?: string | undefined; storeSlug?: string | null | undefined }): Pick<CartItem, "username" | "storeSlug"> {
  const username = item.username ?? (item.storeSlug || undefined)
  const storeSlug = item.storeSlug || item.username || undefined

  return {
    ...(username ? { username } : {}),
    ...(storeSlug ? { storeSlug } : {}),
  }
}

function sanitizeCartItems(rawItems: CartItem[]): CartItem[] {
  const sanitized: CartItem[] = []
  for (const item of rawItems) {
    if (!item?.id) continue
    const price = normalizePrice(item.price)
    const quantity = normalizeQuantity(item.quantity)
    if (price === null || quantity === null) continue
    const sellerSlugs = normalizeSellerSlugs({
      username: item.username,
      storeSlug: item.storeSlug ?? null,
    })
    sanitized.push({
      ...item,
      ...sellerSlugs,
      image: normalizeImageUrl(item.image),
      price,
      quantity,
    })
  }
  return sanitized
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const hasSyncedRef = useRef<string | null>(null)
  const lastUserIdRef = useRef<string | null>(null)
  const serverLoadSeqRef = useRef(0)
  const [storageLoaded, setStorageLoaded] = useState(false)
  const [serverSyncDone, setServerSyncDone] = useState(false)

  const loadServerCart = useCallback(async (activeUserId: string) => {
    const requestSeq = ++serverLoadSeqRef.current
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
    const nextItems = rows.map((row): CartItem | null => {
      const record = toRecord(row)
      const productId = asString(record?.product_id) ?? ""
      const variantId = asString(record?.variant_id) ?? undefined
      const quantity = normalizeQuantity(record?.quantity)

      const products = toRecord(record?.products)
      const title = asString(products?.title) ?? "Unknown Product"
      const price = normalizePrice(products?.price)

      const images = asStringArray(products?.images)
      const image = normalizeImageUrl(images?.[0] ?? null)

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

    if (requestSeq !== serverLoadSeqRef.current) return
    if (lastUserIdRef.current !== activeUserId) return

    setItems(nextItems)
  }, [])

  const syncLocalCartToServer = useCallback(async () => {
    const savedCart = localStorage.getItem("cart")
    const localItems = safeJsonParse<CartItem[]>(savedCart) || []
    const sanitizedItems = sanitizeCartItems(localItems)

    if (sanitizedItems.length === 0) {
      if (localItems.length > 0) {
        localStorage.removeItem("cart")
      }
      return
    }

    if (sanitizedItems.length !== localItems.length) {
      localStorage.setItem("cart", JSON.stringify(sanitizedItems))
    }

    const supabase = createClient()

    // Best-effort merge: add/increment each item via RPC.
    // If the RPC isn't deployed yet, we keep localStorage as-is.
    for (const item of sanitizedItems) {
      const qty = normalizeQuantity(item.quantity)
      if (!item.id || qty === null) continue

      const { error } = await supabase.rpc("cart_add_item", {
        p_product_id: item.id,
        p_quantity: qty,
        ...(item.variantId ? { p_variant_id: item.variantId } : {}),
      })

      if (error) {
        // RPC may not be deployed - silently skip sync (keep localStorage)
        if (process.env.NODE_ENV === "development") {
          console.warn("Cart sync skipped (RPC unavailable):", error.message || error.code || "unknown")
        }
        return
      }
    }

    // Only clear local cart if sync succeeded.
    localStorage.removeItem("cart")
  }, [])

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      const parsed = safeJsonParse<CartItem[]>(savedCart)
      if (parsed) {
        const sanitized = sanitizeCartItems(parsed)
        if (sanitized.length > 0) {
          setItems(sanitized)
          localStorage.setItem("cart", JSON.stringify(sanitized))
        } else if (savedCart) {
          // Corrupt/partial data: clear it so it can't break the app or tests.
          localStorage.removeItem("cart")
        }
      } else if (savedCart) {
        // Corrupt/partial data: clear it so it can't break the app or tests.
        localStorage.removeItem("cart")
      }
    } catch {
      // Ignore storage access errors
    } finally {
      setStorageLoaded(true)
    }
  }, [])

  // Sync with server when auth state settles
  useEffect(() => {
    if (!storageLoaded) return
    if (authLoading) return // Wait for auth to settle

    const syncCart = async () => {
      const activeUserId = user?.id ?? null
      const previousUserId = lastUserIdRef.current

      if (!activeUserId) {
        if (previousUserId) {
          // Signed out: clear local + in-memory cart to avoid cross-account drift.
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
        // Switching accounts: reset sync state and local cache.
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

      // Already synced for this user
      if (hasSyncedRef.current === activeUserId) {
        setServerSyncDone(true)
        return
      }
      hasSyncedRef.current = activeUserId
      setServerSyncDone(false)

      try {
        // Sync local → server
        await syncLocalCartToServer()
        // Load server → state
        await loadServerCart(activeUserId)
      } finally {
        setServerSyncDone(true)
      }
    }

    syncCart()
  }, [storageLoaded, user, authLoading, loadServerCart, syncLocalCartToServer])

  // Save cart to local storage whenever it changes.
  // This keeps the cart resilient across route-group layout boundaries and
  // provides an immediate UX even if server sync is delayed.
  useEffect(() => {
    if (!storageLoaded) return
    try {
      localStorage.setItem("cart", JSON.stringify(items))
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
      image: normalizeImageUrl(newItem.image),
      price: normalizedPrice,
      quantity: normalizedQuantity,
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) =>
        item.id === itemWithValidPrice.id && (item.variantId ?? null) === (itemWithValidPrice.variantId ?? null)
      )
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === itemWithValidPrice.id && (item.variantId ?? null) === (itemWithValidPrice.variantId ?? null)
            ? {
                ...item,
                quantity:
                  normalizeQuantity(item.quantity + itemWithValidPrice.quantity) ?? MAX_CART_QUANTITY,
              }
            : item,
        )
      }
      return [...prevItems, itemWithValidPrice]
    })

    // Server-side cart (best-effort)
    const activeUserId = user?.id
    if (activeUserId) {
      const qty = itemWithValidPrice.quantity
      void (async () => {
        const supabase = createClient()
        try {
          const { error } = await supabase.rpc("cart_add_item", {
            p_product_id: itemWithValidPrice.id,
            p_quantity: qty,
            ...(itemWithValidPrice.variantId ? { p_variant_id: itemWithValidPrice.variantId } : {}),
          })

          if (error) {
            console.error("Error adding to server cart:", error)
          }
        } finally {
          // Server remains the source of truth for authenticated carts.
          await loadServerCart(activeUserId)
        }
      })()
    }
  }

  const removeFromCart = (id: string, variantId?: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.id === id && (item.variantId ?? null) === (variantId ?? null))))

    const activeUserId = user?.id
    if (activeUserId) {
      void (async () => {
        const supabase = createClient()
        try {
          const { error } = await supabase.rpc("cart_set_quantity", {
            p_product_id: id,
            p_quantity: 0,
            ...(variantId ? { p_variant_id: variantId } : {}),
          })

          if (error) {
            console.error("Error removing from server cart:", error)
          }
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
    setItems((prevItems) => prevItems.map((item) =>
      item.id === id && (item.variantId ?? null) === (variantId ?? null)
        ? { ...item, quantity: normalizedQuantity }
        : item
    ))

    const activeUserId = user?.id
    if (activeUserId) {
      void (async () => {
        const supabase = createClient()
        try {
          const { error } = await supabase.rpc("cart_set_quantity", {
            p_product_id: id,
            p_quantity: normalizedQuantity,
            ...(variantId ? { p_variant_id: variantId } : {}),
          })

          if (error) {
            console.error("Error updating server cart quantity:", error)
          }
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
        const supabase = createClient()
        try {
          const { error } = await supabase.rpc("cart_clear")
          if (error) {
            console.error("Error clearing server cart:", error)
          }
        } finally {
          await loadServerCart(activeUserId)
        }
      })()
    }
  }

  const totalItems = items.reduce((total, item) => {
    const quantity = normalizeQuantity(item.quantity) ?? 0
    return total + quantity
  }, 0)
  const subtotal = items.reduce((total, item) => {
    const price = normalizePrice(item.price) ?? 0
    const quantity = normalizeQuantity(item.quantity) ?? 0
    return total + price * quantity
  }, 0)

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
  // In Storybook, use the mock context if available
  const storybookCartContext =
    typeof window !== "undefined"
      ? (window as unknown as { __STORYBOOK_CART_CONTEXT__?: unknown }).__STORYBOOK_CART_CONTEXT__
      : undefined

  if (storybookCartContext) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockContext = useContext(
      storybookCartContext as React.Context<CartContextType | undefined>
    )
    if (mockContext) return mockContext
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

