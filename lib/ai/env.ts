type AiProvider = "google" | "openai" | "groq" | "gateway"

function getEnv(key: string): string | undefined {
  const value = process.env[key]
  return value && value.trim() ? value.trim() : undefined
}

function getBooleanEnv(key: string, fallback: boolean): boolean {
  const raw = getEnv(key)
  if (!raw) return fallback
  return raw === "1" || raw.toLowerCase() === "true" || raw.toLowerCase() === "yes"
}

export function isAiAssistantEnabled(): boolean {
  return getBooleanEnv("AI_ASSISTANT_ENABLED", false)
}

export function getAiGatewayApiKey(): string | undefined {
  return getEnv("AI_GATEWAY_API_KEY")
}

export function getGroqApiKey(): string | undefined {
  return getEnv("GROQ_API_KEY")
}

export function getAiChatModelSpec(): string {
  return getEnv("AI_CHAT_MODEL") ?? "google/gemini-2.0-flash-lite"
}

export function getAiFallbackModelSpec(): string {
  return getEnv("AI_FALLBACK_MODEL") ?? "groq/llama-3.3-70b-versatile"
}

export function getAiVisionModelSpec(): string {
  return getEnv("AI_VISION_MODEL") ?? "google/gemini-2.0-flash-lite"
}

export function parseAiModelSpec(spec: string): { provider: AiProvider; modelId: string } {
  const trimmed = spec.trim()
  const firstSlash = trimmed.indexOf("/")
  if (firstSlash <= 0 || firstSlash === trimmed.length - 1) {
    throw new Error(
      `Invalid AI model spec: "${spec}". Expected "<provider>/<modelId>" e.g. "google/gemini-2.0-flash-lite".`,
    )
  }

  const provider = trimmed.slice(0, firstSlash) as AiProvider
  const modelId = trimmed.slice(firstSlash + 1)

  if (provider !== "google" && provider !== "openai" && provider !== "groq" && provider !== "gateway") {
    throw new Error(`Unsupported AI provider "${provider}". Supported: google, openai, groq, gateway.`)
  }

  return { provider, modelId }
}

