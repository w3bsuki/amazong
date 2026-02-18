import { useTranslations } from "next-intl"
import { AttributesField } from "../fields/attributes-field"
import { BrandField } from "../fields/brand-field"
import { ConditionField } from "../fields/condition-field"
import { DescriptionField } from "../fields/description-field"
import { PhotosField } from "../fields/photos-field"
import { StepLayout } from "./step-layout"

export function StepDetails() {
  const tSell = useTranslations("Sell")

  return (
    <StepLayout
      title={tSell("steps.details.title")}
      description={tSell("steps.details.description")}
      contentClassName="space-y-5"
    >
      <ConditionField compact />
      <BrandField compact />
      <AttributesField compact />
      <DescriptionField compact idPrefix="sell-step-details" />
      <PhotosField compact maxPhotos={12} />
    </StepLayout>
  )
}

