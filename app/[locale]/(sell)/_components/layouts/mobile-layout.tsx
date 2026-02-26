"use client"

import { useCallback, useMemo } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import type { FieldErrors } from "react-hook-form"

import type { SellFormDataV4 } from "@/lib/sell/schema"

import { useSellForm, useSellFormContext } from "../sell-form-provider"
import { StepCategory } from "../steps/step-category"
import { StepDetails } from "../steps/step-details"
import { StepPhotos } from "../steps/step-photos"
import { StepPricing } from "../steps/step-pricing"
import { StepReview } from "../steps/step-review"
import { StepperWrapper } from "./stepper-wrapper"

// ============================================================================
// MOBILE LAYOUT - Premium 5-step wizard with Framer Motion animations
// New flow: Photos → Details → Category → Pricing → Review
// Following the PLAN-sell-form-masterpiece.md spec
// ============================================================================

// Step configuration for mobile wizard (5-step flow)
// 1) Photos: upload + reorder + cover photo
// 2) Details: title + description + condition
// 3) Category: hierarchical picker (+ optional specifics)
// 4) Pricing: price + shipping + location
// 5) Review: summary + publish
const MOBILE_STEPS = [
  { id: 1, fields: ["images"] },
  { id: 2, fields: ["title", "description", "condition"] },
  { id: 3, fields: ["categoryId", "brandId", "brandName", "attributes"] },
  {
    id: 4,
    fields: [
      "format",
      "price",
      "compareAtPrice",
      "quantity",
      "shippingPrice",
      "sellerCity",
      "shipsToBulgaria",
      "shipsToUK",
      "shipsToEurope",
      "shipsToUSA",
      "shipsToWorldwide",
      "pickupOnly",
      "freeShipping",
    ],
  },
  { id: 5, fields: [] },
]

const FIELD_STEP_INDEX = Object.fromEntries(
  MOBILE_STEPS.flatMap((step) => step.fields.map((field) => [field, step.id]))
)
const ORDERED_FIELDS = MOBILE_STEPS.flatMap((step) => step.fields)

function findFirstErrorMessage(value: unknown): string | undefined {
  if (!value) return undefined

  if (typeof value === "object") {
    if ("message" in value && typeof (value as { message?: unknown }).message === "string") {
      return (value as { message: string }).message
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const message = findFirstErrorMessage(item)
        if (message) return message
      }
      return undefined
    }

    for (const nested of Object.values(value as Record<string, unknown>)) {
      const message = findFirstErrorMessage(nested)
      if (message) return message
    }
  }

  return undefined
}

interface MobileLayoutProps {
  onSubmit: (data: SellFormDataV4) => void
  isSubmitting?: boolean
}

export function MobileLayout({ onSubmit, isSubmitting = false }: MobileLayoutProps) {
  const form = useSellForm()
  const { currentStep, setCurrentStep } = useSellFormContext()
  const tSell = useTranslations("Sell")

  const getTranslatedError = useCallback((message: string | undefined) => {
    if (!message) return null
    try {
      return tSell(message as never)
    } catch {
      return message
    }
  }, [tSell])

  const orderedFields = useMemo(() => ORDERED_FIELDS, [])

  const handleSubmit = useCallback(() => {
    form.handleSubmit((data) => onSubmit(data), (errors: FieldErrors<SellFormDataV4>) => {
      const errorsRecord = errors as unknown as Record<string, unknown>

      const firstError =
        orderedFields.find((field) => Boolean(errorsRecord[field])) ?? Object.keys(errorsRecord)[0]
      if (!firstError) return

      const rawMessage = findFirstErrorMessage(errorsRecord[firstError])
      const translatedMessage = getTranslatedError(rawMessage) ?? tSell("errors.fixHighlighted")
      toast.error(translatedMessage)

      const targetStep = FIELD_STEP_INDEX[firstError] ?? 1
      setCurrentStep(targetStep)

      if (firstError !== "images") {
        requestAnimationFrame(() => {
          try {
            form.setFocus(firstError as never)
          } catch {
            // Best-effort focus only; some steps use custom UI without a focusable input.
          }
        })
      }
    })()
  }, [form, getTranslatedError, onSubmit, orderedFields, setCurrentStep, tSell])

  const handleNext = useCallback(async () => {
    const stepFields = MOBILE_STEPS[currentStep - 1]?.fields ?? []
    const ok = stepFields.length > 0
      ? await form.trigger(stepFields as never, { shouldFocus: true })
      : true

    if (!ok) {
      const errors = form.formState.errors as unknown as Record<string, unknown>
      const firstWithError = stepFields.find((field) => Boolean(errors[field]))
      const rawMessage = firstWithError ? findFirstErrorMessage(errors[firstWithError]) : undefined
      const translatedMessage = getTranslatedError(rawMessage)
        ?? tSell("errors.fixHighlighted")
      toast.error(translatedMessage)
      return
    }

    if (currentStep < MOBILE_STEPS.length) setCurrentStep(currentStep + 1)
  }, [currentStep, form, getTranslatedError, setCurrentStep, tSell])

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepPhotos />
      case 2:
        return <StepDetails />
      case 3:
        return <StepCategory />
      case 4:
        return <StepPricing />
      case 5:
        return <StepReview />
      default:
        return null
    }
  }

  return (
    <StepperWrapper 
      steps={MOBILE_STEPS} 
      onSubmit={handleSubmit} 
      onNext={handleNext}
      isSubmitting={isSubmitting}
      isNextDisabled={false}
      isSubmitDisabled={false}
    >
      {renderStepContent()}
    </StepperWrapper>
  )
}
