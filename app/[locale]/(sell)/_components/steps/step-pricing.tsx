import { useTranslations } from "next-intl"
import { PricingField } from "../fields/pricing-field"
import { ShippingField } from "../fields/shipping-field"
import { useSellForm } from "../sell-form-provider"
import { StepLayout } from "./step-layout"

export function StepPricing() {
  const tSell = useTranslations("Sell")
  const { watch } = useSellForm()

  const categoryId = watch("categoryId")

  return (
    <StepLayout
      title={tSell("steps.pricing.title")}
      description={tSell("steps.pricing.description")}
      contentClassName="space-y-5"
    >
      <PricingField
        compact
        idPrefix="sell-step-pricing"
        {...(categoryId ? { categoryId } : {})}
      />
      <ShippingField compact />
    </StepLayout>
  )
}
