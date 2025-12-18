export function safeJsonParse<T>(input: string | null | undefined): T | undefined {
  if (!input) return undefined;
  try {
    return JSON.parse(input) as T;
  } catch {
    return undefined;
  }
}
