export function isUnauthenticatedRefreshError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false

  const record = error as { status?: unknown; code?: unknown; message?: unknown }
  if (typeof record.status === "number" && record.status === 401) return true
  if (typeof record.code === "string" && record.code === "401") return true

  if (typeof record.message === "string") {
    const message = record.message.toLowerCase()
    if (
      message.includes("jwt") &&
      (message.includes("required") ||
        message.includes("missing") ||
        message.includes("expired") ||
        message.includes("invalid"))
    ) {
      return true
    }
    if (message.includes("auth session") && message.includes("missing")) return true
    if (message.includes("unauthorized")) return true
  }

  return false
}

