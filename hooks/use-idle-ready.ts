import { useEffect, useState } from "react"

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
  cancelIdleCallback?: (id: number) => void
}

export function useIdleReady(timeoutMs: number) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const markReady = () => {
      if (!cancelled) setReady(true)
    }

    const idleWindow = window as IdleWindow

    if (typeof idleWindow.requestIdleCallback === "function") {
      const id = idleWindow.requestIdleCallback(markReady, { timeout: timeoutMs })
      return () => {
        cancelled = true
        idleWindow.cancelIdleCallback?.(id)
      }
    }

    const timer = window.setTimeout(markReady, timeoutMs)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [timeoutMs])

  return ready
}

