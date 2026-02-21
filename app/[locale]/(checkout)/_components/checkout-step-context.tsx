"use client"

import * as React from "react"

type CheckoutStep = 1 | 2 | 3

type CheckoutStepContextValue = {
  currentStep: CheckoutStep
  setCurrentStep: (step: CheckoutStep) => void
}

const CheckoutStepContext = React.createContext<CheckoutStepContextValue | null>(null)

export function CheckoutStepProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = React.useState<CheckoutStep>(1)

  const value = React.useMemo<CheckoutStepContextValue>(() => {
    return { currentStep, setCurrentStep }
  }, [currentStep])

  return <CheckoutStepContext.Provider value={value}>{children}</CheckoutStepContext.Provider>
}

export function useCheckoutStep() {
  const context = React.useContext(CheckoutStepContext)
  if (!context) {
    throw new Error("useCheckoutStep must be used within CheckoutStepProvider.")
  }
  return context
}

export type { CheckoutStep }

