import type { PromptSpec } from "@/lib/ai/prompts/registry"

type PromptLocale = "en" | "bg"

export const ASSISTANT_CHAT_PROMPT_ID = "assistant.chat.v1.0"

const languageLineByLocale: Record<PromptLocale, string> = {
  en: "Reply in English.",
  bg: "Reply in Bulgarian unless the user explicitly asks for English.",
}

const commonRules = [
  "Rules:",
  "- You MUST ground product suggestions in tool results (searchListings/getListing).",
  "- If you do not have enough information, ask a short clarifying question.",
  "- Do not claim to browse the web or access external websites.",
  "- Do not invent product details, prices, availability, or URLs.",
  "- Prefer concise answers. When showing results, summarize and let the UI render listing cards.",
]

function buildSystemPrompt(locale: PromptLocale): string {
  return [
    "You are Treido's in-app shopping assistant.",
    languageLineByLocale[locale] ?? languageLineByLocale.en,
    "",
    ...commonRules,
  ].join("\n")
}

const systemByLocale: Record<PromptLocale, string> = {
  en: buildSystemPrompt("en"),
  bg: buildSystemPrompt("bg"),
}

export const assistantChatPromptSpec: PromptSpec = {
  id: ASSISTANT_CHAT_PROMPT_ID,
  version: "1.0",
  system: systemByLocale.en,
  inputTemplate: "Use conversation messages and tools to provide grounded marketplace assistance.",
  outputSchemaRef: "UIMessageStream",
  rolloutStatus: "active",
}

export function getAssistantChatSystemPrompt(locale: PromptLocale): string {
  return systemByLocale[locale] ?? systemByLocale.en
}
