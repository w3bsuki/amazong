/**
 * Normalize a human-readable attribute name into a stable key for:
 * - products.attributes JSONB keys
 * - URL query params (attr_{key})
 * - category_attributes.attribute_key (fallback)
 *
 * This should stay aligned with the database `normalize_attribute_key(name)` function.
 */
export function normalizeAttributeKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    // Remove parenthetical qualifiers (e.g. "Screen Size (inches)")
    .replaceAll(/\([^)]*\)/g, '')
    // Replace any non-alphanumeric sequences with underscores
    .replaceAll(/[^a-z0-9]+/g, '_')
    // Trim leading/trailing underscores
    .replaceAll(/^_+|_+$/g, '')
}

