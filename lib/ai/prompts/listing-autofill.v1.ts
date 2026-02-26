import type { PromptSpec } from "@/lib/ai/prompts/registry"

type PromptLocale = "en" | "bg"

export const LISTING_AUTOFILL_PROMPT_ID = "listing.autofill.v1.0"

const systemByLocale: Record<PromptLocale, string> = {
  en: "You generate structured listing drafts from images. Return only fields you are confident about. Keep text concise.",
  bg: "Генерираш структурирани чернови за обяви от снимки. Връщай само полета, за които имаш увереност. Поддържай текста кратък.",
}

const inputTemplateByLocale: Record<PromptLocale, string> = {
  en: "Analyze the product photo and return a draft for listing fields: title, description, condition, brand (if visible), category hint, tags, and a rough price suggestion. Do not guess specific brand/model if not visible.",
  bg: "Анализирай снимката на продукта и върни чернова за полетата за обява: заглавие, описание, състояние, марка (ако се вижда), подсказка за категория, тагове и примерна цена. Не измисляй конкретен модел/марка ако не е видимо.",
}

export const listingAutofillPromptSpec: PromptSpec = {
  id: LISTING_AUTOFILL_PROMPT_ID,
  version: "1.0",
  system: systemByLocale.en,
  inputTemplate: inputTemplateByLocale.en,
  outputSchemaRef: "SellAutofillDraftSchema",
  rolloutStatus: "active",
}

export function getListingAutofillPrompt(locale: PromptLocale): {
  system: string
  inputTemplate: string
} {
  return {
    system: systemByLocale[locale] ?? systemByLocale.en,
    inputTemplate: inputTemplateByLocale[locale] ?? inputTemplateByLocale.en,
  }
}
