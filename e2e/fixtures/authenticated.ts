import { test as baseTest, expect, type Page } from './test'
import { getTestUserCredentials, loginWithPassword } from './auth'

import fs from 'node:fs'
import path from 'node:path'

export * from './test'

export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Reuse the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, runFixture) => runFixture(workerStorageState),

  // Authenticate once per worker and persist storageState to disk.
  workerStorageState: [async ({ browser }, runFixture) => {
    const creds = getTestUserCredentials()
    if (!creds) {
      throw new Error(
        'Authenticated E2E tests require TEST_USER_EMAIL and TEST_USER_PASSWORD (or E2E_USER_EMAIL/E2E_USER_PASSWORD).'
      )
    }

    const projectOutputDir = test.info().project.outputDir
    const authDir = path.join(projectOutputDir, '.auth')
    const id = test.info().parallelIndex
    const fileName = path.join(authDir, `${id}.json`)

    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true })

    if (fs.existsSync(fileName)) {
      await runFixture(fileName)
      return
    }

    // Authenticate in a clean environment.
    const page = await browser.newPage({ storageState: undefined })

    // Ensure modal/consent overlays never block login.
    await page.addInitScript(() => {
      try {
        localStorage.setItem('geo-welcome-dismissed', 'true')
        localStorage.setItem('cookie-consent', 'accepted')
      } catch {
        // ignore
      }
    })

    await loginWithPassword(page as Page, creds)

    await page.context().storageState({ path: fileName })
    await page.close()

    await runFixture(fileName)
  }, { scope: 'worker' }],
})

export { expect }
