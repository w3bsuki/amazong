import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useBadges } from '@/app/[locale]/(account)/account/_components/use-badges'

// Mock global fetch
const mockFetch = vi.fn()

describe('hooks/use-badges', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch)
    mockFetch.mockReset()
  })
  
  afterEach(() => {
    vi.unstubAllGlobals()
  })
  
  const createMockBadge = (id: string, overrides = {}) => ({
    id,
    badge_id: `badge-${id}`,
    name: `Badge ${id}`,
    earned_at: new Date().toISOString(),
    is_featured: false,
    icon: '🏆',
    description: `Description for badge ${id}`,
    ...overrides
  })
  
  describe('initial fetch', () => {
    it('fetches badges on mount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ badges: [createMockBadge('1')] })
      })
      
      const { result } = renderHook(() => useBadges())
      
      expect(result.current.isLoading).toBe(true)
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(mockFetch).toHaveBeenCalledWith('/api/badges')
      expect(result.current.badges).toHaveLength(1)
      expect(result.current.error).toBeNull()
    })
    
    it('handles 401 unauthorized error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.error).toBe('Please sign in to view badges')
      expect(result.current.badges).toEqual([])
    })
    
    it('handles generic fetch error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.error).toBe('Failed to load badges')
    })
    
    it('handles network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.error).toBe('Failed to load badges')
    })
    
    it('handles empty badges response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ badges: [] })
      })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.badges).toEqual([])
      expect(result.current.error).toBeNull()
    })
    
    it('handles response with missing badges field', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.badges).toEqual([])
    })
  })
  
  describe('refetch', () => {
    it('refetches badges when called', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('1')] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('1'), createMockBadge('2')] })
        })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.badges).toHaveLength(1)
      
      await act(async () => {
        await result.current.refetch()
      })
      
      expect(result.current.badges).toHaveLength(2)
    })
    
    it('clears error before refetching', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('1')] })
        })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to load badges')
      })
      
      await act(async () => {
        await result.current.refetch()
      })
      
      expect(result.current.error).toBeNull()
    })
  })
  
  describe('toggleFeatured', () => {
    it('toggles featured status and updates local state', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('1', { is_featured: false })] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, is_featured: true })
        })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      let newFeaturedStatus: boolean
      await act(async () => {
        newFeaturedStatus = await result.current.toggleFeatured('1')
      })
      
      expect(newFeaturedStatus!).toBe(true)
      expect(result.current.badges[0].is_featured).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/badges/feature/1', {
        method: 'PATCH'
      })
    })

    it('supports legacy toggle payload without success field', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('1', { is_featured: false })] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ is_featured: true })
        })

      const { result } = renderHook(() => useBadges())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.toggleFeatured('1')
      })

      expect(result.current.badges[0].is_featured).toBe(true)
    })
    
    it('throws error on failed toggle', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('1')] })
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Max featured badges reached' })
        })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await expect(async () => {
        await act(async () => {
          await result.current.toggleFeatured('1')
        })
      }).rejects.toThrow('Max featured badges reached')
    })

    it('throws clear error when toggle response shape is invalid', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('1', { is_featured: false })] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        })

      const { result } = renderHook(() => useBadges())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await expect(async () => {
        await act(async () => {
          await result.current.toggleFeatured('1')
        })
      }).rejects.toThrow('Invalid badge feature response')

      expect(result.current.badges[0].is_featured).toBe(false)
    })
  })
  
  describe('evaluateBadges', () => {
    it('evaluates badges and returns awarded badge ids', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ awarded: ['first-purchase', 'early-adopter'], total_awarded: 2 })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('1'), createMockBadge('2')] })
        })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      let awardedIds: string[]
      await act(async () => {
        awardedIds = await result.current.evaluateBadges('purchase')
      })
      
      expect(awardedIds!).toEqual(['first-purchase', 'early-adopter'])
      expect(mockFetch).toHaveBeenCalledWith('/api/badges/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: 'purchase' })
      })
    })
    
    it('refetches badges when new badges are awarded', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ awarded: ['new-badge'], total_awarded: 1 })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [createMockBadge('new-badge')] })
        })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        await result.current.evaluateBadges()
      })
      
      // Should have called fetch 3 times: initial, evaluate, refetch
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
    
    it('does not refetch when no badges awarded', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ awarded: [], total_awarded: 0 })
        })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        await result.current.evaluateBadges()
      })
      
      // Should have called fetch only 2 times: initial, evaluate (no refetch)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
    
    it('returns empty array on error', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ badges: [] })
        })
        .mockResolvedValueOnce({
          ok: false
        })
      
      const { result } = renderHook(() => useBadges())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      let awardedIds: string[]
      await act(async () => {
        awardedIds = await result.current.evaluateBadges()
      })
      
      expect(awardedIds!).toEqual([])
    })
  })
})
