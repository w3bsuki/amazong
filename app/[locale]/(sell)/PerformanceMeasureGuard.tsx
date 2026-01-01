'use client'

import { useEffect } from 'react'

/**
 * Workaround for Chromium bug where performance.measure throws on negative timestamps.
 * Uses `any` casts because globalThis.performance typing varies across environments.
 */
export function PerformanceMeasureGuard() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- globalThis.performance not typed in all envs
    const perf = (globalThis as any).performance as undefined | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance API params
      measure?: (...args: any[]) => any
    }

    if (!perf?.measure || typeof perf.measure !== 'function') return

    const original = perf.measure.bind(perf)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Performance API proxy
    perf.measure = (name: any, ...args: any[]) => {
      try {
        return original(name, ...args)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)

        // Chromium throws when a numeric start/end is negative.
        // This appears intermittently for Next.js prerender timing entries.
        if (
          message.includes("Failed to execute 'measure' on 'Performance'") &&
          message.includes('negative time stamp')
        ) {
          return
        }

        throw error
      }
    }

    return () => {
      perf.measure = original
    }
  }, [])

  return null
}
