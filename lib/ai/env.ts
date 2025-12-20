import "server-only"
import { z } from "zod"

const nonEmptyString = z.string().min(1)
const optionalNonEmptyString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  nonEmptyString.optional(),
)

const optionalBoolString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.enum(["true", "false"]).optional(),
)

function sanitizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

function sanitizeOptionalBoolString(value: unknown): "true" | "false" | undefined {
  const s = sanitizeOptionalString(value)
  if (!s) return undefined
  if (s === "true" || s === "false") return s
  return undefined
}

const envSchema = z.object({
  // Vercel AI Gateway (recommended)
  AI_GATEWAY_API_KEY: optionalNonEmptyString,
  AI_CHAT_MODEL: optionalNonEmptyString,
  AI_VISION_MODEL: optionalNonEmptyString,

  // Direct providers (fallbacks)
  OPENAI_API_KEY: optionalNonEmptyString,
  GOOGLE_GENERATIVE_AI_API_KEY: optionalNonEmptyString,
  GROQ_API_KEY: optionalNonEmptyString,

  // Optional provider-specific overrides
  GOOGLE_CHAT_MODEL: optionalNonEmptyString,
  GOOGLE_MODEL: optionalNonEmptyString,

  // Feature flags
  AI_SEND_REASONING: optionalBoolString,

  // Provider selection controls (direct providers only)
  // Example: "openai,groq" to prefer OpenAI then Groq, skipping Google.
  AI_DIRECT_PROVIDER_ORDER: optionalNonEmptyString,
  AI_DISABLE_GOOGLE: optionalBoolString,
  AI_DISABLE_OPENAI: optionalBoolString,
  AI_DISABLE_GROQ: optionalBoolString,
})

// Sanitize first so blank env vars behave like "unset".
// Also prevents a single invalid var from zeroing out the entire AI config.
const raw = {
  AI_GATEWAY_API_KEY: sanitizeOptionalString(process.env.AI_GATEWAY_API_KEY),
  AI_CHAT_MODEL: sanitizeOptionalString(process.env.AI_CHAT_MODEL),
  AI_VISION_MODEL: sanitizeOptionalString(process.env.AI_VISION_MODEL),

  OPENAI_API_KEY: sanitizeOptionalString(process.env.OPENAI_API_KEY),
  GOOGLE_GENERATIVE_AI_API_KEY: sanitizeOptionalString(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
  GROQ_API_KEY: sanitizeOptionalString(process.env.GROQ_API_KEY),

  GOOGLE_CHAT_MODEL: sanitizeOptionalString(process.env.GOOGLE_CHAT_MODEL),
  GOOGLE_MODEL: sanitizeOptionalString(process.env.GOOGLE_MODEL),

  AI_SEND_REASONING: sanitizeOptionalBoolString(process.env.AI_SEND_REASONING),

  AI_DIRECT_PROVIDER_ORDER: sanitizeOptionalString(process.env.AI_DIRECT_PROVIDER_ORDER),
  AI_DISABLE_GOOGLE: sanitizeOptionalBoolString(process.env.AI_DISABLE_GOOGLE),
  AI_DISABLE_OPENAI: sanitizeOptionalBoolString(process.env.AI_DISABLE_OPENAI),
  AI_DISABLE_GROQ: sanitizeOptionalBoolString(process.env.AI_DISABLE_GROQ),
} as const

const parsed = envSchema.safeParse(raw)

if (!parsed.success) {
  // Avoid dumping env values; only print the validation issues.
  console.error("Invalid environment configuration:", parsed.error.issues)
}

// If validation fails, still return the sanitized values so we don't
// accidentally report "no provider configured" when keys are present.
const effective = (parsed.success ? parsed.data : raw) as z.infer<typeof envSchema>

export const aiEnv = {
  gateway: {
    apiKey: effective.AI_GATEWAY_API_KEY,
    chatModel: effective.AI_CHAT_MODEL ?? "openai/gpt-4o-mini",
    visionModel: effective.AI_VISION_MODEL ?? "google/gemini-2.0-flash",
  },
  providers: {
    openaiKey: effective.OPENAI_API_KEY,
    googleKey: effective.GOOGLE_GENERATIVE_AI_API_KEY,
    groqKey: effective.GROQ_API_KEY,
    googleModel: effective.GOOGLE_CHAT_MODEL ?? effective.GOOGLE_MODEL ?? "gemini-2.0-flash",
    directProviderOrder: effective.AI_DIRECT_PROVIDER_ORDER,
    disable: {
      openai: effective.AI_DISABLE_OPENAI === "true",
      google: effective.AI_DISABLE_GOOGLE === "true",
      groq: effective.AI_DISABLE_GROQ === "true",
    },
  },
  flags: {
    sendReasoning: effective.AI_SEND_REASONING === "true",
  },
} as const
