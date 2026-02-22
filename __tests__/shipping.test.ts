import { describe, expect, it } from 'vitest'
import {
  getShippingRegion,
  getShippingFilter,
  parseShippingRegion,
} from '@/lib/shipping'

describe('lib/shipping', () => {
  describe('getShippingRegion', () => {
    it('returns BG for Bulgaria', () => {
      expect(getShippingRegion('BG')).toBe('BG')
      expect(getShippingRegion('bg')).toBe('BG') // Case insensitive
    })
    
    it('returns UK for United Kingdom', () => {
      expect(getShippingRegion('GB')).toBe('UK')
      expect(getShippingRegion('UK')).toBe('UK')
    })
    
    it('returns EU for European countries', () => {
      const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'AT', 'BE', 'SE', 'FI']
      for (const country of euCountries) {
        expect(getShippingRegion(country)).toBe('EU')
      }
    })
    
    it('returns US for United States', () => {
      expect(getShippingRegion('US')).toBe('US')
    })
    
    it('returns WW for unknown countries', () => {
      expect(getShippingRegion('XX')).toBe('WW')
      expect(getShippingRegion('AU')).toBe('WW')
      expect(getShippingRegion('JP')).toBe('WW')
    })
    
    it('handles empty string', () => {
      expect(getShippingRegion('')).toBe('WW')
    })
  })
  
  describe('getShippingFilter', () => {
    it('returns correct filter for BG buyers', () => {
      const filter = getShippingFilter('BG')
      expect(filter).toBe('ships_to_bulgaria.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true')
    })
    
    it('returns correct filter for UK buyers', () => {
      const filter = getShippingFilter('UK')
      expect(filter).toBe('ships_to_uk.eq.true,ships_to_europe.eq.true,ships_to_worldwide.eq.true')
    })
    
    it('returns correct filter for EU buyers', () => {
      const filter = getShippingFilter('EU')
      expect(filter).toBe('ships_to_europe.eq.true,ships_to_worldwide.eq.true')
    })
    
    it('returns correct filter for US buyers', () => {
      const filter = getShippingFilter('US')
      expect(filter).toBe('ships_to_usa.eq.true,ships_to_worldwide.eq.true')
    })
    
    it('returns empty string for WW (no filter)', () => {
      const filter = getShippingFilter('WW')
      expect(filter).toBe('')
    })
  })
  
  describe('parseShippingRegion', () => {
    it('parses valid regions', () => {
      expect(parseShippingRegion('BG')).toBe('BG')
      expect(parseShippingRegion('UK')).toBe('UK')
      expect(parseShippingRegion('EU')).toBe('EU')
      expect(parseShippingRegion('US')).toBe('US')
      expect(parseShippingRegion('WW')).toBe('WW')
    })
    
    it('handles lowercase input', () => {
      expect(parseShippingRegion('bg')).toBe('BG')
      expect(parseShippingRegion('uk')).toBe('UK')
    })
    
    it('maps GB to UK for backward compatibility', () => {
      expect(parseShippingRegion('GB')).toBe('UK')
      expect(parseShippingRegion('gb')).toBe('UK')
    })
    
    it('returns WW for null/undefined', () => {
      expect(parseShippingRegion(null)).toBe('WW')
      // eslint-disable-next-line unicorn/no-useless-undefined -- explicit undefined exercises boundary handling
      expect(parseShippingRegion(undefined)).toBe('WW')
    })
    
    it('returns WW for invalid input', () => {
      expect(parseShippingRegion('invalid')).toBe('WW')
      expect(parseShippingRegion('XX')).toBe('WW')
    })
    
    it('returns WW for empty string', () => {
      expect(parseShippingRegion('')).toBe('WW')
    })
  })
  
})
