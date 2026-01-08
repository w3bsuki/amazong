export function isNextPrerenderInterrupted(error: unknown): error is { digest: string } {
  if (!error || typeof error !== "object") return false
  return "digest" in error && (error as { digest?: unknown }).digest === "NEXT_PRERENDER_INTERRUPTED"
}
