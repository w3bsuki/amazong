import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => {
  const projectRoot = dirname(fileURLToPath(import.meta.url))

  // Vitest may load config in a CJS context, and these plugins are ESM-only.
  // Dynamic import works in both environments.
  const [{ default: tsconfigPaths }] = await Promise.all([import('vite-tsconfig-paths')])

  return {
    // Keep test transforms lean: Vite's esbuild handles TSX/JSX. React Fast Refresh
    // and Babel transforms are unnecessary for unit tests and can be memory heavy.
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
      include: [
        '__tests__/**/*.{test,spec}.tsx',
        'lib/**/*.{test,spec}.tsx',
        'hooks/**/*.{test,spec}.tsx',
        'components/**/*.{test,spec}.tsx',
      ],
      exclude: ['e2e/**', 'node_modules/**', '.next/**'],
      clearMocks: true,
      restoreMocks: true,
      mockReset: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: [
          'lib/**/*.{ts,tsx}',
          'hooks/**/*.{ts,tsx}',
        ],
        exclude: [
          '**/*.d.ts',
          '**/*.stories.*',
          '**/*.spec.*',
          '**/*.test.*',
          'lib/supabase/**', // Supabase client setup - requires runtime
          'lib/stripe.ts', // Stripe client - requires env vars
          'lib/data/**', // Server-only data fetching with 'use cache'
          'lib/ai/**', // AI integrations - require API keys
          'lib/auth/**', // Auth helpers - require Supabase session
          'lib/api/**', // API helpers - require runtime context
          'lib/upload/**', // Upload helpers - require file system
          'lib/types/**', // Type definitions only
          'lib/view-models/**', // View models with DB queries
          'lib/sell/**', // Sell form schema - Zod schemas already covered
          'lib/category-icons.tsx', // React component with icons
          'lib/category-tree.ts', // Complex tree utils
          'lib/env.ts', // Env var getters - require process.env
          'lib/logger.ts', // Logger - side effects
          'lib/image-compression.ts', // Image compression - requires canvas
          'lib/bulgarian-cities.ts', // Static data
          'lib/category-display.ts', // Static display utils
          'hooks/use-geo-welcome.ts', // Complex with Supabase + cookies
        ],
        thresholds: {
          // Realistic thresholds for tested files
          lines: 80,
          functions: 70,
          branches: 60,
          statements: 80,
        },
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
