'use client'

import { useEffect } from 'react'

export function PerformanceMeasureGuard() {
  useEffect(() => {
    const perf = (globalThis as any).performance as undefined | {
      measure?: (...args: any[]) => any
    }

    if (!perf?.measure || typeof perf.measure !== 'function') return

    const original = perf.measure.bind(perf)

    perf.measure = (name: any, ...args: any[]) => {
      try {
        return original(name, ...args)
      } catch (error: any) {
        const message = String(error?.message ?? error)

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
