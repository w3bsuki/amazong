"use client"

import { useEffect } from "react"

/**
 * Workaround for Chromium bug where performance.measure throws on negative timestamps.
 * Uses `any` casts because globalThis.performance typing varies across environments.
 */
export function PerformanceMeasureGuard() {
  useEffect(() => {
    const perf: Performance | undefined = globalThis.performance

    if (!perf?.measure || typeof perf.measure !== 'function') return

    const original = perf.measure.bind(perf)

    const patchedMeasure: Performance['measure'] = ((...args: Parameters<Performance['measure']>) => {
      try {
        return original(...args)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)

        // Chromium throws when a numeric start/end is negative.
        // This appears intermittently for Next.js prerender timing entries.
        if (
          message.includes("Failed to execute 'measure' on 'Performance'") &&
          message.includes("negative time stamp") &&
          typeof args[0] === "string"
        ) {
          // Fallback: retry with name-only measure to avoid negative timestamps.
          // This preserves the return type (PerformanceMeasure) without crashing.
          try {
            return original(args[0])
          } catch {
            // Fall through to rethrow the original error below.
          }
        }

        throw error
      }
    }) as Performance['measure']

    perf.measure = patchedMeasure

    return () => {
      perf.measure = original
    }
  }, [])

  return null
}
