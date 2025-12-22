export type SearchParamValue = string | string[] | undefined

export type SearchParamRecord = Record<string, SearchParamValue>

export function extractAttributeFilters(searchParams: SearchParamRecord): Record<string, string | string[]> {
  const attributeFilters: Record<string, string | string[]> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    if (key.startsWith("attr_") && value) {
      const attrName = key.replace("attr_", "")
      attributeFilters[attrName] = value
    }
  }

  return attributeFilters
}
