import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// =============================================================================
// Cache Revalidation Webhook API (Next.js 16+)
// =============================================================================
// This endpoint allows external services (Supabase webhooks, CMS, admin tools)
// to trigger cache invalidation for specific tags.
//
// Security: Requires REVALIDATION_SECRET environment variable.
// Usage: POST /api/revalidate with JSON body { tag: 'categories', secret: '...' }
// =============================================================================

interface RevalidateRequest {
  tag?: string
  tags?: string[]
  secret: string
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
    const { tag, tags, secret } = body
    
    // Validate webhook secret
    if (!process.env.REVALIDATION_SECRET) {
      console.error('REVALIDATION_SECRET not configured')
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
    
    // Validate input
    if (!tag && (!tags || tags.length === 0)) {
      return NextResponse.json(
        { error: 'Missing required field: tag or tags' },
        { status: 400 }
      )
    }
    
    const revalidatedTags: string[] = []
    const failedTags: string[] = []
    
    // Revalidate single tag
    if (tag) {
      try {
        revalidateTag(tag, 'max') // 'max' = stale-while-revalidate (recommended)
        revalidatedTags.push(tag)
      } catch (error) {
        console.error(`Failed to revalidate tag: ${tag}`, error)
        failedTags.push(tag)
      }
    }
    
    // Revalidate multiple tags
    if (tags && tags.length > 0) {
      for (const t of tags) {
        try {
          revalidateTag(t, 'max') // 'max' = stale-while-revalidate (recommended)
          revalidatedTags.push(t)
        } catch (error) {
          console.error(`Failed to revalidate tag: ${t}`, error)
          failedTags.push(t)
        }
      }
    }
    
    return NextResponse.json({
      revalidated: true,
      tags: revalidatedTags,
      failed: failedTags.length > 0 ? failedTags : undefined,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Revalidation error:', error)
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
      tags: 'Array of cache tags (optional if tag provided)'
    },
    availableTags: [
      'categories',
      'products', 
      'attributes',
      'category-hierarchy-all',
      'root-with-children',
      'featured-products',
      'deals',
      'category-{slug}',
      'category-hierarchy-{slug}',
      'context-{slug}',
      'children-{categoryId}',
      'attrs-{categoryId}'
    ]
  })
}
