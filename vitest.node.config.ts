import { defineConfig } from 'vitest/config'
import { baseCoverageConfig, baseTestConfig, createBaseVitestConfig, nodeUnitTestIncludes } from './vitest.shared-config'

export default defineConfig(async () => {
  const base = await createBaseVitestConfig(import.meta.url)

  return {
    ...base,
    test: {
      ...baseTestConfig,
      environment: 'node',
      testTimeout: 20_000,
      include: [...nodeUnitTestIncludes],
      coverage: {
        ...baseCoverageConfig,
      },
      exclude: ['__tests__/hooks/**', ...baseTestConfig.exclude],
    },
  }
})
