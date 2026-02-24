const SEARCH_TOKEN_SPLIT_PATTERN = /[\s,()]+/
const MAX_SEARCH_TOKENS = 8

function dedupeTokens(tokens: string[]): string[] {
  const seen = new Set<string>()
  const unique: string[] = []

  for (const token of tokens) {
    const normalized = token.toLowerCase()
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    unique.push(token)
  }

  return unique
}

export function tokenizeSearchQuery(query: string): string[] {
  const normalized = query.normalize("NFKC").trim()
  if (!normalized) return []

  const tokens = normalized
    .split(SEARCH_TOKEN_SPLIT_PATTERN)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)

  return dedupeTokens(tokens).slice(0, MAX_SEARCH_TOKENS)
}

export function normalizeSearchQuery(query: string): string {
  return tokenizeSearchQuery(query).join(" ")
}

export function buildTokenizedIlikeOrFilter(query: string, columns: readonly string[]): string | null {
  const tokens = tokenizeSearchQuery(query)
  if (tokens.length === 0 || columns.length === 0) return null

  const clauses: string[] = []

  for (const token of tokens) {
    for (const column of columns) {
      clauses.push(`${column}.ilike.%${token}%`)
    }
  }

  return clauses.length > 0 ? clauses.join(",") : null
}
