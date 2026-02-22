import { describe, expect, it } from 'vitest'
import {
  getProductUrl,
} from '@/lib/url-utils'

describe('lib/url-utils', () => {
  it('prefers /{username}/{slug} when available', () => {
    expect(getProductUrl({ id: '123', username: 'john', slug: 'blue-widget' })).toBe(
      '/john/blue-widget'
    )
  })

  it('falls back to /{username}/{id} when slug is missing', () => {
    expect(getProductUrl({ id: '123', username: 'john' })).toBe('/john/123')
  })

  it('handles deprecated storeSlug', () => {
    expect(getProductUrl({ id: '123', storeSlug: 'store', slug: 'item' })).toBe('/store/item')
  })

  it('returns safe default when missing identifier', () => {
    // Function returns '#' as a safe fallback when no identifiers are provided
    expect(getProductUrl({})).toBe('#')
  })

})
