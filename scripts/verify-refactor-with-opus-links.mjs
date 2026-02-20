import fs from 'node:fs/promises'
import path from 'node:path'

const repoRoot = process.cwd()

const sources = [
  path.join(repoRoot, 'refactor-with-opus', 'tasks.md'),
  path.join(repoRoot, 'refactor-with-opus', 'README.md'),
]

const linkPattern = /refactor\/[A-Za-z0-9._-]+\.md/g

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8')
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  const texts = await Promise.all(sources.map(s => readText(s)))
  const rawMatches = texts.flatMap(text => text.match(linkPattern) ?? [])
  const referencedPaths = [...new Set(rawMatches)].sort()

  const missing = []
  for (const relativeRef of referencedPaths) {
    const absoluteTarget = path.join(repoRoot, relativeRef)
    if (!(await exists(absoluteTarget))) missing.push(relativeRef)
  }

  if (missing.length > 0) {
    console.error('[refactor-with-opus] Missing referenced task file(s):')
    for (const m of missing) console.error('-', m)
    process.exit(1)
  }

  console.log(`[refactor-with-opus] OK: ${referencedPaths.length} referenced task file(s) exist.`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

