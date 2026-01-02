const isDev = process.env.NODE_ENV === "development"

export const logger = {
  debug: (message: string, meta?: unknown) => {
    if (isDev) {
       
      console.debug(`[DEBUG] ${message}`, meta ?? "")
    }
  },
  info: (message: string, meta?: unknown) => {
     
    console.info(`[INFO] ${message}`, meta ?? "")
  },
  warn: (message: string, meta?: unknown) => {
     
    console.warn(`[WARN] ${message}`, meta ?? "")
  },
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
     
    console.error(`[ERROR] ${message}`, {
      error,
      ...(meta ?? {}),
    })
  },
}
