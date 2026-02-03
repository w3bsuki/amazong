import { describe, expect, it } from 'vitest'
import {
  productBlurDataURL,
  getImageLoadingStrategy,
} from '@/lib/image-utils'

describe('lib/image-utils', () => {
  describe('productBlurDataURL', () => {
    it('returns a valid base64 data URL', () => {
      const result = productBlurDataURL()
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/)
    })

    it('uses neutral gray fill color', () => {
      const result = productBlurDataURL()
      const base64 = result.replace('data:image/svg+xml;base64,', '')
      const svg = Buffer.from(base64, 'base64').toString('utf-8')
      expect(svg).toContain('#e5e7eb')
    })
  })

  describe('getImageLoadingStrategy', () => {
    it('returns eager loading for first image (index 0)', () => {
      const strategy = getImageLoadingStrategy(0)
      expect(strategy.loading).toBe('eager')
      expect(strategy.priority).toBe(true)
      expect(strategy.fetchPriority).toBe('high')
    })

    it('returns eager loading but no priority for index 1', () => {
      const strategy = getImageLoadingStrategy(1)
      expect(strategy.loading).toBe('eager')
      expect(strategy.priority).toBe(false)
      expect(strategy.fetchPriority).toBe('high')
    })

    it('returns eager loading with auto priority for index 2-3', () => {
      const strategy2 = getImageLoadingStrategy(2)
      expect(strategy2.loading).toBe('eager')
      expect(strategy2.priority).toBe(false)
      expect(strategy2.fetchPriority).toBe('auto')

      const strategy3 = getImageLoadingStrategy(3)
      expect(strategy3.loading).toBe('eager')
      expect(strategy3.fetchPriority).toBe('auto')
    })

    it('returns lazy loading for images at index 4+', () => {
      const strategy4 = getImageLoadingStrategy(4)
      expect(strategy4.loading).toBe('lazy')
      expect(strategy4.priority).toBe(false)
      expect(strategy4.fetchPriority).toBe('auto')

      const strategy10 = getImageLoadingStrategy(10)
      expect(strategy10.loading).toBe('lazy')
    })

    it('respects custom threshold', () => {
      // With threshold of 2, index 1 should be eager, index 2 should be lazy
      const strategy1 = getImageLoadingStrategy(1, 2)
      expect(strategy1.loading).toBe('eager')

      const strategy2 = getImageLoadingStrategy(2, 2)
      expect(strategy2.loading).toBe('lazy')
    })

    it('first image always gets priority regardless of threshold', () => {
      const strategy = getImageLoadingStrategy(0, 10)
      expect(strategy.priority).toBe(true)
    })
  })
})
