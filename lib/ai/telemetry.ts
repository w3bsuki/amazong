import "server-only"

import { logger } from "@/lib/logger"

export type AiResponseMeta = {
  prompt_version: string
  model_route: string
  latency_ms: number
  cost_estimate?: number
  success: boolean
  error?: string
}

type AiTelemetryOptions = {
  featureId: string
  promptVersion: string
  modelRoute: string
}

export class AiTelemetryWrappedError extends Error {
  readonly meta: AiResponseMeta

  constructor(message: string, meta: AiResponseMeta, cause: unknown) {
    super(message)
    this.name = "AiTelemetryWrappedError"
    this.meta = meta
    ;(this as Error & { cause?: unknown }).cause = cause
  }
}

export async function aiTelemetryWrap<T>(
  opts: AiTelemetryOptions,
  fn: () => Promise<T>,
): Promise<{ result: T; meta: AiResponseMeta }> {
  const startedAt = Date.now()

  try {
    const result = await fn()
    const meta: AiResponseMeta = {
      prompt_version: opts.promptVersion,
      model_route: opts.modelRoute,
      latency_ms: Date.now() - startedAt,
      success: true,
    }

    logger.info("[AI Telemetry] call success", {
      feature_id: opts.featureId,
      ...meta,
    })

    return { result, meta }
  } catch (error) {
    const meta: AiResponseMeta = {
      prompt_version: opts.promptVersion,
      model_route: opts.modelRoute,
      latency_ms: Date.now() - startedAt,
      success: false,
      error: error instanceof Error ? error.message : "Unknown AI error",
    }

    logger.error("[AI Telemetry] call failure", error, {
      feature_id: opts.featureId,
      ...meta,
    })

    throw new AiTelemetryWrappedError(meta.error ?? "AI call failed", meta, error)
  }
}
