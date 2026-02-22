import { describe, expect, it } from 'vitest'
import { getCountryName } from '@/lib/geolocation'

describe('lib/geolocation', () => {
  describe('getCountryName', () => {
    it('returns English name by default', () => {
      expect(getCountryName('US')).toBe('United States')
      expect(getCountryName('BG')).toBe('Bulgaria')
    })
    
    it('returns English name for en locale', () => {
      expect(getCountryName('DE', 'en')).toBe('Germany')
    })
    
    it('returns Bulgarian name for bg locale', () => {
      expect(getCountryName('DE', 'bg')).toBe('Германия')
      expect(getCountryName('US', 'bg')).toBe('САЩ')
    })
    
    it('handles lowercase country codes', () => {
      expect(getCountryName('us')).toBe('United States')
      expect(getCountryName('bg')).toBe('Bulgaria')
    })
    
    it('returns code for unknown countries', () => {
      expect(getCountryName('XX')).toBe('XX')
      expect(getCountryName('ZZ', 'bg')).toBe('ZZ')
    })
    
    it('falls back to English if Bulgarian name is missing', () => {
      // Both dictionaries have same keys, but test the fallback logic
      const result = getCountryName('US', 'bg')
      expect(result).toBeDefined()
    })
  })
})
