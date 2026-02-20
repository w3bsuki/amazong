import { describe, expect, it } from 'vitest'
import {
  getAbsoluteProductUrl,
  getProductUrl,
  getProductUrlWithLocale,
  getSellerUrl,
  getSellerUrlWithLocale,
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

  it('adds locale prefix', () => {
    expect(getProductUrlWithLocale({ id: '123', username: 'john' }, 'en')).toBe('/en/john/123')
  })

  it('builds absolute URL with baseUrl override', () => {
    expect(getAbsoluteProductUrl({ id: '123', username: 'john' }, 'en', 'https://example.com')).toBe(
      'https://example.com/en/john/123'
    )
  })

  it('builds seller URLs', () => {
    expect(getSellerUrl('john')).toBe('/john')
    expect(getSellerUrlWithLocale('john', 'en')).toBe('/en/john')
  })
})
