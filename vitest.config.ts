import { defineConfig } from 'vitest/config'
import { baseCoverageConfig, baseTestConfig, browserUnitTestIncludes, createBaseVitestConfig } from './vitest.shared-config'

export default defineConfig(async () => {
  const base = await createBaseVitestConfig(import.meta.url)

  return {
    ...base,
    test: {
      ...baseTestConfig,
      environment: 'jsdom',
      include: [...browserUnitTestIncludes],
      coverage: {
        ...baseCoverageConfig,
      },
    },
  }
})
