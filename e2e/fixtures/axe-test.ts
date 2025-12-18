import { test as base, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Custom Playwright fixture for accessibility testing with axe-core
 * 
 * Features:
 * - Pre-configured WCAG 2.1 AA compliance testing
 * - Consistent configuration across all tests
 * - Support for test-specific overrides
 * - Fingerprint-based violation tracking
 */

// Type definition for the axe fixture
type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder
}

/**
 * Extended test with axe-core accessibility testing capabilities
 */
export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, provideFixture) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        // WCAG 2.1 Level A and AA compliance
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // Exclude known third-party elements that we can't control
        .exclude('.stripe-element')
        .exclude('[data-testid="third-party-widget"]')
        // Exclude cookie consent banner (common false positive)
        .exclude('[data-testid="cookie-consent"]')

    await provideFixture(makeAxeBuilder)
  },
})

export { expect }

/**
 * Create a fingerprint of accessibility violations for stable snapshots
 * This approach is less fragile than snapshotting the entire violations array
 */
export function violationFingerprints(accessibilityScanResults: Awaited<ReturnType<AxeBuilder['analyze']>>) {
  const fingerprints = accessibilityScanResults.violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    description: violation.description,
    targets: violation.nodes.map((node) => node.target),
  }))

  return JSON.stringify(fingerprints, null, 2)
}

/**
 * Format violations for readable test output
 */
export function formatViolations(violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) {
  if (violations.length === 0) return 'No violations found'

  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `    - ${node.html}\n      Fix: ${node.failureSummary}`)
        .join('\n')

      return `
🚫 ${violation.id} (${violation.impact})
   ${violation.description}
   Help: ${violation.helpUrl}
   Affected elements:
${nodes}`
    })
    .join('\n')
}

/**
 * Helper to attach accessibility results to test for debugging
 */
export async function attachAccessibilityResults(
  testInfo: { attach: (name: string, options: { body: string; contentType: string }) => Promise<void> },
  results: Awaited<ReturnType<AxeBuilder['analyze']>>
) {
  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  })
}
