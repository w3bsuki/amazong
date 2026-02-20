import { describe, expect, it } from 'vitest'
import {
  getShippingRegion,
  getSellerCategory,
  getDeliveryEstimate,
  productShipsToRegion,
  getShippingFilter,
  parseShippingRegion,
  SHIPPING_REGIONS,
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
  
  describe('getSellerCategory', () => {
    it('returns BG for Bulgarian sellers', () => {
      expect(getSellerCategory('BG')).toBe('BG')
    })
    
    it('returns UK for UK sellers', () => {
      expect(getSellerCategory('GB')).toBe('UK')
      expect(getSellerCategory('UK')).toBe('UK')
    })
    
    it('returns DE (EU representative) for EU sellers', () => {
      const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'AT', 'BE']
      for (const country of euCountries) {
        expect(getSellerCategory(country)).toBe('DE')
      }
    })
    
    it('returns US for American sellers', () => {
      expect(getSellerCategory('US')).toBe('US')
    })
    
    it('returns OTHER for unknown countries', () => {
      expect(getSellerCategory('AU')).toBe('OTHER')
      expect(getSellerCategory('JP')).toBe('OTHER')
      expect(getSellerCategory('XX')).toBe('OTHER')
    })
  })
  
  describe('getDeliveryEstimate', () => {
    describe('Bulgarian seller', () => {
      it('ships to Bulgaria in 1-3 days', () => {
        const estimate = getDeliveryEstimate('BG', 'BG')
        expect(estimate.minDays).toBe(1)
        expect(estimate.maxDays).toBe(3)
        expect(estimate.label).toBe('1-3 days')
        expect(estimate.labelBg).toBe('1-3 дни')
      })
      
      it('ships to UK in 5-12 days', () => {
        const estimate = getDeliveryEstimate('BG', 'UK')
        expect(estimate.minDays).toBe(5)
        expect(estimate.maxDays).toBe(12)
      })
      
      it('ships to EU in 5-10 days', () => {
        const estimate = getDeliveryEstimate('BG', 'EU')
        expect(estimate.minDays).toBe(5)
        expect(estimate.maxDays).toBe(10)
      })
      
      it('ships to US in 10-20 days', () => {
        const estimate = getDeliveryEstimate('BG', 'US')
        expect(estimate.minDays).toBe(10)
        expect(estimate.maxDays).toBe(20)
      })
      
      it('ships worldwide in 15-30 days', () => {
        const estimate = getDeliveryEstimate('BG', 'WW')
        expect(estimate.minDays).toBe(15)
        expect(estimate.maxDays).toBe(30)
      })
    })
    
    describe('US seller', () => {
      it('ships domestically in 1-5 days', () => {
        const estimate = getDeliveryEstimate('US', 'US')
        expect(estimate.minDays).toBe(1)
        expect(estimate.maxDays).toBe(5)
      })
      
      it('ships to Bulgaria in 10-20 days', () => {
        const estimate = getDeliveryEstimate('US', 'BG')
        expect(estimate.minDays).toBe(10)
        expect(estimate.maxDays).toBe(20)
      })
    })
    
    describe('UK seller', () => {
      it('ships domestically in 1-3 days', () => {
        const estimate = getDeliveryEstimate('GB', 'UK')
        expect(estimate.minDays).toBe(1)
        expect(estimate.maxDays).toBe(3)
      })
    })
    
    describe('EU seller (e.g., Germany)', () => {
      it('ships within EU in 2-5 days', () => {
        const estimate = getDeliveryEstimate('DE', 'EU')
        expect(estimate.minDays).toBe(2)
        expect(estimate.maxDays).toBe(5)
      })
    })
    
    describe('OTHER country seller', () => {
      it('has longer delivery times', () => {
        const estimate = getDeliveryEstimate('AU', 'US')
        expect(estimate.minDays).toBe(7)
        expect(estimate.maxDays).toBe(21)
      })
    })
  })
  
  describe('productShipsToRegion', () => {
    const createProduct = (flags: Partial<{
      ships_to_bulgaria: boolean | null
      ships_to_uk: boolean | null
      ships_to_europe: boolean | null
      ships_to_usa: boolean | null
      ships_to_worldwide: boolean | null
      pickup_only: boolean | null
    }>) => ({
      ships_to_bulgaria: null,
      ships_to_uk: null,
      ships_to_europe: null,
      ships_to_usa: null,
      ships_to_worldwide: null,
      pickup_only: null,
      ...flags
    })
    
    it('worldwide region always returns true', () => {
      const product = createProduct({})
      expect(productShipsToRegion(product, 'WW')).toBe(true)
    })
    
    it('pickup only products dont ship anywhere', () => {
      const product = createProduct({
        pickup_only: true,
        ships_to_worldwide: true
      })
      expect(productShipsToRegion(product, 'BG')).toBe(false)
      expect(productShipsToRegion(product, 'US')).toBe(false)
    })
    
    it('worldwide shipping covers all regions', () => {
      const product = createProduct({ ships_to_worldwide: true })
      
      expect(productShipsToRegion(product, 'BG')).toBe(true)
      expect(productShipsToRegion(product, 'UK')).toBe(true)
      expect(productShipsToRegion(product, 'EU')).toBe(true)
      expect(productShipsToRegion(product, 'US')).toBe(true)
    })
    
    describe('Bulgaria region (BG)', () => {
      it('ships if ships_to_bulgaria is true', () => {
        const product = createProduct({ ships_to_bulgaria: true })
        expect(productShipsToRegion(product, 'BG')).toBe(true)
      })
      
      it('ships if ships_to_europe is true (BG is in EU)', () => {
        const product = createProduct({ ships_to_europe: true })
        expect(productShipsToRegion(product, 'BG')).toBe(true)
      })
      
      it('does not ship if only ships_to_usa', () => {
        const product = createProduct({ ships_to_usa: true })
        expect(productShipsToRegion(product, 'BG')).toBe(false)
      })
    })
    
    describe('UK region', () => {
      it('ships if ships_to_uk is true', () => {
        const product = createProduct({ ships_to_uk: true })
        expect(productShipsToRegion(product, 'UK')).toBe(true)
      })
      
      it('ships if ships_to_europe is true (some EU sellers ship to UK)', () => {
        const product = createProduct({ ships_to_europe: true })
        expect(productShipsToRegion(product, 'UK')).toBe(true)
      })
    })
    
    describe('EU region', () => {
      it('ships if ships_to_europe is true', () => {
        const product = createProduct({ ships_to_europe: true })
        expect(productShipsToRegion(product, 'EU')).toBe(true)
      })
      
      it('does not ship if only ships_to_bulgaria', () => {
        const product = createProduct({ ships_to_bulgaria: true })
        expect(productShipsToRegion(product, 'EU')).toBe(false)
      })
    })
    
    describe('US region', () => {
      it('ships if ships_to_usa is true', () => {
        const product = createProduct({ ships_to_usa: true })
        expect(productShipsToRegion(product, 'US')).toBe(true)
      })
      
      it('does not ship if only ships_to_europe', () => {
        const product = createProduct({ ships_to_europe: true })
        expect(productShipsToRegion(product, 'US')).toBe(false)
      })
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
  
  describe('SHIPPING_REGIONS constant', () => {
    it('has correct display names for all regions', () => {
      expect(SHIPPING_REGIONS.BG.en).toBe('Bulgaria')
      expect(SHIPPING_REGIONS.BG.bg).toBe('България')
      
      expect(SHIPPING_REGIONS.UK.en).toBe('United Kingdom')
      expect(SHIPPING_REGIONS.UK.bg).toBe('Великобритания')
      
      expect(SHIPPING_REGIONS.EU.en).toBe('Europe')
      expect(SHIPPING_REGIONS.EU.bg).toBe('Европа')
      
      expect(SHIPPING_REGIONS.US.en).toBe('United States')
      expect(SHIPPING_REGIONS.US.bg).toBe('САЩ')
      
      expect(SHIPPING_REGIONS.WW.en).toBe('Worldwide')
      expect(SHIPPING_REGIONS.WW.bg).toBe('По целия свят')
    })
  })
})
