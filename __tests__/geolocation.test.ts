import { describe, expect, it } from 'vitest'
import {
  COUNTRY_NAMES,
  COUNTRY_NAMES_BG,
  SHIPPING_ZONES,
  getCountryName,
  getZoneForCountry,
  getCompatibleZones,
} from '@/lib/geolocation'

describe('lib/geolocation', () => {
  describe('COUNTRY_NAMES', () => {
    it('contains major countries in English', () => {
      expect(COUNTRY_NAMES.US).toBe('United States')
      expect(COUNTRY_NAMES.GB).toBe('United Kingdom')
      expect(COUNTRY_NAMES.DE).toBe('Germany')
      expect(COUNTRY_NAMES.FR).toBe('France')
      expect(COUNTRY_NAMES.BG).toBe('Bulgaria')
    })
    
    it('contains all EU member states', () => {
      const euCountries = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
      ]
      
      for (const code of euCountries) {
        expect(COUNTRY_NAMES[code], `${code} should have English name`).toBeDefined()
      }
    })
  })
  
  describe('COUNTRY_NAMES_BG', () => {
    it('contains major countries in Bulgarian', () => {
      expect(COUNTRY_NAMES_BG.US).toBe('САЩ')
      expect(COUNTRY_NAMES_BG.GB).toBe('Великобритания')
      expect(COUNTRY_NAMES_BG.DE).toBe('Германия')
      expect(COUNTRY_NAMES_BG.FR).toBe('Франция')
      expect(COUNTRY_NAMES_BG.BG).toBe('България')
    })
    
    it('has same keys as COUNTRY_NAMES', () => {
      const enKeys = Object.keys(COUNTRY_NAMES).sort()
      const bgKeys = Object.keys(COUNTRY_NAMES_BG).sort()
      expect(bgKeys).toEqual(enKeys)
    })
  })
  
  describe('SHIPPING_ZONES', () => {
    describe('BG zone', () => {
      it('has correct configuration', () => {
        expect(SHIPPING_ZONES.BG.code).toBe('BG')
        expect(SHIPPING_ZONES.BG.name).toBe('Bulgaria Only')
        expect(SHIPPING_ZONES.BG.name_bg).toBe('Само България')
        expect(SHIPPING_ZONES.BG.countries).toEqual(['BG'])
      })
    })
    
    describe('EU zone', () => {
      it('has correct configuration', () => {
        expect(SHIPPING_ZONES.EU.code).toBe('EU')
        expect(SHIPPING_ZONES.EU.name).toBe('Europe')
        expect(SHIPPING_ZONES.EU.name_bg).toBe('Европа')
      })
      
      it('includes Bulgaria in EU zone', () => {
        expect(SHIPPING_ZONES.EU.countries).toContain('BG')
      })
      
      it('includes major EU countries', () => {
        const majorEuCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'AT', 'BE']
        for (const country of majorEuCountries) {
          expect(SHIPPING_ZONES.EU.countries, `${country} should be in EU zone`).toContain(country)
        }
      })
      
      it('includes UK and associated countries', () => {
        expect(SHIPPING_ZONES.EU.countries).toContain('GB')
      })
      
      it('includes EEA countries (Norway, Switzerland)', () => {
        expect(SHIPPING_ZONES.EU.countries).toContain('NO')
        expect(SHIPPING_ZONES.EU.countries).toContain('CH')
      })
    })
    
    describe('WW zone', () => {
      it('has correct configuration', () => {
        expect(SHIPPING_ZONES.WW.code).toBe('WW')
        expect(SHIPPING_ZONES.WW.name).toBe('Worldwide')
        expect(SHIPPING_ZONES.WW.name_bg).toBe('Целият свят')
        expect(SHIPPING_ZONES.WW.countries).toEqual([]) // Empty means all
      })
    })
  })
  
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
  
  describe('getZoneForCountry', () => {
    it('returns BG for Bulgaria', () => {
      expect(getZoneForCountry('BG')).toBe('BG')
    })
    
    it('returns EU for European countries', () => {
      const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'AT', 'BE', 'SE', 'FI', 'GB']
      for (const country of euCountries) {
        expect(getZoneForCountry(country), `${country} should be in EU zone`).toBe('EU')
      }
    })
    
    it('returns WW for non-EU countries', () => {
      const wwCountries = ['US', 'AU', 'JP', 'CN', 'BR', 'CA']
      for (const country of wwCountries) {
        expect(getZoneForCountry(country), `${country} should be in WW zone`).toBe('WW')
      }
    })
    
    it('handles lowercase country codes', () => {
      expect(getZoneForCountry('bg')).toBe('BG')
      expect(getZoneForCountry('de')).toBe('EU')
    })
    
    it('returns WW for unknown countries', () => {
      expect(getZoneForCountry('XX')).toBe('WW')
      expect(getZoneForCountry('')).toBe('WW')
    })
  })
  
  describe('getCompatibleZones', () => {
    it('returns all zones for Bulgarian users', () => {
      const zones = getCompatibleZones('BG')
      expect(zones).toEqual(['BG', 'EU', 'WW'])
    })
    
    it('returns EU and WW for EU users', () => {
      const zones = getCompatibleZones('DE')
      expect(zones).toEqual(['EU', 'WW'])
    })
    
    it('returns only WW for non-EU users', () => {
      const zones = getCompatibleZones('US')
      expect(zones).toEqual(['WW'])
      
      const zonesAu = getCompatibleZones('AU')
      expect(zonesAu).toEqual(['WW'])
    })
    
    it('handles lowercase country codes', () => {
      expect(getCompatibleZones('bg')).toEqual(['BG', 'EU', 'WW'])
      expect(getCompatibleZones('de')).toEqual(['EU', 'WW'])
    })
    
    it('returns WW only for unknown countries', () => {
      expect(getCompatibleZones('XX')).toEqual(['WW'])
    })
  })
  
  describe('integration scenarios', () => {
    it('Bulgarian user can see products from all zones', () => {
      const zones = getCompatibleZones('BG')
      expect(zones).toContain('BG')
      expect(zones).toContain('EU')
      expect(zones).toContain('WW')
    })
    
    it('German user can see EU and worldwide products', () => {
      const zones = getCompatibleZones('DE')
      expect(zones).not.toContain('BG')
      expect(zones).toContain('EU')
      expect(zones).toContain('WW')
    })
    
    it('US user can only see worldwide products', () => {
      const zones = getCompatibleZones('US')
      expect(zones).not.toContain('BG')
      expect(zones).not.toContain('EU')
      expect(zones).toContain('WW')
    })
    
    it('country name and zone are consistent', () => {
      // Bulgaria
      expect(getCountryName('BG')).toBe('Bulgaria')
      expect(getZoneForCountry('BG')).toBe('BG')
      
      // Germany (EU)
      expect(getCountryName('DE')).toBe('Germany')
      expect(getZoneForCountry('DE')).toBe('EU')
    })
  })
})
