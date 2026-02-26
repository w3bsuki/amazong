import { useTranslations } from "next-intl"
import { ConditionField } from "../fields/condition-field"
import { DescriptionField } from "../fields/description-field"
import { TitleField } from "../fields/title-field"
import { AiListingTextGenerator } from "../ai/ai-listing-text-generator"
import { StepLayout } from "./step-layout"

export function StepDetails() {
  const tSell = useTranslations("Sell")

  return (
    <StepLayout
      title={tSell("steps.details.title")}
      description={tSell("steps.details.description")}
      contentClassName="space-y-5"
    >
      <TitleField compact idPrefix="sell-step-details" />
      <AiListingTextGenerator />
      <DescriptionField compact idPrefix="sell-step-details" />
      <ConditionField compact />
    </StepLayout>
  )
}

