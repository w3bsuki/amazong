import { gateway } from "ai"
import { google } from "@ai-sdk/google"
import { createGroq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { aiEnv } from "@/lib/ai/env"

export type AiTask = "chat" | "vision"

export type AiModelContext = {
  model: any
  providerOptions?: any
  label: "gateway" | "direct"
  provider: "gateway" | "openai" | "google" | "groq"
}

type GatewayTracking = {
  userId?: string
  tags?: string[]
  fallbackModels?: string[]
}

function getGatewayProviderOptions(tracking: GatewayTracking): any {
  const gatewayOptions: any = {}
  if (tracking.userId) gatewayOptions.user = tracking.userId
  if (tracking.tags?.length) gatewayOptions.tags = tracking.tags
  if (tracking.fallbackModels?.length) gatewayOptions.models = tracking.fallbackModels
  return Object.keys(gatewayOptions).length ? { gateway: gatewayOptions } : undefined
}

export function getAiModel(task: AiTask, tracking?: GatewayTracking): AiModelContext | null {
  // Preferred path: Vercel AI Gateway when configured.
  if (aiEnv.gateway.apiKey) {
    if (task === "vision") {
      return {
        model: gateway(aiEnv.gateway.visionModel),
        providerOptions: getGatewayProviderOptions({
          ...tracking,
          tags: [...(tracking?.tags ?? []), "vision"],
          fallbackModels: tracking?.fallbackModels ?? ["openai/gpt-4o-mini"],
        }),
        label: "gateway",
        provider: "gateway",
      }
    }

    return {
      model: gateway(aiEnv.gateway.chatModel),
      providerOptions: getGatewayProviderOptions({
        ...tracking,
        tags: [...(tracking?.tags ?? []), "chat"],
        fallbackModels: tracking?.fallbackModels ?? ["anthropic/claude-haiku-4"],
      }),
      label: "gateway",
      provider: "gateway",
    }
  }

  // Fallback: direct providers.
  if (task === "chat") {
    const googleModelName = aiEnv.providers.googleModel

    const order = (aiEnv.providers.directProviderOrder
      ? aiEnv.providers.directProviderOrder.split(",").map((s) => s.trim()).filter(Boolean)
      : ["openai", "google", "groq"]) as Array<"openai" | "google" | "groq">

    const isEnabled = (p: "openai" | "google" | "groq") => {
      if (p === "openai") return !aiEnv.providers.disable.openai && Boolean(aiEnv.providers.openaiKey)
      if (p === "google") return !aiEnv.providers.disable.google && Boolean(aiEnv.providers.googleKey)
      return !aiEnv.providers.disable.groq && Boolean(aiEnv.providers.groqKey)
    }

    for (const provider of order) {
      if (!isEnabled(provider)) continue

      if (provider === "openai") {
        return { model: openai("gpt-4o-mini"), label: "direct", provider: "openai" }
      }

      if (provider === "google") {
        return { model: google(googleModelName), label: "direct", provider: "google" }
      }

      // groq
      const groq = createGroq({ apiKey: aiEnv.providers.groqKey! })
      return { model: groq("llama-3.3-70b-versatile"), label: "direct", provider: "groq" }
    }

    return null
  }

  // vision
  const googleModelName = aiEnv.providers.googleModel
  const model = aiEnv.providers.openaiKey
    ? openai("gpt-4o-mini")
    : aiEnv.providers.googleKey
      ? google(googleModelName)
      : null

  return model
    ? {
        model,
        label: "direct",
        provider: aiEnv.providers.openaiKey ? "openai" : "google",
      }
    : null
}
