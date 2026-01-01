/**
 * Legacy test fixture - re-exports from base for backwards compatibility.
 *
 * New tests should import from './base' directly.
 * This file exists to avoid breaking existing test imports.
 */

import type { ConsoleMessage, Locator, Page } from '@playwright/test'
import { waitForHydration } from './base'

export {
  test,
  expect,
  setupPage,
  clearAuthSession,
  gotoWithRetries,
  waitForHydration,
  setupConsoleCapture,
  assertNoConsoleErrors,
} from './base'

export type { ConsoleCapture } from './base'
export type { ConsoleMessage, Locator, Page }

export async function waitForDevCompilingOverlayToHide(page: Page, timeoutMs = 60_000) {
  await waitForHydration(page, timeoutMs)
}
