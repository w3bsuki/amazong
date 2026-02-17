import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
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

const MAX_TAGS_PER_REQUEST = 32
const REVALIDATION_DEDUPE_WINDOW_MS = 30_000
const TAG_PATTERN = /^[a-z0-9:_-]{1,120}$/i
const STRUCTURAL_CATEGORY_FIELDS = [
  'slug',
  'parent_id',
  'name',
  'name_bg',
  'display_order',
  'icon',
  'image_url',
] as const
const recentRevalidations = new Map<string, number>()

const stringValueSchema = z.string().trim().min(1).max(120)

const SupabaseWebhookEventSchema = z.object({
  type: z.enum(['INSERT', 'UPDATE', 'DELETE']).optional(),
  table: stringValueSchema.optional(),
  schema: stringValueSchema.optional(),
  record: z.record(z.string(), z.unknown()).nullish(),
  old_record: z.record(z.string(), z.unknown()).nullish(),
})

const RevalidateRequestSchema = z.object({
  secret: z.string().min(1),
  tag: stringValueSchema.optional(),
  tags: z.array(stringValueSchema).max(MAX_TAGS_PER_REQUEST).optional(),
  scope: z.enum(['categories', 'attributes']).optional(),
  categorySlug: stringValueSchema.optional(),
  parentId: stringValueSchema.optional(),
  previousCategorySlug: stringValueSchema.optional(),
  previousParentId: stringValueSchema.optional(),
  categoryId: stringValueSchema.optional(),
  previousCategoryId: stringValueSchema.optional(),
  supabase: SupabaseWebhookEventSchema.optional(),
})

type SupabaseWebhookEvent = z.infer<typeof SupabaseWebhookEventSchema>
type RevalidateRequest = z.infer<typeof RevalidateRequestSchema>

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function normalizeTag(tag: string | null | undefined): string | null {
  if (typeof tag !== 'string') return null
  const trimmed = tag.trim()
  return TAG_PATTERN.test(trimmed) ? trimmed : null
}

function addTag(out: Set<string>, tag: string | null | undefined): void {
  const normalized = normalizeTag(tag)
  if (normalized) out.add(normalized)
}

function hasCategoryStructuralChange(supabase: SupabaseWebhookEvent): boolean {
  const record = asRecord(supabase.record)
  const oldRecord = asRecord(supabase.old_record)

  if (supabase.type === 'INSERT' || supabase.type === 'DELETE') return true
  if (supabase.type !== 'UPDATE') return true

  return STRUCTURAL_CATEGORY_FIELDS.some((field) => {
    const next = record[field]
    const prev = oldRecord[field]
    return JSON.stringify(next ?? null) !== JSON.stringify(prev ?? null)
  })
}

function collectTagsForRequest(body: RevalidateRequest): string[] {
  const out = new Set<string>()

  addTag(out, body.tag)
  if (body.tags && body.tags.length > 0) {
    for (const t of body.tags) {
      addTag(out, t)
    }
  }

  if (body.scope === 'categories') {
    addTag(out, 'categories:tree')
    addTag(out, 'categories:sell')
    addTag(out, 'categories:sell:depth:3')

    const categorySlug = asString(body.categorySlug)
    const previousCategorySlug = asString(body.previousCategorySlug)
    const parentId = asString(body.parentId)
    const previousParentId = asString(body.previousParentId)

    addTag(out, categorySlug ? `category:${categorySlug}` : null)
    addTag(out, previousCategorySlug ? `category:${previousCategorySlug}` : null)

    addTag(out, parentId ? `category-children:${parentId}` : null)
    addTag(out, previousParentId ? `category-children:${previousParentId}` : null)
  }

  if (body.scope === 'attributes') {
    const categoryId = asString(body.categoryId)
    const previousCategoryId = asString(body.previousCategoryId)

    addTag(out, categoryId ? `attrs:category:${categoryId}` : null)
    addTag(out, previousCategoryId ? `attrs:category:${previousCategoryId}` : null)
  }

  const supabase = body.supabase
  if (supabase?.table === 'categories') {
    const rec = asRecord(supabase.record)
    const old = asRecord(supabase.old_record)

    const slug = asString(rec["slug"])
    const oldSlug = asString(old["slug"])
    const parentId = asString(rec["parent_id"])
    const oldParentId = asString(old["parent_id"])

    addTag(out, slug ? `category:${slug}` : null)
    addTag(out, oldSlug ? `category:${oldSlug}` : null)
    addTag(out, parentId ? `category-children:${parentId}` : null)
    addTag(out, oldParentId ? `category-children:${oldParentId}` : null)

    if (hasCategoryStructuralChange(supabase)) {
      addTag(out, 'categories:tree')
      addTag(out, 'categories:sell')
      addTag(out, 'categories:sell:depth:3')
    }
  }

  if (supabase?.table === 'category_attributes') {
    const rec = asRecord(supabase.record)
    const old = asRecord(supabase.old_record)

    const categoryId = asString(rec["category_id"])
    const oldCategoryId = asString(old["category_id"])

    addTag(out, categoryId ? `attrs:category:${categoryId}` : null)
    addTag(out, oldCategoryId ? `attrs:category:${oldCategoryId}` : null)
  }

  return Array.from(out).slice(0, MAX_TAGS_PER_REQUEST)
}

function buildFingerprint(body: RevalidateRequest, tags: string[]): string {
  const supabase = body.supabase
  const record = asRecord(supabase?.record)
  const oldRecord = asRecord(supabase?.old_record)
  const recordId = asString(record["id"]) ?? ''
  const oldRecordId = asString(oldRecord["id"]) ?? ''

  return JSON.stringify({
    scope: body.scope ?? null,
    categorySlug: body.categorySlug ?? null,
    parentId: body.parentId ?? null,
    previousCategorySlug: body.previousCategorySlug ?? null,
    previousParentId: body.previousParentId ?? null,
    categoryId: body.categoryId ?? null,
    previousCategoryId: body.previousCategoryId ?? null,
    supabase: supabase
      ? {
          type: supabase.type ?? null,
          schema: supabase.schema ?? null,
          table: supabase.table ?? null,
          recordId,
          oldRecordId,
        }
      : null,
    tags: [...tags].sort(),
  })
}

function rememberFingerprint(fingerprint: string, nowMs: number): void {
  recentRevalidations.set(fingerprint, nowMs)
  for (const [key, ts] of recentRevalidations.entries()) {
    if (nowMs - ts > REVALIDATION_DEDUPE_WINDOW_MS) {
      recentRevalidations.delete(key)
    }
  }
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
    const parsedBody = RevalidateRequestSchema.safeParse(await request.json())
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: parsedBody.error.issues.map((issue) => issue.message),
        },
        { status: 400 },
      )
    }

    const body = parsedBody.data
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

    const nowMs = Date.now()
    const fingerprint = buildFingerprint(body, tagsToRevalidate)
    const lastSeenAt = recentRevalidations.get(fingerprint)

    if (typeof lastSeenAt === 'number' && nowMs - lastSeenAt <= REVALIDATION_DEDUPE_WINDOW_MS) {
      return NextResponse.json({
        revalidated: false,
        deduped: true,
        tags: tagsToRevalidate,
        timestamp: new Date(nowMs).toISOString(),
      })
    }

    rememberFingerprint(fingerprint, nowMs)
    
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
      deduped: false,
      timestamp: new Date(nowMs).toISOString()
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
