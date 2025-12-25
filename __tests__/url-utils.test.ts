import { describe, expect, it, vi } from 'vitest'
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

  it('falls back to /product/{id} when missing username/slug', () => {
    expect(getProductUrl({ id: '123' })).toBe('/product/123')
  })

  it('handles deprecated storeSlug', () => {
    expect(getProductUrl({ id: '123', storeSlug: 'store', slug: 'item' })).toBe('/store/item')
  })

  it('returns safe default and warns when missing identifier', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(getProductUrl({})).toBe('/product/unknown')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('adds locale prefix', () => {
    expect(getProductUrlWithLocale({ id: '123' }, 'en')).toBe('/en/product/123')
  })

  it('builds absolute URL with baseUrl override', () => {
    expect(getAbsoluteProductUrl({ id: '123' }, 'en', 'https://example.com')).toBe(
      'https://example.com/en/product/123'
    )
  })

  it('builds seller URLs', () => {
    expect(getSellerUrl('john')).toBe('/john')
    expect(getSellerUrlWithLocale('john', 'en')).toBe('/en/john')
  })
})
