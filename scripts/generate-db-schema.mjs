#!/usr/bin/env node
// scripts/generate-db-schema.mjs
// Generates docs/generated/db-schema.md from Supabase migration files.
// Parses CREATE TABLE statements from supabase/migrations/ to produce
// a machine-readable schema reference.
//
// Usage: node scripts/generate-db-schema.mjs
//
// This is a lightweight alternative to introspecting a live database.
// For full accuracy, compare against a running Supabase instance.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = process.cwd()
const MIGRATIONS_DIR = join(ROOT, 'supabase', 'migrations')
const OUTPUT_DIR = join(ROOT, 'docs', 'generated')
const OUTPUT_FILE = join(OUTPUT_DIR, 'db-schema.md')

// Simple regex-based extraction of CREATE TABLE statements
const CREATE_TABLE_RE = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?["']?(\w+)["']?\s*\(/gi
// NOTE: We intentionally ignore non-public schema qualified names like
// `storage.objects` by requiring that the captured identifier is followed by a
// delimiter (whitespace or `(`). This prevents partial matches like `storag`.
const ALTER_TABLE_RE = /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:ONLY\s+)?(?:public\.)?["']?(\w+)["']?(?=\s|\(|$)/gi
const RLS_ENABLE_RE =
  /ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:ONLY\s+)?(?:public\.)?["']?(\w+)["']?(?=\s|\(|$)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/gi
const CREATE_INDEX_RE = /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?["']?(\w+)["']?\s+ON\s+(?:public\.)?["']?(\w+)["']?(?=\s|\(|$)/gi
const CREATE_POLICY_RE =
  /CREATE\s+POLICY\s+(?:(?:"([^"]+)")|(?:'([^']+)')|([^\s]+))\s+ON\s+(?:public\.)?["']?(\w+)["']?(?=\s|\(|$)/gi

async function main() {
  let migrationFiles
  try {
    migrationFiles = await readdir(MIGRATIONS_DIR)
  } catch {
    console.error(`❌ Migration directory not found: ${MIGRATIONS_DIR}`)
    process.exit(1)
  }

  const sqlFiles = migrationFiles
    .filter(f => f.endsWith('.sql'))
    .sort()

  console.log(`📂 Found ${sqlFiles.length} migration files`)

  const tables = new Map()      // table -> { firstSeen }
  const rlsTables = new Set()
  const indexes = new Map()     // table -> Set(index names)
  const policies = new Map()    // table -> Set(policy names)

  const ensureTableSeen = (rawName, file) => {
    const tableName = String(rawName ?? "").toLowerCase()
    if (!tableName) return tableName
    if (!tables.has(tableName)) {
      tables.set(tableName, { firstSeen: file })
    }
    return tableName
  }

  for (const file of sqlFiles) {
    const content = await readFile(join(MIGRATIONS_DIR, file), 'utf-8')

    // Extract tables
    let match
    const createRe = new RegExp(CREATE_TABLE_RE.source, CREATE_TABLE_RE.flags)
    while ((match = createRe.exec(content)) !== null) {
      ensureTableSeen(match[1], file)
    }

    // Capture ALTER TABLE touches as "table exists" hints
    const alterRe = new RegExp(ALTER_TABLE_RE.source, ALTER_TABLE_RE.flags)
    while ((match = alterRe.exec(content)) !== null) {
      ensureTableSeen(match[1], file)
    }

    // Extract RLS enables
    const rlsRe = new RegExp(RLS_ENABLE_RE.source, RLS_ENABLE_RE.flags)
    while ((match = rlsRe.exec(content)) !== null) {
      const tableName = ensureTableSeen(match[1], file)
      if (tableName) rlsTables.add(tableName)
    }

    // Extract indexes
    const idxRe = new RegExp(CREATE_INDEX_RE.source, CREATE_INDEX_RE.flags)
    while ((match = idxRe.exec(content)) !== null) {
      const table = ensureTableSeen(match[2], file)
      if (!table) continue
      if (!indexes.has(table)) indexes.set(table, new Set())
      indexes.get(table).add(match[1])
    }

    // Extract policies
    const polRe = new RegExp(CREATE_POLICY_RE.source, CREATE_POLICY_RE.flags)
    while ((match = polRe.exec(content)) !== null) {
      const policyName = match[1] ?? match[2] ?? match[3]
      const table = ensureTableSeen(match[4], file)
      if (!table) continue
      if (!policies.has(table)) policies.set(table, new Set())
      policies.get(table).add(policyName)
    }
  }

  // Generate markdown
  const sortedTables = [...tables.keys()].sort()
  const lines = [
    '# Generated Database Schema',
    '',
    `> Auto-generated from ${sqlFiles.length} migration files in \`supabase/migrations/\`.`,
    `> Generated: ${new Date().toISOString().split('T')[0]}`,
    '',
    '⚠️ **This file is auto-generated.** Do not edit manually. Run `node scripts/generate-db-schema.mjs` to regenerate.',
    '',
    '---',
    '',
    '## Summary',
    '',
    `- **Tables:** ${sortedTables.length}`,
    `- **Tables with RLS:** ${rlsTables.size}`,
    `- **Total indexes:** ${[...indexes.values()].reduce((a, b) => a + b.size, 0)}`,
    `- **Total policies:** ${[...policies.values()].reduce((a, b) => a + b.size, 0)}`,
    `- **Migrations:** ${sqlFiles.length}`,
    '',
    '---',
    '',
    '## Tables',
    '',
    '| Table | RLS | Indexes | Policies | First Migration |',
    '|-------|-----|---------|----------|-----------------|',
  ]

  for (const table of sortedTables) {
    const info = tables.get(table)
    const rls = rlsTables.has(table) ? '✅' : '—'
    const idxCount = indexes.get(table)?.size ?? 0
    const polCount = policies.get(table)?.size ?? 0
    const migration = info.firstSeen.replace('.sql', '').slice(0, 14) + '...'
    lines.push(`| \`${table}\` | ${rls} | ${idxCount} | ${polCount} | ${migration} |`)
  }

  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('## RLS-Enabled Tables')
  lines.push('')
  for (const table of [...rlsTables].sort()) {
    const pols = [...(policies.get(table) ?? [])].sort()
    lines.push(`### ${table}`)
    if (pols.length > 0) {
      lines.push(`Policies: ${pols.map(p => `\`${p}\``).join(', ')}`)
    } else {
      lines.push('Policies: (none found in migrations)')
    }
    lines.push('')
  }

  lines.push('---')
  lines.push('')
  lines.push(`*Generated: ${new Date().toISOString().split('T')[0]}*`)
  lines.push('')
  lines.push(`*Last updated: ${new Date().toISOString().split('T')[0]}*`)
  lines.push('')

  await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(OUTPUT_FILE, lines.join('\n'), 'utf-8')

  console.log(`✅ Generated ${OUTPUT_FILE}`)
  console.log(`   ${sortedTables.length} tables, ${rlsTables.size} with RLS`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
