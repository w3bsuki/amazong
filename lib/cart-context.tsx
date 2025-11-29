"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
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

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch {
        console.error("Failed to parse cart from local storage")
      }
    }
  }, [])

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

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
  }

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
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
