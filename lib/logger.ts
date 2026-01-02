const isDev = process.env.NODE_ENV === "development"

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, meta ?? "")
    }
  },
  info: (message: string, meta?: unknown) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, meta ?? "")
  },
  warn: (message: string, meta?: unknown) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, meta ?? "")
  },
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, {
      error,
      ...(meta ?? {}),
    })
  },
}
