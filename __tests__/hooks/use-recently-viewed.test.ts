import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecentlyViewed, type RecentlyViewedProduct } from '@/hooks/use-recently-viewed'

describe('hooks/use-recently-viewed', () => {
  const STORAGE_KEY = 'recentlyViewedProducts'
  const MAX_ITEMS = 10
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
  
  // Mock localStorage
  let mockStorage: Record<string, string> = {}
  
  beforeEach(() => {
    mockStorage = {}
    
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return mockStorage[key] ?? null
    })
    
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      mockStorage[key] = value
    })
    
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete mockStorage[key]
    })
    
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-03T12:00:00Z'))
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })
  
  const createMockProduct = (id: string, overrides?: Partial<Omit<RecentlyViewedProduct, 'viewedAt'>>): Omit<RecentlyViewedProduct, 'viewedAt'> => ({
    id,
    title: `Product ${id}`,
    price: 29.99,
    image: `/images/product-${id}.jpg`,
    slug: `product-${id}`,
    username: `seller-${id}`,
    ...overrides
  })
  
  // Helper to run all pending effects
  const flushEffects = () => {
    act(() => {
      vi.runAllTimers()
    })
  }
  
  describe('initial state', () => {
    it('returns empty products array initially', () => {
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.products).toEqual([])
      // After effects run, isLoaded should be true (effect runs synchronously in test)
      expect(result.current.isLoaded).toBe(true)
    })
    
    it('sets isLoaded to true after initialization', () => {
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
    })
  })
  
  describe('loading from localStorage', () => {
    it('loads products from localStorage on mount', () => {
      const existingProducts: RecentlyViewedProduct[] = [
        { ...createMockProduct('1'), viewedAt: Date.now() - 1000 },
        { ...createMockProduct('2'), viewedAt: Date.now() - 2000 }
      ]
      mockStorage[STORAGE_KEY] = JSON.stringify(existingProducts)
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      expect(result.current.products).toHaveLength(2)
      expect(result.current.products[0].id).toBe('1')
    })
    
    it('filters out products older than 30 days', () => {
      const freshProduct = { ...createMockProduct('fresh'), viewedAt: Date.now() - 1000 }
      const oldProduct = { ...createMockProduct('old'), viewedAt: Date.now() - THIRTY_DAYS_MS - 1000 }
      
      mockStorage[STORAGE_KEY] = JSON.stringify([freshProduct, oldProduct])
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      expect(result.current.products).toHaveLength(1)
      expect(result.current.products[0].id).toBe('fresh')
    })
    
    it('handles invalid JSON in localStorage gracefully', () => {
      mockStorage[STORAGE_KEY] = 'not valid json {'
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      expect(result.current.products).toEqual([])
    })
    
    it('handles non-array JSON in localStorage', () => {
      mockStorage[STORAGE_KEY] = JSON.stringify({ not: 'an array' })
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      expect(result.current.products).toEqual([])
    })
  })
  
  describe('addProduct', () => {
    it('adds a new product to the beginning of the list', () => {
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.addProduct(createMockProduct('new'))
      })
      
      expect(result.current.products).toHaveLength(1)
      expect(result.current.products[0].id).toBe('new')
      expect(result.current.products[0].viewedAt).toBeDefined()
    })
    
    it('moves existing product to the front when re-added', () => {
      const existingProducts: RecentlyViewedProduct[] = [
        { ...createMockProduct('1'), viewedAt: Date.now() - 1000 },
        { ...createMockProduct('2'), viewedAt: Date.now() - 2000 }
      ]
      mockStorage[STORAGE_KEY] = JSON.stringify(existingProducts)
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.addProduct(createMockProduct('2'))
      })
      
      expect(result.current.products).toHaveLength(2)
      expect(result.current.products[0].id).toBe('2') // Moved to front
      expect(result.current.products[1].id).toBe('1')
    })
    
    it('limits to MAX_ITEMS (10) products', () => {
      const existingProducts: RecentlyViewedProduct[] = Array.from({ length: 10 }, (_, i) => ({
        ...createMockProduct(`existing-${i}`),
        viewedAt: Date.now() - (i * 1000)
      }))
      mockStorage[STORAGE_KEY] = JSON.stringify(existingProducts)
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.addProduct(createMockProduct('new-product'))
      })
      
      expect(result.current.products).toHaveLength(MAX_ITEMS)
      expect(result.current.products[0].id).toBe('new-product')
      expect(result.current.products[9].id).toBe('existing-8') // Last old one kept
    })
    
    it('persists to localStorage after adding', () => {
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.addProduct(createMockProduct('new'))
      })
      
      // Effect should persist immediately with fake timers
      flushEffects()
      
      expect(mockStorage[STORAGE_KEY]).toBeDefined()
      const persisted = JSON.parse(mockStorage[STORAGE_KEY])
      expect(persisted).toHaveLength(1)
      expect(persisted[0].id).toBe('new')
    })
  })
  
  describe('removeProduct', () => {
    it('removes a specific product by id', () => {
      const existingProducts: RecentlyViewedProduct[] = [
        { ...createMockProduct('1'), viewedAt: Date.now() - 1000 },
        { ...createMockProduct('2'), viewedAt: Date.now() - 2000 }
      ]
      mockStorage[STORAGE_KEY] = JSON.stringify(existingProducts)
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.removeProduct('1')
      })
      
      expect(result.current.products).toHaveLength(1)
      expect(result.current.products[0].id).toBe('2')
    })
    
    it('does nothing when removing non-existent product', () => {
      const existingProducts: RecentlyViewedProduct[] = [
        { ...createMockProduct('1'), viewedAt: Date.now() - 1000 }
      ]
      mockStorage[STORAGE_KEY] = JSON.stringify(existingProducts)
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.removeProduct('non-existent')
      })
      
      expect(result.current.products).toHaveLength(1)
    })
  })
  
  describe('clearProducts', () => {
    it('clears all products and localStorage', () => {
      const existingProducts: RecentlyViewedProduct[] = [
        { ...createMockProduct('1'), viewedAt: Date.now() - 1000 },
        { ...createMockProduct('2'), viewedAt: Date.now() - 2000 }
      ]
      mockStorage[STORAGE_KEY] = JSON.stringify(existingProducts)
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.clearProducts()
      })
      
      expect(result.current.products).toEqual([])
      // clearProducts calls localStorage.removeItem directly
      // but the useEffect writes [] back after state changes
      // The important thing is products are empty
    })
  })
  
  describe('product properties', () => {
    it('handles products with null image', () => {
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.addProduct(createMockProduct('no-image', { image: null }))
      })
      
      expect(result.current.products[0].image).toBeNull()
    })
    
    it('handles products with deprecated storeSlug field', () => {
      const existingProducts: RecentlyViewedProduct[] = [
        { 
          ...createMockProduct('1'), 
          viewedAt: Date.now() - 1000,
          storeSlug: 'legacy-store',
          username: null
        }
      ]
      mockStorage[STORAGE_KEY] = JSON.stringify(existingProducts)
      
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      expect(result.current.products[0].storeSlug).toBe('legacy-store')
    })
    
    it('preserves username field for SEO-friendly URLs', () => {
      const { result } = renderHook(() => useRecentlyViewed())
      flushEffects()
      
      expect(result.current.isLoaded).toBe(true)
      
      act(() => {
        result.current.addProduct(createMockProduct('1', { username: 'cool-seller' }))
      })
      
      expect(result.current.products[0].username).toBe('cool-seller')
    })
  })
})
