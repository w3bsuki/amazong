import { logError, logEvent } from "@/lib/structured-log"

const isDev = process.env.NODE_ENV === "development"

function wrapMeta(meta: unknown): Record<string, unknown> | undefined {
  if (meta === undefined) return undefined
  return { data: meta }
}

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (!isDev) return
    logEvent("info", message, { debug: true, ...(wrapMeta(meta) ?? {}) })
  },
  info: (message: string, meta?: unknown) => {
    logEvent("info", message, wrapMeta(meta))
  },
  warn: (message: string, meta?: unknown) => {
    logEvent("warn", message, wrapMeta(meta))
  },
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
    if (error == null) {
      logEvent("error", message, meta)
      return
    }
    logError(message, error, meta)
  },
}
