import { useCallback } from "react"
import { useTranslations } from "next-intl"
import type { CategoryPathItem } from "../../_lib/types"
import { CategoryField } from "../fields/category-field"
import { useSellFormContext } from "../sell-form-provider"
import { StepLayout } from "./step-layout"

// ============================================================================
// STEP 2: CATEGORY - Full-screen category picker
// Category determines ALL subsequent fields.
// User picks: Electronics → Mobile → iPhone → attributes load.
// ============================================================================

export function StepCategory() {
  const { setCurrentStep } = useSellFormContext()
  const tSell = useTranslations("Sell")

  const handleCategoryChange = useCallback(
    (categoryId: string, path: CategoryPathItem[]) => {
      if (!categoryId || path.length === 0) return

      // Small delay to show the selection before advancing.
      window.setTimeout(() => setCurrentStep(3), 300)
    },
    [setCurrentStep]
  )

  return (
    <StepLayout
      title={tSell("steps.category.title")}
      description={tSell("steps.category.description")}
      contentClassName="space-y-5"
    >
      <CategoryField compact onCategoryChange={handleCategoryChange} />
    </StepLayout>
  )
}
