import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useGeoWelcome } from '@/hooks/use-geo-welcome'
import type { ShippingRegion } from '@/lib/shipping'

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } })
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: null })
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: null })
      }))
    }))
  }))
}))

// Mock shipping module
vi.mock('@/lib/shipping', () => ({
  getShippingRegion: vi.fn((code: string) => {
    if (code === 'BG') return 'BG'
    if (code === 'GB' || code === 'UK') return 'UK'
    if (['DE', 'FR', 'IT', 'ES'].includes(code)) return 'EU'
    if (code === 'US') return 'US'
    return 'WW'
  })
}))

describe('hooks/use-geo-welcome', () => {
  let localStorageMock: Record<string, string>
  let cookiesMock: string

  beforeEach(() => {
    // Reset mocks
    localStorageMock = {}
    cookiesMock = ''

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => localStorageMock[key] ?? null
    )
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => {
        localStorageMock[key] = value
      }
    )

    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      get: () => cookiesMock,
      set: (value: string) => {
        const [pair] = value.split(';')
        const [name, val] = pair.split('=')
        // Simple cookie accumulation for testing
        if (cookiesMock) {
          cookiesMock += `; ${name}=${val}`
        } else {
          cookiesMock = `${name}=${val}`
        }
      },
      configurable: true
    })

    // Mock window.location.assign
    Object.defineProperty(window, 'location', {
      value: {
        assign: vi.fn(),
        pathname: '/en',
        search: '',
        hash: ''
      },
      writable: true
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('returns loading state initially', () => {
      const { result } = renderHook(() => useGeoWelcome())
      expect(result.current.isLoading).toBe(true)
    })

    it('detects country from cookie', async () => {
      cookiesMock = 'user-country=DE; user-zone=EU'
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.detectedCountry).toBe('DE')
      expect(result.current.detectedRegion).toBe('EU')
    })

    it('defaults to BG when no cookie present', async () => {
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.detectedCountry).toBe('BG')
      expect(result.current.detectedRegion).toBe('BG')
    })

    it('shows modal for first-time visitors', async () => {
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.isOpen).toBe(true)
    })

    it('does not show modal when previously dismissed', async () => {
      localStorageMock['geo-welcome-dismissed'] = 'true'
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.isOpen).toBe(false)
    })

    it('does not show modal when disabled', async () => {
      const { result } = renderHook(() => useGeoWelcome({ enabled: false }))
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('setSelectedRegion', () => {
    it('updates selected region', async () => {
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.setSelectedRegion('UK')
      })
      
      expect(result.current.selectedRegion).toBe('UK')
    })

    it('allows changing to any region', async () => {
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      const regions: ShippingRegion[] = ['BG', 'UK', 'EU', 'US', 'WW']
      
      for (const region of regions) {
        act(() => {
          result.current.setSelectedRegion(region)
        })
        expect(result.current.selectedRegion).toBe(region)
      }
    })
  })

  describe('confirmRegion', () => {
    it('sets cookies and closes modal', async () => {
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.setSelectedRegion('UK')
      })
      
      await act(async () => {
        await result.current.confirmRegion()
      })
      
      expect(result.current.isOpen).toBe(false)
      expect(cookiesMock).toContain('user-zone=UK')
      expect(localStorageMock['geo-welcome-dismissed']).toBe('true')
    })

    it('navigates to correct locale for BG region', async () => {
      const assignMock = vi.fn()
      window.location.assign = assignMock
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.setSelectedRegion('BG')
      })
      
      await act(async () => {
        await result.current.confirmRegion()
      })
      
      expect(assignMock).toHaveBeenCalledWith('/bg')
    })

    it('navigates to /en for non-BG regions', async () => {
      const assignMock = vi.fn()
      window.location.assign = assignMock
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.setSelectedRegion('US')
      })
      
      await act(async () => {
        await result.current.confirmRegion()
      })
      
      expect(assignMock).toHaveBeenCalledWith('/en')
    })

    it('marks confirmed in localStorage', async () => {
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      await act(async () => {
        await result.current.confirmRegion()
      })
      
      expect(localStorageMock['geo-region-confirmed']).toBe('true')
    })
  })

  describe('declineAndShowAll', () => {
    it('sets WW region and navigates to /en', async () => {
      const assignMock = vi.fn()
      window.location.assign = assignMock
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.declineAndShowAll()
      })
      
      expect(cookiesMock).toContain('user-zone=WW')
      expect(result.current.isOpen).toBe(false)
      expect(assignMock).toHaveBeenCalledWith('/en')
    })

    it('marks as dismissed', async () => {
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.declineAndShowAll()
      })
      
      expect(localStorageMock['geo-welcome-dismissed']).toBe('true')
    })
  })

  describe('closeModal', () => {
    it('closes modal without navigation', async () => {
      const assignMock = vi.fn()
      window.location.assign = assignMock
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.closeModal()
      })
      
      expect(result.current.isOpen).toBe(false)
      expect(assignMock).not.toHaveBeenCalled()
    })

    it('marks as dismissed', async () => {
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.closeModal()
      })
      
      expect(localStorageMock['geo-welcome-dismissed']).toBe('true')
    })
  })

  describe('cookie parsing', () => {
    it('extracts user-country from complex cookie string', async () => {
      cookiesMock = 'session=abc123; user-country=FR; other=value'
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.detectedCountry).toBe('FR')
    })

    it('extracts user-zone from cookies', async () => {
      cookiesMock = 'user-zone=EU; user-country=DE'
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.detectedRegion).toBe('EU')
    })
  })

  describe('locale path generation', () => {
    it('handles root path correctly', async () => {
      const assignMock = vi.fn()
      window.location.assign = assignMock
      window.location.pathname = '/'
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.setSelectedRegion('BG')
      })
      
      await act(async () => {
        await result.current.confirmRegion()
      })
      
      expect(assignMock).toHaveBeenCalledWith('/bg')
    })

    it('replaces existing locale in path', async () => {
      const assignMock = vi.fn()
      window.location.assign = assignMock
      window.location.pathname = '/en/products'
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.setSelectedRegion('BG')
      })
      
      await act(async () => {
        await result.current.confirmRegion()
      })
      
      expect(assignMock).toHaveBeenCalledWith('/bg/products')
    })

    it('preserves query string and hash', async () => {
      const assignMock = vi.fn()
      window.location.assign = assignMock
      window.location.pathname = '/en'
      window.location.search = '?sort=price'
      window.location.hash = '#section'
      
      const { result } = renderHook(() => useGeoWelcome())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      act(() => {
        result.current.setSelectedRegion('BG')
      })
      
      await act(async () => {
        await result.current.confirmRegion()
      })
      
      expect(assignMock).toHaveBeenCalledWith('/bg?sort=price#section')
    })
  })
})
