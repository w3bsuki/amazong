import { NextResponse } from "next/server"
import { aiEnv } from "@/lib/ai/env"
import { getAiModel } from "@/lib/ai/providers"

export async function GET() {
  const chat = getAiModel("chat", { tags: ["healthcheck"] })
  const vision = getAiModel("vision", { tags: ["healthcheck"] })

  return NextResponse.json({
    gatewayConfigured: Boolean(aiEnv.gateway.apiKey),
    configured: {
      aiChatModel: aiEnv.gateway.chatModel,
      aiVisionModel: aiEnv.gateway.visionModel,
      googleModel: aiEnv.providers.googleModel,
      sendReasoning: aiEnv.flags.sendReasoning,
    },
    active: {
      chat: chat
        ? { label: chat.label, provider: chat.provider }
        : null,
      vision: vision
        ? { label: vision.label, provider: vision.provider }
        : null,
    },
    providerKeysPresent: {
      openai: Boolean(aiEnv.providers.openaiKey),
      google: Boolean(aiEnv.providers.googleKey),
      groq: Boolean(aiEnv.providers.groqKey),
    },
    providerSelection: {
      directProviderOrder: aiEnv.providers.directProviderOrder ?? null,
      disabled: aiEnv.providers.disable,
    },
  }, {
    headers: {
      // Treat as a live diagnostic endpoint.
      "Cache-Control": "no-store",
    },
  })
}
