import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  // Vitest may load config in a CJS context, and these plugins are ESM-only.
  // Dynamic import works in both environments.
  const [{ default: react }, { default: tsconfigPaths }] = await Promise.all([
    import('@vitejs/plugin-react'),
    import('vite-tsconfig-paths'),
  ])

  return {
    plugins: [tsconfigPaths(), react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      include: [
        '__tests__/**/*.{test,spec}.{ts,tsx}',
        'lib/**/*.{test,spec}.{ts,tsx}',
        'components/**/*.{test,spec}.{ts,tsx}',
      ],
      exclude: ['e2e/**', 'node_modules/**', '.next/**'],
      clearMocks: true,
      restoreMocks: true,
      mockReset: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['lib/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
        exclude: ['**/*.d.ts', '**/*.stories.*', '**/*.spec.*', '**/*.test.*'],
      },
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
