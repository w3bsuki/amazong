import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// We need to mock next-intl before importing the hook
vi.mock('next-intl', () => ({
  useLocale: vi.fn(() => 'en'),
  useTranslations: vi.fn(() => {
    const messages: Record<string, string> = {
      aiSuggestionOne: 'Black Friday deals',
      aiSuggestionTwo: 'iPhone 15 Pro',
      aiSuggestionThree: 'Christmas gifts',
    }

    return (key: string) => messages[key] ?? key
  }),
}))

// Import after mocking
import { useProductSearch, type SearchProduct } from '@/hooks/use-product-search'

// Mock global fetch
const mockFetch = vi.fn()

describe('hooks/use-product-search', () => {
  const STORAGE_KEYS = {
    recentSearches: 'recentSearches',
    recentProducts: 'recentSearchedProducts'
  }
  
  let mockStorage: Record<string, string> = {}
  
  beforeEach(() => {
    mockStorage = {}
    
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
    
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
  })
  
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })
  
  const createMockProduct = (id: string): SearchProduct => ({
    id,
    title: `Product ${id}`,
    price: 29.99,
    images: [`/images/${id}.jpg`],
    slug: `product-${id}`,
    storeSlug: `store-${id}`
  })
  
  describe('initial state', () => {
    it('returns initial empty state', () => {
      const { result } = renderHook(() => useProductSearch())
      
      expect(result.current.query).toBe('')
      expect(result.current.products).toEqual([])
      expect(result.current.isSearching).toBe(false)
      expect(result.current.recentSearches).toEqual([])
      expect(result.current.recentProducts).toEqual([])
      expect(result.current.minSearchLength).toBe(2)
    })
    
    it('provides trending searches based on locale', () => {
      const { result } = renderHook(() => useProductSearch())
      
      expect(result.current.trendingSearches).toContain('Black Friday deals')
      expect(result.current.trendingSearches).toContain('iPhone 15 Pro')
    })
    
    it('accepts custom maxResults parameter', () => {
      const { result } = renderHook(() => useProductSearch(5))
      // Hook should work with custom max results
      expect(result.current.products).toEqual([])
    })
  })
  
  describe('query and setQuery', () => {
    it('updates query via setQuery', () => {
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.setQuery('test')
      })
      
      expect(result.current.query).toBe('test')
    })
    
    it('clears query and products via clearQuery', () => {
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.setQuery('test')
      })
      
      act(() => {
        result.current.clearQuery()
      })
      
      expect(result.current.query).toBe('')
      expect(result.current.products).toEqual([])
    })
  })
  
  describe('debounced search', () => {
    it('does not search when query length is below minimum', async () => {
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.setQuery('a') // Only 1 character
      })
      
      // Advance past debounce
      act(() => {
        vi.advanceTimersByTime(400)
      })
      
      expect(mockFetch).not.toHaveBeenCalled()
    })
    
    it('searches after debounce delay', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: [createMockProduct('1')] })
      })
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.setQuery('phone')
      })
      
      // Not searched immediately
      expect(mockFetch).not.toHaveBeenCalled()
      
      // Advance past debounce (300ms)
      await act(async () => {
        vi.advanceTimersByTime(350)
      })
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/products/search?q=phone'),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    })
    
    it('cancels previous search when query changes', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ products: [] })
      })
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.setQuery('phone')
      })
      
      act(() => {
        vi.advanceTimersByTime(100)
      })
      
      act(() => {
        result.current.setQuery('laptop')
      })
      
      await act(async () => {
        vi.advanceTimersByTime(350)
      })
      
      // Should only search for 'laptop' (final query)
      const calls = mockFetch.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[0]).toContain('q=laptop')
    })
    
    it('handles search API error gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.setQuery('phone')
      })
      
      await act(async () => {
        vi.advanceTimersByTime(350)
      })
      
      expect(result.current.products).toEqual([])
      expect(result.current.isSearching).toBe(false)
    })
  })
  
  describe('recent searches', () => {
    it('loads recent searches from localStorage on mount', () => {
      mockStorage[STORAGE_KEYS.recentSearches] = JSON.stringify(['phone', 'laptop'])
      
      const { result } = renderHook(() => useProductSearch())
      
      expect(result.current.recentSearches).toEqual(['phone', 'laptop'])
    })
    
    it('saves search to recent searches', () => {
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.saveSearch('phone')
      })
      
      expect(result.current.recentSearches).toContain('phone')
      expect(JSON.parse(mockStorage[STORAGE_KEYS.recentSearches])).toContain('phone')
    })
    
    it('does not save empty or whitespace-only searches', () => {
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.saveSearch('')
        result.current.saveSearch('   ')
      })
      
      expect(result.current.recentSearches).toEqual([])
    })
    
    it('moves duplicate search to front', () => {
      mockStorage[STORAGE_KEYS.recentSearches] = JSON.stringify(['laptop', 'phone', 'tablet'])
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.saveSearch('phone')
      })
      
      expect(result.current.recentSearches[0]).toBe('phone')
    })
    
    it('limits recent searches to MAX_RECENT_SEARCHES (5)', () => {
      mockStorage[STORAGE_KEYS.recentSearches] = JSON.stringify([
        'one', 'two', 'three', 'four', 'five'
      ])
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.saveSearch('six')
      })
      
      expect(result.current.recentSearches).toHaveLength(5)
      expect(result.current.recentSearches[0]).toBe('six')
      expect(result.current.recentSearches).not.toContain('five')
    })
    
    it('clears all recent searches', () => {
      mockStorage[STORAGE_KEYS.recentSearches] = JSON.stringify(['phone', 'laptop'])
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.clearRecentSearches()
      })
      
      expect(result.current.recentSearches).toEqual([])
      expect(mockStorage[STORAGE_KEYS.recentSearches]).toBeUndefined()
    })
  })
  
  describe('recent products', () => {
    it('loads recent products from localStorage on mount', () => {
      const products = [
        { id: '1', title: 'Product 1', price: 29.99, image: '/img.jpg', slug: 'p1', searchedAt: Date.now() }
      ]
      mockStorage[STORAGE_KEYS.recentProducts] = JSON.stringify(products)
      
      const { result } = renderHook(() => useProductSearch())
      
      expect(result.current.recentProducts).toHaveLength(1)
      expect(result.current.recentProducts[0].id).toBe('1')
    })
    
    it('saves product to recent products', () => {
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.saveProduct(createMockProduct('test'))
      })
      
      expect(result.current.recentProducts).toHaveLength(1)
      expect(result.current.recentProducts[0].id).toBe('test')
      expect(result.current.recentProducts[0].searchedAt).toBeDefined()
    })
    
    it('moves duplicate product to front with updated timestamp', () => {
      const products = [
        { id: '1', title: 'Product 1', price: 10, image: null, slug: 'p1', searchedAt: 1000 },
        { id: '2', title: 'Product 2', price: 20, image: null, slug: 'p2', searchedAt: 2000 }
      ]
      mockStorage[STORAGE_KEYS.recentProducts] = JSON.stringify(products)
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.saveProduct(createMockProduct('1'))
      })
      
      expect(result.current.recentProducts[0].id).toBe('1')
      expect(result.current.recentProducts[0].searchedAt).toBeGreaterThan(1000)
    })
    
    it('limits recent products to MAX_RECENT_PRODUCTS (6)', () => {
      const products = Array.from({ length: 6 }, (_, i) => ({
        id: `${i}`, title: `Product ${i}`, price: 10, image: null, slug: `p${i}`, searchedAt: i * 1000
      }))
      mockStorage[STORAGE_KEYS.recentProducts] = JSON.stringify(products)
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.saveProduct(createMockProduct('new'))
      })
      
      expect(result.current.recentProducts).toHaveLength(6)
      expect(result.current.recentProducts[0].id).toBe('new')
    })
    
    it('clears all recent products', () => {
      mockStorage[STORAGE_KEYS.recentProducts] = JSON.stringify([
        { id: '1', title: 'Product 1', price: 10, image: null, slug: 'p1', searchedAt: 1000 }
      ])
      
      const { result } = renderHook(() => useProductSearch())
      
      act(() => {
        result.current.clearRecentProducts()
      })
      
      expect(result.current.recentProducts).toEqual([])
      expect(mockStorage[STORAGE_KEYS.recentProducts]).toBeUndefined()
    })
  })
  
  describe('formatPrice', () => {
    it('formats price for English locale', () => {
      const { result } = renderHook(() => useProductSearch())
      
      const formatted = result.current.formatPrice(29.99)
      
      expect(formatted).toContain('29')
      expect(formatted).toContain('99')
    })
    
    it('handles zero price', () => {
      const { result } = renderHook(() => useProductSearch())
      
      const formatted = result.current.formatPrice(0)
      
      expect(formatted).toContain('0')
    })
    
    it('handles large prices', () => {
      const { result } = renderHook(() => useProductSearch())
      
      const formatted = result.current.formatPrice(1234567.89)
      
      expect(formatted).toBeDefined()
      expect(typeof formatted).toBe('string')
    })
  })
  
  describe('localStorage error handling', () => {
    it('handles corrupted recentSearches in localStorage', () => {
      mockStorage[STORAGE_KEYS.recentSearches] = 'not valid json'
      
      const { result } = renderHook(() => useProductSearch())
      
      // Should not crash and return empty array
      expect(result.current.recentSearches).toEqual([])
    })
    
    it('handles non-array recentSearches in localStorage', () => {
      mockStorage[STORAGE_KEYS.recentSearches] = JSON.stringify({ not: 'an array' })
      
      const { result } = renderHook(() => useProductSearch())
      
      expect(result.current.recentSearches).toEqual([])
    })
    
    it('handles corrupted recentProducts in localStorage', () => {
      mockStorage[STORAGE_KEYS.recentProducts] = 'not valid json'
      
      const { result } = renderHook(() => useProductSearch())
      
      expect(result.current.recentProducts).toEqual([])
    })
  })
})
