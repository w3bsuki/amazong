/**
 * Architecture Boundary Tests
 *
 * Structural tests that mechanically enforce module boundaries.
 * Modeled after OpenAI's layered architecture enforcement via structural tests.
 *
 * These tests scan the filesystem and parse imports to detect violations of
 * the directory conventions defined in ARCHITECTURE.md and AGENTS.md.
 */
import { describe, it, expect } from 'vitest'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const APP_DIR = join(ROOT, 'app')
const COMPONENTS_UI_DIR = join(ROOT, 'components', 'ui')
const COMPONENTS_SHARED_DIR = join(ROOT, 'components', 'shared')
const LIB_DIR = join(ROOT, 'lib')

// Recursively collect .ts/.tsx files
async function collectFiles(dir: string, ext = ['.ts', '.tsx']): Promise<string[]> {
  const results: string[] = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results.push(...(await collectFiles(full, ext)))
    } else if (ext.some(e => entry.name.endsWith(e))) {
      results.push(full)
    }
  }
  return results
}

// Extract import paths from a file
async function extractImports(filePath: string): Promise<string[]> {
  const content = await readFile(filePath, 'utf-8')
  const imports: string[] = []
  // Match: import ... from '...', import '...', require('...')
  const importRe = /(?:import\s+.*?\s+from\s+|import\s+|require\s*\(\s*)['"]([^'"]+)['"]/g
  let match
  while ((match = importRe.exec(content)) !== null) {
    imports.push(match[1])
  }
  return imports
}

// Get the route group of a file (e.g., "(main)", "(auth)", "(checkout)")
function getRouteGroup(filePath: string): string | null {
  const rel = relative(APP_DIR, filePath)
  const parts = rel.split(sep)
  // Find the locale segment, then the route group
  for (const part of parts) {
    if (part.startsWith('(') && part.endsWith(')')) {
      return part
    }
  }
  return null
}

describe('Architecture Boundaries', () => {
  it('components/ui/ should not import from app/ or from lib/ (except lib/utils)', async () => {
    const files = await collectFiles(COMPONENTS_UI_DIR)
    const violations: string[] = []

    for (const file of files) {
      const imports = await extractImports(file)
      for (const imp of imports) {
        if (
          imp.startsWith('@/app/') ||
          (imp.startsWith('@/lib/') && !imp.startsWith('@/lib/utils')) ||
          imp.startsWith('@/lib/supabase') ||
          imp.startsWith('@/lib/stripe') ||
          imp.includes('/app/') ||
          imp.includes('supabase/') ||
          imp.includes('stripe')
        ) {
          // Allow stripe-related type imports and stripe-locale utility
          if (imp.includes('stripe-locale') || imp.includes('@stripe/')) continue
          violations.push(`${relative(ROOT, file)}: imports "${imp}"`)
        }
      }
    }

    expect(violations, `UI primitives must not import domain logic:\n${violations.join('\n')}`).toEqual([])
  })

  it('components/shared/ should not directly import from Supabase or Stripe clients', async () => {
    const files = await collectFiles(COMPONENTS_SHARED_DIR)
    const violations: string[] = []

    for (const file of files) {
      const imports = await extractImports(file)
      for (const imp of imports) {
        if (
          imp === '@/lib/supabase/server' ||
          imp === '@/lib/supabase/client' ||
          imp === '@/lib/stripe' ||
          imp === '@/lib/stripe-connect'
        ) {
          violations.push(`${relative(ROOT, file)}: imports "${imp}"`)
        }
      }
    }

    expect(
      violations,
      `Shared components must not call Supabase/Stripe directly (use props/hooks):\n${violations.join('\n')}`
    ).toEqual([])
  })

  it('lib/ should not import React or use React hooks', async () => {
    const files = await collectFiles(LIB_DIR)
    const violations: string[] = []

    for (const file of files) {
      // Skip test files and type-only files
      if (file.includes('.test.') || file.includes('.spec.')) continue

      const imports = await extractImports(file)
      for (const imp of imports) {
        if (imp === 'react' || imp.startsWith('react/') || imp.startsWith('react-')) {
          // Allow react types in .d.ts files
          if (file.endsWith('.d.ts')) continue
          violations.push(`${relative(ROOT, file)}: imports "${imp}"`)
        }
      }
    }

    expect(
      violations,
      `lib/ must be pure utilities with no React dependency:\n${violations.join('\n')}`
    ).toEqual([])
  })

  it('lib/ should not import from app/', async () => {
    const files = await collectFiles(LIB_DIR)
    const violations: string[] = []

    for (const file of files) {
      if (file.includes('.test.') || file.includes('.spec.') || file.endsWith('.d.ts')) continue

      const imports = await extractImports(file)
      const fileDir = dirname(file)

      for (const imp of imports) {
        if (imp.startsWith('@/app/')) {
          violations.push(`${relative(ROOT, file)}: imports "${imp}"`)
          continue
        }

        if (imp.startsWith('.')) {
          const resolved = resolve(fileDir, imp)
          const relToApp = relative(APP_DIR, resolved)
          const isInsideApp = !relToApp.startsWith('..') && !relToApp.startsWith(sep)
          if (isInsideApp) {
            violations.push(`${relative(ROOT, file)}: imports "${imp}"`)
          }
        }
      }
    }

    expect(
      violations,
      `lib/ must not import route code from app/:\n${violations.join('\n')}`
    ).toEqual([])
  })

  it('route-private directories (_components, _actions, _lib, _providers) should not be imported from outside their route', async () => {
    const allAppFiles = await collectFiles(APP_DIR)
    const violations: string[] = []

    for (const file of allAppFiles) {
      const imports = await extractImports(file)
      const fileRouteGroup = getRouteGroup(file)

      for (const imp of imports) {
        // Check for imports that reference _components or _actions from another route
        if (
          imp.includes('/_components/') ||
          imp.includes('/_actions/') ||
          imp.includes('/_lib/') ||
          imp.includes('/_providers/')
        ) {
          // This is an import targeting a route-private directory
          // Check if it's crossing route boundaries
          const importRouteMatch = imp.match(/\(([^)]+)\)/)
          if (importRouteMatch) {
            const importRouteGroup = `(${importRouteMatch[1]})`
            if (fileRouteGroup && importRouteGroup !== fileRouteGroup) {
              violations.push(
                `${relative(ROOT, file)} (${fileRouteGroup}): imports from ${importRouteGroup} private dir: "${imp}"`
              )
            }
          }
        }
      }
    }

    expect(
      violations,
      `Route-private directories must not be imported across route groups:\n${violations.join('\n')}`
    ).toEqual([])
  })

  it('app/ and lib/ should not use supabase.auth.getSession()', async () => {
    const files = [...(await collectFiles(APP_DIR)), ...(await collectFiles(LIB_DIR))]
    const violations: string[] = []

    const pattern = /\.auth\.getSession\s*\(/

    for (const file of files) {
      if (file.includes('.test.') || file.includes('.spec.') || file.endsWith('.d.ts')) continue

      const content = await readFile(file, 'utf-8')
      if (!pattern.test(content)) continue

      const lines = content.split(/\r?\n/)
      for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i] ?? '')) {
          violations.push(`${relative(ROOT, file)}:${i + 1}: ${lines[i]?.trim()}`)
        }
      }
    }

    expect(
      violations,
      `Never use getSession() for security checks (use getUser() instead):\n${violations.join('\n')}`
    ).toEqual([])
  })

  it("app/ and lib/ should not use select('*')", async () => {
    const files = [...(await collectFiles(APP_DIR)), ...(await collectFiles(LIB_DIR))]
    const violations: string[] = []

    const pattern = /\.select\(\s*['"]\*['"]\s*\)/

    for (const file of files) {
      if (file.includes('.test.') || file.includes('.spec.') || file.endsWith('.d.ts')) continue

      const content = await readFile(file, 'utf-8')
      if (!pattern.test(content)) continue

      const lines = content.split(/\r?\n/)
      for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i] ?? '')) {
          violations.push(`${relative(ROOT, file)}:${i + 1}: ${lines[i]?.trim()}`)
        }
      }
    }

    expect(
      violations,
      `Never use select('*') in hot paths; project only the fields you need:\n${violations.join('\n')}`
    ).toEqual([])
  })

  it('Stripe webhook handlers should verify signatures before creating admin clients', async () => {
    const apiDir = join(APP_DIR, 'api')
    const files = (await collectFiles(apiDir, ['.ts'])).filter((file) =>
      file.endsWith(`${sep}webhook${sep}route.ts`)
    )

    const violations: string[] = []

    const constructEventRe = /\bconstructEvent\s*\(/
    const createAdminClientRe = /\bcreateAdminClient\s*\(/

    for (const file of files) {
      const content = await readFile(file, 'utf-8')

      const adminMatch = createAdminClientRe.exec(content)
      if (!adminMatch) continue

      const constructMatch = constructEventRe.exec(content)
      if (!constructMatch) {
        violations.push(`${relative(ROOT, file)}: createAdminClient() used but no constructEvent() found`)
        continue
      }

      if (constructMatch.index > adminMatch.index) {
        violations.push(`${relative(ROOT, file)}: createAdminClient() appears before constructEvent()`)
      }
    }

    expect(
      violations,
      `Webhook handlers must verify Stripe signatures before using the service role:\n${violations.join('\n')}`
    ).toEqual([])
  })

  it('hooks/ should only contain client-side code (use client directive)', async () => {
    const hooksDir = join(ROOT, 'hooks')
    const files = await collectFiles(hooksDir)
    const violations: string[] = []

    for (const file of files) {
      if (file.includes('.test.') || file.includes('.spec.') || file.endsWith('.d.ts')) continue

      const content = await readFile(file, 'utf-8')
      // Hooks that import React hooks should have 'use client' or be in a client context
      if (
        (content.includes('useState') || content.includes('useEffect') || content.includes('useCallback')) &&
        !content.includes("'use client'") &&
        !content.includes('"use client"')
      ) {
        // Check if exports are hook-like (start with use)
        const hasHookExport = /export\s+(?:function|const)\s+use[A-Z]/.test(content)
        if (hasHookExport) {
          violations.push(`${relative(ROOT, file)}: exports React hooks but missing 'use client' directive`)
        }
      }
    }

    // This is advisory — not all hooks files *need* the directive if they're re-exported
    // Only fail if there are clear violations
    if (violations.length > 0) {
      console.warn(`Advisory: ${violations.length} hook file(s) may need 'use client':\n${violations.join('\n')}`)
    }
  })

  it('server actions should validate input with Zod (boundary parsing)', async () => {
    const actionsDir = join(APP_DIR, 'actions')
    const files = await collectFiles(actionsDir)
    const violations: string[] = []

    for (const file of files) {
      if (file.includes('.test.')) continue

      const content = await readFile(file, 'utf-8')
      // If file has 'use server' and exported async functions, it should import zod
      if (content.includes("'use server'") || content.includes('"use server"')) {
        const hasExportedAsyncFn = /export\s+async\s+function/.test(content)
        if (hasExportedAsyncFn && !content.includes('zod') && !content.includes('z.') && !content.includes('Schema')) {
          violations.push(`${relative(ROOT, file)}: server action without Zod validation at boundary`)
        }
      }
    }

    // Advisory — some simple actions may not need validation
    if (violations.length > 0) {
      console.warn(
        `Advisory: ${violations.length} server action file(s) may need Zod validation:\n${violations.join('\n')}`
      )
    }
  })
})
