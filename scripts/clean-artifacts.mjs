import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = process.cwd()

const deleteTargets = [
  '.next',
  'out',
  'coverage',
  '.lighthouseci',
  'playwright-report',
  'blob-report',
  'test-results',
]

const deleteFileExactTargets = [
  'knip-output.json',
  'tsc-files.txt',
]

const deleteFilePrefixTargets = [
  'e2e-output',
  'e2e-smoke-output',
  'lint-output',
  'typecheck-output',
  'unit-test-output',
  'devserver-crash',
]

const deletePrefixTargets = [
  'playwright-report-',
  'test-results-',
]

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function rmDir(p) {
  if (!(await exists(p))) return { path: p, status: 'missing' }
  await fs.rm(p, { recursive: true, force: true })
  return { path: p, status: 'deleted' }
}

async function listRootEntries() {
  return fs.readdir(repoRoot, { withFileTypes: true })
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  const rootEntries = await listRootEntries()
  const rootDirs = rootEntries.filter(e => e.isDirectory()).map(e => e.name)
  const rootFiles = rootEntries.filter(e => e.isFile()).map(e => e.name)

  const prefixed = rootDirs.filter(name =>
    deletePrefixTargets.some(prefix => name.startsWith(prefix)),
  )

  const matchedFiles = rootFiles.filter(name => {
    if (deleteFileExactTargets.includes(name)) return true
    if (!name.endsWith('.txt')) return false
    return deleteFilePrefixTargets.some(prefix => name.startsWith(prefix))
  })

  const targets = [
    ...deleteTargets,
    ...prefixed,
    ...matchedFiles,
  ].map(p => path.join(repoRoot, p))

  if (dryRun) {
    console.log('Dry run. Would delete:')
    for (const t of targets) console.log('-', path.relative(repoRoot, t))
    return
  }

  const results = await Promise.all(targets.map(t => rmDir(t)))

  const deleted = results.filter(r => r.status === 'deleted').length
  const missing = results.filter(r => r.status === 'missing').length
  console.log(`Cleanup complete. Deleted=${deleted}, Missing=${missing}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
