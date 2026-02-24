import { getCategoryHierarchy } from "@/lib/data/categories"
import { createStaticClient } from "@/lib/supabase/server"
import { toCategoryPolicy } from "@/lib/sell/category-policy"
import type { Category } from "../../_lib/types"

interface QueryResult {
  data: unknown
  error: unknown
}

function isMissingColumnError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false
  const record = error as Record<string, unknown>
  return record.code === "42703"
}

function collectCategoryIds(categories: Category[]): string[] {
  const ids: string[] = []
  const stack = [...categories]
  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) continue
    ids.push(current.id)
    if (current.children?.length) {
      for (const child of current.children) stack.push(child)
    }
  }
  return ids
}

async function queryCategoryPolicies(
  supabase: ReturnType<typeof createStaticClient>,
  selectClause: string,
  categoryIds: string[],
): Promise<QueryResult> {
  return (await (supabase
    .from("categories")
    .select(selectClause)
    .in("id", categoryIds) as unknown as Promise<QueryResult>))
}

function toObjectRows(data: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(data)) return []
  return data.filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
}

async function fetchPolicyRows(categoryIds: string[]): Promise<Array<Record<string, unknown>>> {
  if (categoryIds.length === 0) return []

  const supabase = createStaticClient()
  if (!supabase) return []

  const withPricingSelect = [
    "id",
    "allowed_listing_kinds",
    "allowed_transaction_modes",
    "allowed_fulfillment_modes",
    "allowed_pricing_modes",
    "default_fulfillment_mode",
  ].join(",")

  const withoutPricingSelect = [
    "id",
    "allowed_listing_kinds",
    "allowed_transaction_modes",
    "allowed_fulfillment_modes",
    "default_fulfillment_mode",
  ].join(",")

  let { data, error } = await queryCategoryPolicies(supabase, withPricingSelect, categoryIds)

  if (error && isMissingColumnError(error)) {
    ;({ data, error } = await queryCategoryPolicies(supabase, withoutPricingSelect, categoryIds))
  }

  if (error && isMissingColumnError(error)) {
    ;({ data, error } = await queryCategoryPolicies(supabase, "id", categoryIds))
  }

  if (error) return []
  return toObjectRows(data)
}

function applyPolicies(categories: Category[], rows: Array<Record<string, unknown>>): Category[] {
  const policyById = new Map<string, ReturnType<typeof toCategoryPolicy>>()

  for (const row of rows) {
    const id = typeof row.id === "string" ? row.id : null
    if (!id) continue
    policyById.set(
      id,
      toCategoryPolicy({
        allowed_listing_kinds: row.allowed_listing_kinds,
        allowed_transaction_modes: row.allowed_transaction_modes,
        allowed_fulfillment_modes: row.allowed_fulfillment_modes,
        allowed_pricing_modes: row.allowed_pricing_modes,
        default_fulfillment_mode: row.default_fulfillment_mode,
      }),
    )
  }

  const walk = (nodes: Category[]): Category[] =>
    nodes.map((node) => {
      const policy = policyById.get(node.id) ?? toCategoryPolicy(null)
      return {
        ...node,
        allowed_listing_kinds: policy.allowedListingKinds,
        allowed_transaction_modes: policy.allowedTransactionModes,
        allowed_fulfillment_modes: policy.allowedFulfillmentModes,
        allowed_pricing_modes: policy.allowedPricingModes,
        default_fulfillment_mode: policy.defaultFulfillmentMode,
        children: node.children?.length ? walk(node.children) : [],
      }
    })

  return walk(categories)
}

export async function getSellCategories(): Promise<Category[]> {
  // Strict 2-level tree for v2 category architecture.
  const categories = (await getCategoryHierarchy(null, 1)) as Category[]
  const categoryIds = collectCategoryIds(categories)
  const policyRows = await fetchPolicyRows(categoryIds)
  return applyPolicies(categories, policyRows)
}
