import { describe, expect, it } from 'vitest'
import {
  EUR_TO_BGN_RATE,
  eurToBgnApprox,
  formatPrice,
  formatPriceParts,
  getCurrencyCode,
  getCurrencySymbol,
  formatDeliveryDate,
  getEstimatedDeliveryDate,
} from '@/lib/currency'

describe('lib/currency', () => {
  describe('getCurrencySymbol', () => {
    it('returns € for English locale', () => {
      expect(getCurrencySymbol('en')).toBe('€')
    })

    it('returns € for Bulgarian locale', () => {
      expect(getCurrencySymbol('bg')).toBe('€')
    })

    it('returns € for unknown locale (fallback)', () => {
      expect(getCurrencySymbol('fr')).toBe('€')
      expect(getCurrencySymbol('de')).toBe('€')
      expect(getCurrencySymbol('')).toBe('€')
    })
  })

  describe('getCurrencyCode', () => {
    it('returns EUR for all supported locales', () => {
      expect(getCurrencyCode('en')).toBe('EUR')
      expect(getCurrencyCode('bg')).toBe('EUR')
    })

    it('returns EUR for unknown locale (fallback)', () => {
      expect(getCurrencyCode('unknown')).toBe('EUR')
    })
  })

  describe('formatPrice', () => {
    it('formats price in English locale (Irish English EUR format)', () => {
      const result = formatPrice(29.99, 'en')
      expect(result).toContain('€')
      expect(result).toContain('29')
      expect(result).toContain('99')
    })

    it('formats price in Bulgarian locale with comma decimal', () => {
      const result = formatPrice(29.99, 'bg')
      expect(result).toContain('€')
      // Bulgarian uses comma as decimal separator
      expect(result).toMatch(/29,99/)
    })

    it('formats large prices correctly', () => {
      const resultEn = formatPrice(1234.56, 'en')
      expect(resultEn).toContain('1')
      expect(resultEn).toContain('234')
      expect(resultEn).toContain('56')

      const resultBg = formatPrice(1234.56, 'bg')
      expect(resultBg).toContain('€')
    })

    it('formats zero correctly', () => {
      const result = formatPrice(0, 'en')
      expect(result).toContain('€')
      expect(result).toContain('0')
    })

    it('always shows 2 decimal places', () => {
      const result = formatPrice(10, 'en')
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

  describe('formatDeliveryDate', () => {
    it('formats date in English locale', () => {
      const date = new Date('2024-12-25')
      const result = formatDeliveryDate(date, 'en')
      expect(result).toContain('December')
      expect(result).toContain('25')
    })

    it('formats date in Bulgarian locale', () => {
      const date = new Date('2024-12-25')
      const result = formatDeliveryDate(date, 'bg')
      // Bulgarian month names
      expect(result).toContain('декември')
      expect(result).toContain('25')
    })
  })

  describe('getEstimatedDeliveryDate', () => {
    it('returns a future date', () => {
      const now = new Date()
      const estimated = getEstimatedDeliveryDate(1)
      expect(estimated.getTime()).toBeGreaterThan(now.getTime())
    })

    it('skips weekends when calculating business days', () => {
      // This test is date-dependent, but we can verify it returns a weekday
      const estimated = getEstimatedDeliveryDate(5)
      const dayOfWeek = estimated.getDay()
      // Should not be Sunday (0) or Saturday (6)
      expect(dayOfWeek).toBeGreaterThan(0)
      expect(dayOfWeek).toBeLessThan(6)
    })

    it('defaults to 1 business day', () => {
      const estimated = getEstimatedDeliveryDate()
      const now = new Date()
      // Should be within a week from now
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      expect(estimated.getTime()).toBeLessThan(weekFromNow.getTime())
    })
  })

  describe('eurToBgnApprox', () => {
    it('uses the fixed BGN/EUR rate constant', () => {
      expect(EUR_TO_BGN_RATE).toBeCloseTo(1.95583, 5)
    })

    it('rounds to 2 decimals for display (examples)', () => {
      expect(eurToBgnApprox(0)).toBe(0)
      expect(eurToBgnApprox(1)).toBe(1.96)
      expect(eurToBgnApprox(0.99)).toBe(1.94)
      expect(eurToBgnApprox(4.99)).toBe(9.76)
      expect(eurToBgnApprox(14.99)).toBe(29.32)
    })

    it('is stable for formatting via toFixed(2)', () => {
      expect(eurToBgnApprox(0.99).toFixed(2)).toBe('1.94')
      expect(eurToBgnApprox(4.99).toFixed(2)).toBe('9.76')
      expect(eurToBgnApprox(14.99).toFixed(2)).toBe('29.32')
    })
  })
})
