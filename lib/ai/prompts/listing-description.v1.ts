import type { PromptSpec } from "@/lib/ai/prompts/registry"

type PromptLocale = "en" | "bg"

export const LISTING_DESCRIPTION_PROMPT_ID = "listing.description.v1.0"

const systemByLocale: Record<PromptLocale, string> = {
  en: [
    "You generate marketplace listing copy from structured product attributes.",
    "Return clear, concrete, conversion-oriented text.",
    "Never invent unverifiable facts and avoid personal data.",
  ].join("\n"),
  bg: [
    "Генерираш текст за обява в marketplace от структурирани продуктови атрибути.",
    "Връщай ясен, конкретен и ориентиран към конверсия текст.",
    "Не измисляй непроверими факти и избягвай лични данни.",
  ].join("\n"),
}

const inputTemplateByLocale: Record<PromptLocale, string> = {
  en: "Generate a concise listing title, a helpful description, and 3-8 relevant tags from the provided listing attributes.",
  bg: "Генерирай кратко заглавие, полезно описание и 3-8 релевантни тага на база предоставените атрибути за обявата.",
}

export const listingDescriptionPromptSpec: PromptSpec = {
  id: LISTING_DESCRIPTION_PROMPT_ID,
  version: "1.0",
  system: systemByLocale.en,
  inputTemplate: inputTemplateByLocale.en,
  outputSchemaRef: "ListingTextGenerationSchema",
  rolloutStatus: "active",
}

export function getListingDescriptionPrompt(locale: PromptLocale): {
  system: string
  inputTemplate: string
} {
  return {
    system: systemByLocale[locale] ?? systemByLocale.en,
    inputTemplate: inputTemplateByLocale[locale] ?? inputTemplateByLocale.en,
  }
}
