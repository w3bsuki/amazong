import { describe, expect, it } from 'vitest'
import {
  normalizeImageUrl,
  normalizeOptionalImageUrl,
  normalizeImageUrls,
  PLACEHOLDER_IMAGE_PATH,
} from '@/lib/normalize-image-url'

describe('lib/normalize-image-url', () => {
  describe('PLACEHOLDER_IMAGE_PATH', () => {
    it('is defined as expected path', () => {
      expect(PLACEHOLDER_IMAGE_PATH).toBe('/placeholder.jpg')
    })
  })

  describe('normalizeImageUrl', () => {
    it('returns placeholder for null input', () => {
      expect(normalizeImageUrl(null)).toBe(PLACEHOLDER_IMAGE_PATH)
    })

    it('returns placeholder for undefined input', () => {
      expect(normalizeImageUrl()).toBe(PLACEHOLDER_IMAGE_PATH)
    })

    it('returns placeholder for empty string', () => {
      expect(normalizeImageUrl('')).toBe(PLACEHOLDER_IMAGE_PATH)
    })

    it('returns the placeholder unchanged', () => {
      expect(normalizeImageUrl(PLACEHOLDER_IMAGE_PATH)).toBe(PLACEHOLDER_IMAGE_PATH)
    })

    it('returns placeholder for placehold.co URLs', () => {
      expect(normalizeImageUrl('https://placehold.co/300x200')).toBe(PLACEHOLDER_IMAGE_PATH)
      expect(normalizeImageUrl('https://placehold.co/100')).toBe(PLACEHOLDER_IMAGE_PATH)
    })

    it('returns placeholder for known bad Unsplash images', () => {
      const badUrl = 'https://images.unsplash.com/photo-1558584673-90d3e2c6f626?auto=format'
      expect(normalizeImageUrl(badUrl)).toBe(PLACEHOLDER_IMAGE_PATH)
    })

    it('returns valid URLs unchanged', () => {
      const validUrl = 'https://example.com/image.jpg'
      expect(normalizeImageUrl(validUrl)).toBe(validUrl)
    })

    it('returns valid Unsplash URLs that are not blocklisted', () => {
      const validUnsplash = 'https://images.unsplash.com/photo-1234567890?auto=format'
      expect(normalizeImageUrl(validUnsplash)).toBe(validUnsplash)
    })

    it('returns Supabase storage URLs unchanged', () => {
      const supabaseUrl = 'https://xyz.supabase.co/storage/v1/object/public/images/123.jpg'
      expect(normalizeImageUrl(supabaseUrl)).toBe(supabaseUrl)
    })

    it('normalizes relative public asset paths to root-relative', () => {
      expect(normalizeImageUrl('placeholder.jpg')).toBe(PLACEHOLDER_IMAGE_PATH)
      expect(normalizeImageUrl('images/foo.jpg')).toBe('/images/foo.jpg')
    })
  })

  describe('normalizeOptionalImageUrl', () => {
    it('returns null for null input', () => {
      expect(normalizeOptionalImageUrl(null)).toBeNull()
    })

    it('returns null for undefined input', () => {
      expect(normalizeOptionalImageUrl()).toBeNull()
    })

    it('returns null for empty string', () => {
      expect(normalizeOptionalImageUrl('')).toBeNull()
    })

    it('returns null for placeholder path', () => {
      expect(normalizeOptionalImageUrl(PLACEHOLDER_IMAGE_PATH)).toBeNull()
    })

    it('returns null for placehold.co URLs', () => {
      expect(normalizeOptionalImageUrl('https://placehold.co/300x200')).toBeNull()
    })

    it('returns null for known bad Unsplash images', () => {
      const badUrl = 'https://images.unsplash.com/photo-1558584673-90d3e2c6f626?auto=format'
      expect(normalizeOptionalImageUrl(badUrl)).toBeNull()
    })

    it('returns valid URLs unchanged', () => {
      const validUrl = 'https://example.com/image.jpg'
      expect(normalizeOptionalImageUrl(validUrl)).toBe(validUrl)
    })

    it('returns null for relative placeholder asset paths', () => {
      expect(normalizeOptionalImageUrl('placeholder.jpg')).toBeNull()
    })
  })

  describe('normalizeImageUrls', () => {
    it('normalizes array of URLs', () => {
      const input = [
        'https://example.com/valid.jpg',
        null,
        'https://placehold.co/100',
        undefined,
        'https://another.com/image.png',
      ]

      const result = normalizeImageUrls(input)

      // Should have 4 entries (2 valid + 2 placeholders for null/undefined)
      // But then filter(Boolean) removes falsy values
      expect(result).toContain('https://example.com/valid.jpg')
      expect(result).toContain(PLACEHOLDER_IMAGE_PATH)
      expect(result).toContain('https://another.com/image.png')
    })

    it('returns array with all valid URLs', () => {
      const input = ['https://a.com/1.jpg', 'https://b.com/2.jpg']
      const result = normalizeImageUrls(input)
      expect(result).toEqual(input)
    })

    it('handles empty array', () => {
      expect(normalizeImageUrls([])).toEqual([])
    })

    it('replaces all null/undefined with placeholder', () => {
      const input = [null, undefined, '']
      const result = normalizeImageUrls(input)
      // All become placeholder, filter removes duplicates? No, all stay
      expect(result.every((url) => url === PLACEHOLDER_IMAGE_PATH)).toBe(true)
    })
  })
})
