import { describe, expect, it } from 'vitest'
import {
  formatPrice,
  formatPriceParts,
} from '@/lib/price'

describe('lib/price (currency surface)', () => {
  describe('formatPrice', () => {
    it('formats price in English locale (Irish English EUR format)', () => {
      const result = formatPrice(29.99, { locale: 'en' })
      expect(result).toContain('€')
      expect(result).toContain('29')
      expect(result).toContain('99')
    })

    it('formats price in Bulgarian locale with comma decimal', () => {
      const result = formatPrice(29.99, { locale: 'bg' })
      expect(result).toContain('€')
      // Bulgarian uses comma as decimal separator
      expect(result).toMatch(/29,99/)
    })

    it('formats large prices correctly', () => {
      const resultEn = formatPrice(1234.56, { locale: 'en' })
      expect(resultEn).toContain('1')
      expect(resultEn).toContain('234')
      expect(resultEn).toContain('56')

      const resultBg = formatPrice(1234.56, { locale: 'bg' })
      expect(resultBg).toContain('€')
    })

    it('formats zero correctly', () => {
      const result = formatPrice(0, { locale: 'en' })
      expect(result).toContain('€')
      expect(result).toContain('0')
    })

    it('always shows 2 decimal places', () => {
      const result = formatPrice(10, { locale: 'en' })
      expect(result).toMatch(/10[.,]00/)
    })
  })

  describe('formatPriceParts', () => {
    it('returns correct parts for English locale', () => {
      const parts = formatPriceParts(29.99, 'en')
      expect(parts.symbol).toBe('€')
      expect(parts.wholePart).toBe('29')
      expect(parts.decimalPart).toBe('99')
      expect(parts.symbolPosition).toBe('before')
    })

    it('returns correct parts for Bulgarian locale', () => {
      const parts = formatPriceParts(29.99, 'bg')
      expect(parts.symbol).toBe('€')
      expect(parts.wholePart).toBe('29')
      expect(parts.decimalPart).toBe('99')
      expect(parts.symbolPosition).toBe('after')
    })

    it('handles large numbers with thousand separators in Bulgarian', () => {
      const parts = formatPriceParts(1234567.89, 'bg')
      expect(parts.wholePart).toContain(' ') // Bulgarian uses space as thousand separator
      expect(parts.decimalPart).toBe('89')
    })

    it('handles edge case of exactly whole number', () => {
      const parts = formatPriceParts(100, 'en')
      expect(parts.wholePart).toBe('100')
      expect(parts.decimalPart).toBe('00')
    })
  })

})
