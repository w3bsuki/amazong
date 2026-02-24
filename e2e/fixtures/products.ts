import { expect, type APIRequestContext } from '@playwright/test'

export type NewestProduct = {
  id: string
  slug?: string
  storeSlug: string
  title?: string | null
  categorySlug?: string
  categoryRootSlug?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

export async function pickAnyProductFromNewestApi(request: APIRequestContext): Promise<NewestProduct | null> {
  const response = await request.get('/api/products/newest')
  expect(response.status()).toBe(200)

  const data: unknown = await response.json()
  const root = isRecord(data) ? data : {}
  const products: unknown[] = Array.isArray(root.products) ? root.products : []

  for (const product of products) {
    if (!isRecord(product)) continue

    const storeSlug = asString(product.storeSlug)
    const slug = asString(product.slug)
    const id = asString(product.id) ?? slug

    if (!storeSlug || !id) continue

    return {
      id,
      ...(slug ? { slug } : {}),
      storeSlug,
      title: typeof product.title === 'string' ? product.title : null,
      ...(asString(product.categorySlug) ? { categorySlug: String(product.categorySlug) } : {}),
      ...(asString(product.categoryRootSlug) ? { categoryRootSlug: String(product.categoryRootSlug) } : {}),
    }
  }

  return null
}
