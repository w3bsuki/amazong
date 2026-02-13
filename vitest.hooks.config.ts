import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  const projectRoot = dirname(fileURLToPath(import.meta.url))

  // Vitest may load config in a CJS context, and these plugins are ESM-only.
  // Dynamic import works in both environments.
  const [{ default: tsconfigPaths }] = await Promise.all([import('vite-tsconfig-paths')])

  return {
    plugins: [tsconfigPaths()],
    esbuild: {
      jsx: 'automatic',
    },
    resolve: {
      alias: {
        '@': projectRoot,
        'server-only': join(projectRoot, 'test', 'shims', 'server-only.ts'),
        'client-only': join(projectRoot, 'test', 'shims', 'client-only.ts'),
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      include: ['__tests__/hooks/**/*.{test,spec}.ts'],
      exclude: ['e2e/**', 'node_modules/**', '.next/**'],
      clearMocks: true,
      restoreMocks: true,
      mockReset: true,
      // Inline next-intl to handle ESM/Next.js import workarounds
      // @see https://next-intl-docs.vercel.app/docs/environments/testing
      server: {
        deps: {
          inline: ['next-intl'],
        },
      },
    },
  }
})
