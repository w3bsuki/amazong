import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// =============================================================================
// Cache Revalidation Webhook API (Next.js 16+)
// =============================================================================
// This endpoint allows external services (Supabase webhooks, CMS, admin tools)
// to trigger cache invalidation for specific tags.
//
// Security: Requires REVALIDATION_SECRET environment variable.
// Usage: POST /api/revalidate with JSON body { tag: 'categories', secret: '...' }
// =============================================================================

type SupabaseWebhookEvent = {
  type?: 'INSERT' | 'UPDATE' | 'DELETE'
  table?: string
  schema?: string
  record?: Record<string, unknown> | null
  old_record?: Record<string, unknown> | null
}

type RevalidateScope =
  | {
      scope: 'categories'
      categorySlug?: string
      parentId?: string
      previousCategorySlug?: string
      previousParentId?: string
    }
  | {
      scope: 'attributes'
      categoryId?: string
      previousCategoryId?: string
    }

interface RevalidateRequest {
  secret: string

  // Raw tags (backward compatible)
  tag?: string
  tags?: string[]

  // Higher-level invalidation helpers
  scope?: RevalidateScope['scope']
  categorySlug?: string
  parentId?: string
  previousCategorySlug?: string
  previousParentId?: string
  categoryId?: string
  previousCategoryId?: string

  // Supabase Database Webhooks payload (optional)
  supabase?: SupabaseWebhookEvent
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function collectTagsForRequest(body: RevalidateRequest): string[] {
  const out = new Set<string>()

  if (body.tag) out.add(body.tag)
  if (body.tags && body.tags.length > 0) {
    for (const t of body.tags) {
      if (typeof t === 'string' && t.length > 0) out.add(t)
    }
  }

  if (body.scope === 'categories') {
    out.add('categories:tree')
    out.add('categories:sell')
    out.add('categories:sell:depth:3')

    const categorySlug = asString(body.categorySlug)
    const previousCategorySlug = asString(body.previousCategorySlug)
    const parentId = asString(body.parentId)
    const previousParentId = asString(body.previousParentId)

    if (categorySlug) out.add(`category:${categorySlug}`)
    if (previousCategorySlug) out.add(`category:${previousCategorySlug}`)

    if (parentId) out.add(`category-children:${parentId}`)
    if (previousParentId) out.add(`category-children:${previousParentId}`)
  }

  if (body.scope === 'attributes') {
    const categoryId = asString(body.categoryId)
    const previousCategoryId = asString(body.previousCategoryId)

    if (categoryId) out.add(`attrs:category:${categoryId}`)
    if (previousCategoryId) out.add(`attrs:category:${previousCategoryId}`)
  }

  const supabase = body.supabase
  if (supabase?.table === 'categories') {
    out.add('categories:tree')
    out.add('categories:sell')
    out.add('categories:sell:depth:3')
    const rec: Record<string, unknown> = supabase.record ?? {}
    const old: Record<string, unknown> = supabase.old_record ?? {}

    const slug = asString(rec["slug"])
    const oldSlug = asString(old["slug"])
    const parentId = asString(rec["parent_id"])
    const oldParentId = asString(old["parent_id"])

    if (slug) out.add(`category:${slug}`)
    if (oldSlug) out.add(`category:${oldSlug}`)
    if (parentId) out.add(`category-children:${parentId}`)
    if (oldParentId) out.add(`category-children:${oldParentId}`)
  }

  if (supabase?.table === 'category_attributes') {
    const rec: Record<string, unknown> = supabase.record ?? {}
    const old: Record<string, unknown> = supabase.old_record ?? {}

    const categoryId = asString(rec["category_id"])
    const oldCategoryId = asString(old["category_id"])

    if (categoryId) out.add(`attrs:category:${categoryId}`)
    if (oldCategoryId) out.add(`attrs:category:${oldCategoryId}`)
  }

  return Array.from(out)
}

/**
 * POST /api/revalidate
 * Revalidate cache tags via webhook
 * 
 * @body {string} secret - REVALIDATION_SECRET for authentication
 * @body {string} tag - Single cache tag to revalidate
 * @body {string[]} tags - Multiple cache tags to revalidate
 * 
 * @example
 * // Revalidate single tag
 * curl -X POST https://example.com/api/revalidate \
 *   -H "Content-Type: application/json" \
 *   -d '{"tag": "categories", "secret": "your-secret"}'
 * 
 * // Revalidate multiple tags
 * curl -X POST https://example.com/api/revalidate \
 *   -H "Content-Type: application/json" \
 *   -d '{"tags": ["categories", "products"], "secret": "your-secret"}'
 */
export async function POST(request: NextRequest) {
  try {
    const body: RevalidateRequest = await request.json()
    const { secret } = body
    
    // Validate webhook secret
    if (!process.env.REVALIDATION_SECRET) {
      logger.error('[revalidate] REVALIDATION_SECRET not configured')
      return NextResponse.json(
        { error: 'Server misconfigured: revalidation secret not set' },
        { status: 500 }
      )
    }
    
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }
    
    const tagsToRevalidate = collectTagsForRequest(body)
    if (tagsToRevalidate.length === 0) {
      return NextResponse.json(
        { error: 'No tags resolved. Provide tag/tags, scope fields, or a supabase webhook payload.' },
        { status: 400 }
      )
    }
    
    const revalidatedTags: string[] = []
    const failedTags: string[] = []
    
    for (const t of tagsToRevalidate) {
      try {
        revalidateTag(t, 'max')
        revalidatedTags.push(t)
      } catch (error) {
        logger.error('[revalidate] Failed to revalidate tag', error, { tag: t })
        failedTags.push(t)
      }
    }
    
    return NextResponse.json({
      revalidated: true,
      tags: revalidatedTags,
      failed: failedTags.length > 0 ? failedTags : undefined,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    logger.error('[revalidate] Unexpected error', error)
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

/**
 * GET /api/revalidate
 * Health check for the revalidation endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/revalidate',
    method: 'POST',
    description: 'Cache revalidation webhook',
    requiredFields: {
      secret: 'REVALIDATION_SECRET environment variable',
      tag: 'Single cache tag (optional if tags provided)',
      tags: 'Array of cache tags (optional if tag provided)',
      scope: 'Optional helper: "categories" or "attributes"',
      supabase: 'Optional Supabase Database Webhooks payload (table/record/old_record)'
    },
    note: 'Tags are defined by your app. This endpoint can revalidate any tag used by next/cache (cacheTag).',
    examples: {
      categories: {
        scope: 'categories',
        categorySlug: 'electronics',
        parentId: 'uuid',
      },
      attributes: {
        scope: 'attributes',
        categoryId: 'uuid',
      },
      supabaseWebhook: {
        supabase: {
          type: 'UPDATE',
          table: 'categories',
          record: { id: 'uuid', slug: 'electronics', parent_id: null },
          old_record: { id: 'uuid', slug: 'electronics-old', parent_id: null },
        },
      },
      rawTags: {
        tags: ['categories:tree', 'category:electronics', 'category-children:uuid', 'attrs:category:uuid'],
      },
    }
  })
}
