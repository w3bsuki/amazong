import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

type ProductSupabaseClient = SupabaseClient<Database>

type CategoryRow = Pick<
  Database["public"]["Tables"]["categories"]["Row"],
  "id" | "name" | "slug" | "parent_id"
>

type ResolveContext = {
  title?: string | null | undefined
  description?: string | null | undefined
  tags?: string[] | null | undefined
  attributes?: Array<{ name?: string | null | undefined; value?: string | null | undefined }> | null | undefined
}

export type LeafCategoryResolution =
  | {
      ok: true
      categoryId: string
      wasAutoResolved: boolean
    }
  | {
      ok: false
      error: "CATEGORY_NOT_FOUND" | "LEAF_CATEGORY_REQUIRED"
      message: string
    }

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replaceAll(/[^\p{L}\p{N}\s-]+/gu, " ")
    .replaceAll(/[-_]+/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 2)
    .map((token) => {
      if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) {
        return token.slice(0, -1)
      }
      return token
    })
}

function buildSearchCorpus(context: ResolveContext): { normalized: string; tokens: Set<string> } {
  const parts: string[] = []

  if (context.title) parts.push(context.title)
  if (context.description) parts.push(context.description)
  if (Array.isArray(context.tags) && context.tags.length > 0) parts.push(context.tags.join(" "))
  if (Array.isArray(context.attributes) && context.attributes.length > 0) {
    for (const attr of context.attributes) {
      if (attr.name) parts.push(attr.name)
      if (attr.value) parts.push(attr.value)
    }
  }

  const normalized = normalizeText(parts.join(" ").trim())
  const tokens = new Set(tokenize(normalized))
  return { normalized, tokens }
}

function scoreCategoryMatch(params: {
  corpusText: string
  corpusTokens: Set<string>
  category: CategoryRow
}): number {
  const { corpusText, corpusTokens, category } = params
  const nameNorm = normalizeText(category.name)
  const slugNorm = normalizeText(category.slug)

  let score = 0

  if (nameNorm && corpusText.includes(nameNorm)) {
    score += 8
  }
  if (slugNorm && corpusText.includes(slugNorm)) {
    score += 6
  }

  const nameTokens = tokenize(category.name)
  const slugTokens = tokenize(category.slug)
  const uniqueTokens = new Set([...nameTokens, ...slugTokens])

  for (const token of uniqueTokens) {
    if (!token) continue
    if (corpusTokens.has(token)) {
      score += token.length >= 3 ? 2 : 1
    }
  }

  return score
}

function pickBestChild(params: {
  children: CategoryRow[]
  corpusText: string
  corpusTokens: Set<string>
}): CategoryRow | null {
  const { children, corpusText, corpusTokens } = params
  if (children.length === 0) return null
  if (children.length === 1) return children[0] ?? null

  const scored = children
    .map((child) => ({
      child,
      score: scoreCategoryMatch({ corpusText, corpusTokens, category: child }),
    }))
    .sort((a, b) => b.score - a.score)

  const best = scored[0]
  const second = scored[1]

  if (!best) return null
  if (best.score < 2) return null

  const gap = best.score - (second?.score ?? 0)
  if (best.score < 4 && gap < 2) return null

  return best.child
}

async function getCategoryById(
  supabase: ProductSupabaseClient,
  categoryId: string
): Promise<CategoryRow | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .eq("id", categoryId)
    .maybeSingle()

  if (error || !data) return null
  return data
}

async function getChildren(supabase: ProductSupabaseClient, parentId: string): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .eq("parent_id", parentId)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })

  if (error || !data) return []
  return data
}

export async function resolveLeafCategoryForListing(params: {
  supabase: ProductSupabaseClient
  selectedCategoryId: string | null | undefined
  context: ResolveContext
  maxTraversalDepth?: number
}): Promise<LeafCategoryResolution> {
  const { supabase, selectedCategoryId, context, maxTraversalDepth = 5 } = params

  if (!selectedCategoryId) {
    return {
      ok: false,
      error: "LEAF_CATEGORY_REQUIRED",
      message: "Please select a category",
    }
  }

  const selected = await getCategoryById(supabase, selectedCategoryId)
  if (!selected) {
    return {
      ok: false,
      error: "CATEGORY_NOT_FOUND",
      message: "Selected category does not exist",
    }
  }

  const initialChildren = await getChildren(supabase, selected.id)
  if (initialChildren.length === 0) {
    return { ok: true, categoryId: selected.id, wasAutoResolved: false }
  }

  const { normalized, tokens } = buildSearchCorpus(context)
  if (!normalized || tokens.size === 0) {
    return {
      ok: false,
      error: "LEAF_CATEGORY_REQUIRED",
      message: "Please select a more specific category (product type).",
    }
  }

  let current = selected
  let currentChildren = initialChildren
  let traversed = 0

  while (traversed < maxTraversalDepth && currentChildren.length > 0) {
    const bestChild = pickBestChild({
      children: currentChildren,
      corpusText: normalized,
      corpusTokens: tokens,
    })

    if (!bestChild) {
      return {
        ok: false,
        error: "LEAF_CATEGORY_REQUIRED",
        message: "Please select a more specific category (product type).",
      }
    }

    current = bestChild
    traversed += 1
    currentChildren = await getChildren(supabase, current.id)
  }

  if (currentChildren.length > 0) {
    return {
      ok: false,
      error: "LEAF_CATEGORY_REQUIRED",
      message: "Please select a more specific category (product type).",
    }
  }

  return {
    ok: true,
    categoryId: current.id,
    wasAutoResolved: current.id !== selected.id,
  }
}
