import { createGateway } from "ai"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { groq } from "@ai-sdk/groq"

import {
  getAiChatModelSpec,
  getAiFallbackModelSpec,
  getAiGatewayApiKey,
  getAiVisionModelSpec,
  getGroqApiKey,
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

function getModelFromSpec(spec: string) {
  const gatewayKey = getAiGatewayApiKey()
  if (gatewayKey) {
    return getGatewayClient()(spec)
  }

  const { provider, modelId } = parseAiModelSpec(spec)
  if (provider === "google") return google(modelId)
  if (provider === "openai") return openai(modelId)
  if (provider === "groq") {
    if (!getGroqApiKey()) {
      throw new Error("GROQ_API_KEY is required for groq provider")
    }
    return groq(modelId)
  }

  throw new Error(`Provider "${provider}" requires AI_GATEWAY_API_KEY`)
}

export function getAiChatModel() {
  return getModelFromSpec(getAiChatModelSpec())
}

export function getAiFallbackModel() {
  return getModelFromSpec(getAiFallbackModelSpec())
}

export function getAiVisionModel() {
  return getModelFromSpec(getAiVisionModelSpec())
}

