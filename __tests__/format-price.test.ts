import { describe, expect, it } from 'vitest'
import {
  formatPrice,
  formatPriceParts,
  getDiscountPercentage,
  hasDiscount,
} from '@/lib/price'

describe('lib/price (format helpers)', () => {
  it('formats EUR price in en locale', () => {
    const result = formatPrice(29.99, { locale: 'en' })
    expect(result).toContain('€')
    expect(result).toContain('29.99')
  })

  it('formats EUR price in bg locale with comma decimal', () => {
    const result = formatPrice(29.99, { locale: 'bg' })
    expect(result).toContain('€')
    expect(result).toMatch(/29,99/)
  })

  it('formats price parts for split display', () => {
    const parts = formatPriceParts(1234.5, 'en')
    expect(parts.symbol).toBe('€')
    expect(parts.wholePart).toBe('1234')
    expect(parts.decimalPart).toBe('50')
  })

  it('computes discount helpers', () => {
    expect(hasDiscount(100, 80)).toBe(true)
    expect(hasDiscount(80, 100)).toBe(false)

    expect(getDiscountPercentage(100, 80)).toBe(20)
    expect(getDiscountPercentage(0, 80)).toBe(0)
  })
})
