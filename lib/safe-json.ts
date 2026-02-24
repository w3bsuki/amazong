export function safeJsonParseUnknown(input?: string | null): unknown | undefined {
  if (!input) return undefined
  try {
    return JSON.parse(input)
  } catch {
    return undefined
  }
}

export function safeJsonParse<T>(input?: string | null): T | undefined {
  return safeJsonParseUnknown(input) as T | undefined
}
