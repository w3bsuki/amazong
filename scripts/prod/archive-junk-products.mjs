import process from "node:process"
import fs from "node:fs"
import path from "node:path"

import { createClient } from "@supabase/supabase-js"

function getArgValue(args, key) {
  const idx = args.indexOf(key)
  if (idx === -1) return undefined
  const next = args[idx + 1]
  if (!next || next.startsWith("--")) return undefined
  return next
}

function hasFlag(args, flag) {
  return args.includes(flag)
}

function truncate(text, max = 80) {
  if (typeof text !== "string") return ""
  const trimmed = text.trim().replace(/\s+/g, " ")
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

function isProbablyJunkTitle(title) {
  if (typeof title !== "string") return true
  const trimmed = title.trim()
  const compact = trimmed.replace(/\s+/g, "")
  if (compact.length < 5) return true
  if (/^\d+$/.test(compact)) return true
  if (/^[^0-9A-Za-z\u0400-\u04FF]+$/.test(compact)) return true

  const digitCount = (compact.match(/\d/g) ?? []).length
  if (compact.length >= 10 && digitCount / compact.length > 0.8) return true

  const uniqueChars = new Set(compact.toLowerCase()).size
  if (compact.length >= 12 && uniqueChars <= 2) return true
  if (/^(.)\1{6,}$/.test(compact)) return true

  return false
}

async function main() {
  const args = process.argv.slice(2)

  const isApply = hasFlag(args, "--apply")
  const isDryRun = !isApply || hasFlag(args, "--dry-run")
  const isConfirmed = hasFlag(args, "--yes") || hasFlag(args, "--confirm")

  const limitRaw = getArgValue(args, "--limit")
  const limit = Math.max(1, Math.min(1000, Number.parseInt(limitRaw ?? "200", 10)))

  const exportPathRaw = getArgValue(args, "--export")
  const exportPath = exportPathRaw ? path.resolve(process.cwd(), exportPathRaw) : null

  const explicitIdsRaw = getArgValue(args, "--ids")
  const explicitIds = explicitIdsRaw
    ? explicitIdsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  if (isApply && !isConfirmed) {
    console.error("[prod] Refusing to apply without explicit confirmation flag.")
    console.error("[prod] Re-run with: --apply --yes")
    process.exit(1)
  }

  const url = process.env.SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url || !serviceRoleKey) {
    console.error("[prod] Missing required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
    console.error("[prod] Run in dry-run without creds (IDs-only) OR provide creds to query production.")
    if (!explicitIds.length) process.exit(1)
  }

  const supabase = url && serviceRoleKey
    ? createClient(url, serviceRoleKey, { auth: { persistSession: false } })
    : null

  let candidates = []

  if (explicitIds.length) {
    candidates = explicitIds.map((id) => ({ id, title: null, status: null }))
  } else {
    if (!supabase) {
      console.error("[prod] No SUPABASE_* creds provided and no --ids specified.")
      process.exit(1)
    }

    const { data, error } = await supabase
      .from("products")
      .select("id,title,status,created_at")
      .or("status.eq.active,status.is.null")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[prod] Failed to query products:", error.message)
      process.exit(1)
    }

    candidates = (data ?? [])
      .filter((row) => isProbablyJunkTitle(row?.title))
      .slice(0, limit)
  }

  if (exportPath) {
    fs.mkdirSync(path.dirname(exportPath), { recursive: true })
    fs.writeFileSync(exportPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), candidates }, null, 2)}\n`)
    console.log(`[prod] Exported ${candidates.length} candidates to ${exportPath}`)
  }

  if (candidates.length === 0) {
    console.log("[prod] No candidates found.")
    return
  }

  console.log(`[prod] Candidates (${candidates.length}):`)
  for (const row of candidates.slice(0, 50)) {
    console.log(`- ${row.id}  ${truncate(row.title ?? "", 64)}`)
  }
  if (candidates.length > 50) console.log(`[prod] …and ${candidates.length - 50} more`)

  if (isDryRun) {
    console.log("[prod] Dry run only. No changes applied.")
    return
  }

  if (!supabase) {
    console.error("[prod] Cannot apply without SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
    process.exit(1)
  }

  const idsToArchive = Array.from(
    new Set(candidates.map((c) => c.id).filter((id) => typeof id === "string" && id.length > 0))
  )

  const batchSize = 50
  let archived = 0

  for (let i = 0; i < idsToArchive.length; i += batchSize) {
    const batch = idsToArchive.slice(i, i + batchSize)
    const { error } = await supabase
      .from("products")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .in("id", batch)

    if (error) {
      console.error("[prod] Failed to archive batch:", error.message)
      process.exit(1)
    }

    archived += batch.length
    console.log(`[prod] Archived ${archived}/${idsToArchive.length}`)
  }

  console.log(`[prod] Done. Archived ${archived} products.`)
}

main().catch((err) => {
  console.error("[prod] Fatal error:", err)
  process.exit(1)
})

