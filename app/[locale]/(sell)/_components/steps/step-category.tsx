import { useTranslations } from "next-intl"
import { AttributesField } from "../fields/attributes-field"
import { BrandField } from "../fields/brand-field"
import { CategoryField } from "../fields/category-field"
import { StepLayout } from "./step-layout"

// ============================================================================
// STEP 2: CATEGORY - Full-screen category picker
// Category determines ALL subsequent fields.
// User picks: Electronics → Mobile → iPhone → attributes load.
// ============================================================================

export function StepCategory() {
  const tSell = useTranslations("Sell")

  return (
    <StepLayout
      title={tSell("steps.category.title")}
      description={tSell("steps.category.description")}
      contentClassName="space-y-5"
    >
      <CategoryField compact />
      <BrandField compact />
      <AttributesField compact />
    </StepLayout>
  )
}
