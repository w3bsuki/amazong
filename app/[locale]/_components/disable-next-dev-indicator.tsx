"use client"

import { useEffect } from "react"

const DISABLE_DEV_INDICATOR_ENDPOINT = "/__nextjs_disable_dev_indicator"
const DEVTOOLS_BUTTON_SELECTOR = 'button[aria-label="Open Next.js Dev Tools"]'
const DEVTOOLS_PORTAL_SELECTOR = "nextjs-portal"

function hideDevToolsTrigger() {
  const hosts = document.querySelectorAll<HTMLElement>(DEVTOOLS_PORTAL_SELECTOR)
  for (const host of hosts) {
    host.style.display = "none"
  }

  const portals = document.querySelectorAll<HTMLElement>(DEVTOOLS_PORTAL_SELECTOR)
  for (const portal of portals) {
    const shadowRoot = portal.shadowRoot
    if (!shadowRoot) continue
    const button = shadowRoot.querySelector<HTMLElement>(DEVTOOLS_BUTTON_SELECTOR)
    if (button) {
      button.style.display = "none"
    }
  }

  const fixedIssueBubbles = document.querySelectorAll<HTMLElement>("button, a, div")
  for (const node of fixedIssueBubbles) {
    const text = node.textContent?.trim().toLowerCase()
    if (!text) continue
    if (!/^\d+\s+issues?$/.test(text)) continue
    const style = window.getComputedStyle(node)
    if (style.position === "fixed") {
      node.style.display = "none"
    }
  }
}

async function disableDevIndicator() {
  try {
    await fetch(DISABLE_DEV_INDICATOR_ENDPOINT, { method: "POST" })
  } catch {
    // Best-effort in development only.
  }
  hideDevToolsTrigger()
}

export function DisableNextDevIndicator() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    void disableDevIndicator()

    const observer = new MutationObserver(() => {
      hideDevToolsTrigger()
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    const intervalId = window.setInterval(() => {
      void disableDevIndicator()
    }, 1200)

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId)
    }, 12000)

    return () => {
      observer.disconnect()
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [])

  return null
}
