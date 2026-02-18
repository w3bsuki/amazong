import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "./auth-state-manager"
import type { CartItem } from "./cart-context-types"
import {
  MAX_CART_QUANTITY,
  normalizePrice,
  normalizeQuantity,
  normalizeSellerSlugs,
  readCartFromStorage,
  sanitizeCartItems,
} from "./cart-context-utils"
import {
  addServerCartItem,
  clearServerCart,
  fetchServerCart,
  setServerCartQuantity,
  syncLocalCartToServerStorage,
} from "./cart-context-server"

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
  const [items, setItems] = useState<CartItem[]>([])
  const hasSyncedRef = useRef<string | null>(null)
  const lastUserIdRef = useRef<string | null>(null)
  const serverLoadSeqRef = useRef(0)
  const [storageLoaded, setStorageLoaded] = useState(false)
  const [serverSyncDone, setServerSyncDone] = useState(false)
  const loadServerCart = useCallback(async (activeUserId: string) => {
    const requestSeq = ++serverLoadSeqRef.current
    const nextItems = await fetchServerCart(activeUserId)
    if (requestSeq !== serverLoadSeqRef.current) return
    if (lastUserIdRef.current !== activeUserId) return
    setItems(nextItems)
  }, [])

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

  const totalItems = useMemo(
    () =>
      items.reduce((total, item) => {
        const quantity = normalizeQuantity(item.quantity) ?? 0
        return total + quantity
      }, 0),
    [items]
  )

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const price = normalizePrice(item.price) ?? 0
        const quantity = normalizeQuantity(item.quantity) ?? 0
        return total + price * quantity
      }, 0),
    [items]
  )

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

export type { CartItem } from "./cart-context-types"
