import '@testing-library/jest-dom/vitest'
import dotenv from 'dotenv'

// Best-effort env loading for tests.
// Next.js uses layered env files; for unit tests we only need a reasonable subset.
dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })
dotenv.config({ path: '.env.test', override: true })
dotenv.config({ path: '.env.test.local', override: true })

// Minimal DOM polyfills for common browser APIs used by UI components.
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    })
  }

if (!('ResizeObserver' in globalThis)) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as any).ResizeObserver = ResizeObserver
}
