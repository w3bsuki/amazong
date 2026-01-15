"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { EUR_TO_BGN_RATE } from "@/lib/currency"

// =============================================================================
// TYPES
// =============================================================================

/** BGN/EUR fixed exchange rate (Bulgarian Lev pegged to Euro) */
export { EUR_TO_BGN_RATE }

export type Currency = "EUR" | "BGN"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
  /** Convert EUR amount to currently selected currency */
  convertFromEur: (eurAmount: number) => number
  /** Get display symbol for current currency */
  currencySymbol: string
  /** Get currency code for formatting */
  currencyCode: string
}

// =============================================================================
// CONTEXT
// =============================================================================

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const STORAGE_KEY = "treido-currency"

// =============================================================================
// PROVIDER
// =============================================================================

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR")

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === "EUR" || saved === "BGN") {
        setCurrencyState(saved)
      }
    } catch {
      // Ignore storage access errors (SSR, private browsing)
    }
  }, [])

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    try {
      localStorage.setItem(STORAGE_KEY, newCurrency)
    } catch {
      // Ignore storage access errors
    }
  }, [])

  const toggleCurrency = useCallback(() => {
    setCurrency(currency === "EUR" ? "BGN" : "EUR")
  }, [currency, setCurrency])

  const convertFromEur = useCallback((eurAmount: number): number => {
    if (currency === "BGN") {
      return eurAmount * EUR_TO_BGN_RATE
    }
    return eurAmount
  }, [currency])

  const currencySymbol = currency === "BGN" ? "лв." : "€"
  const currencyCode = currency

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        convertFromEur,
        currencySymbol,
        currencyCode,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

// =============================================================================
// HOOK
// =============================================================================

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

// =============================================================================
// OPTIONAL HOOK (for components that may render outside provider)
// =============================================================================

export function useCurrencyOptional() {
  return useContext(CurrencyContext)
}
