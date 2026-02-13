#!/usr/bin/env node
// scripts/check-doc-freshness.mjs
// Scans docs/ for "Last updated" or "Last verified" dates and reports stale files.
// Stale = older than STALE_DAYS (default: 30).
//
// Usage: node scripts/check-doc-freshness.mjs [--days=30] [--fail]
//   --days=N   Set staleness threshold (default 30)
//   --fail     Exit with code 1 if any stale docs found (for CI)

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const args = process.argv.slice(2)
const daysArg = args.find(a => a.startsWith('--days='))
const STALE_DAYS = daysArg ? parseInt(daysArg.split('=')[1], 10) : 30
const failOnStale = args.includes('--fail')

const ROOT = process.cwd()
const DOCS_DIR = join(ROOT, 'docs')
const SKIP_DOCS_DIRS = new Set(['archive'])

const DATE_PATTERN = /(?:Last\s+(?:updated|verified|reviewed)|Generated)\s*(?:\||:)?\s*(\d{4}-\d{2}-\d{2})/gi

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DOCS_DIRS.has(entry.name)) continue
      yield* walkDir(full)
    } else if (entry.name.endsWith('.md')) {
      yield full
    }
  }
}

function daysSince(dateStr) {
  const then = new Date(dateStr)
  const now = new Date()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

async function main() {
  const results = { fresh: [], stale: [], undated: [] }

  // Also check root-level docs
  const rootMds = ['AGENTS.md', 'ARCHITECTURE.md', 'REQUIREMENTS.md', 'TASKS.md']

  const allFiles = []

  for await (const f of walkDir(DOCS_DIR)) {
    allFiles.push(f)
  }

  for (const name of rootMds) {
    const full = join(ROOT, name)
    try {
      await stat(full)
      allFiles.push(full)
    } catch {
      // file doesn't exist, skip
    }
  }

  for (const filePath of allFiles) {
    const content = await readFile(filePath, 'utf-8')
    const relPath = relative(ROOT, filePath)

    const dates = []
    let match
    const regex = new RegExp(DATE_PATTERN.source, DATE_PATTERN.flags)
    while ((match = regex.exec(content)) !== null) {
      dates.push(match[1])
    }

    if (dates.length === 0) {
      results.undated.push(relPath)
      continue
    }

    // Use the most recent date found
    const mostRecent = dates.sort().reverse()[0]
    const age = daysSince(mostRecent)

    if (age > STALE_DAYS) {
      results.stale.push({ path: relPath, date: mostRecent, age })
    } else {
      results.fresh.push({ path: relPath, date: mostRecent, age })
    }
  }

  // Report
  console.log(`\n📋 Doc Freshness Report (threshold: ${STALE_DAYS} days)\n`)
  console.log(`✅ Fresh: ${results.fresh.length}`)
  console.log(`⚠️  Stale: ${results.stale.length}`)
  console.log(`❓ No date: ${results.undated.length}`)

  if (results.stale.length > 0) {
    console.log('\n--- Stale Documents ---')
    for (const { path, date, age } of results.stale.sort((a, b) => b.age - a.age)) {
      console.log(`  ${path} — last updated ${date} (${age} days ago)`)
    }
  }

  if (results.undated.length > 0) {
    console.log('\n--- Documents Without Dates ---')
    for (const path of results.undated.sort()) {
      console.log(`  ${path}`)
    }
  }

  if (results.fresh.length > 0) {
    console.log('\n--- Fresh Documents ---')
    for (const { path, date, age } of results.fresh.sort((a, b) => a.age - b.age)) {
      console.log(`  ${path} — ${date} (${age}d ago)`)
    }
  }

  console.log('')

  if (failOnStale && results.stale.length > 0) {
    console.error(`❌ ${results.stale.length} stale doc(s) found. Update or verify them.`)
    process.exit(1)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
