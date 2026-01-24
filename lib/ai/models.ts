import { createGateway } from "ai"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"

import {
  getAiChatModelSpec,
  getAiGatewayApiKey,
  getAiVisionModelSpec,
  parseAiModelSpec,
} from "@/lib/ai/env"

let cachedGateway: ReturnType<typeof createGateway> | undefined

function getGatewayClient(): ReturnType<typeof createGateway> {
  if (cachedGateway) return cachedGateway

  const apiKey = getAiGatewayApiKey()
  if (!apiKey) {
    throw new Error("Missing AI_GATEWAY_API_KEY")
  }

  cachedGateway = createGateway({ apiKey })
  return cachedGateway
}

export function getAiChatModel() {
  const gatewayKey = getAiGatewayApiKey()
  const spec = getAiChatModelSpec()

  if (gatewayKey) {
    return getGatewayClient()(spec)
  }

  const { provider, modelId } = parseAiModelSpec(spec)
  if (provider === "google") return google(modelId)
  if (provider === "openai") return openai(modelId)

  throw new Error(`AI_CHAT_MODEL provider "${provider}" requires AI_GATEWAY_API_KEY`)
}

export function getAiVisionModel() {
  const gatewayKey = getAiGatewayApiKey()
  const spec = getAiVisionModelSpec()

  if (gatewayKey) {
    return getGatewayClient()(spec)
  }

  const { provider, modelId } = parseAiModelSpec(spec)
  if (provider === "google") return google(modelId)
  if (provider === "openai") return openai(modelId)

  throw new Error(`AI_VISION_MODEL provider "${provider}" requires AI_GATEWAY_API_KEY`)
}

