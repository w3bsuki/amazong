import "server-only"

import fs from "node:fs/promises"
import path from "node:path"

export type PublicDocLocale = "en" | "bg"

export type PublicDocSection = {
  id: string
  title: string
  markdown: string
}

export type PublicDoc = {
  key: string
  locale: PublicDocLocale
  /** Absolute path on disk (server-only). */
  absPath: string
  /** Markdown contents. */
  markdown: string
}

type GetPublicDocArgs = {
  /** Example: `legal/terms` (maps to `docs/public/legal/terms.<locale>.md`) */
  docKey: string
  locale: PublicDocLocale
  fallbackLocale?: PublicDocLocale
}

const PUBLIC_DOCS_ROOT = path.join(process.cwd(), "docs", "public")

function normalizeMarkdown(markdown: string) {
  return markdown.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n")
}

function stripLastUpdatedFooter(markdown: string) {
  const normalized = normalizeMarkdown(markdown)
  const match = normalized.match(/\n\*Last updated:\s*(\d{4}-\d{2}-\d{2})\*\s*$/)
  if (!match) return normalized

  const idx = match.index ?? -1
  if (idx <= 0) return normalized

  // Remove trailing "*Last updated: YYYY-MM-DD*" and an optional preceding horizontal rule.
  const before = normalized.slice(0, idx)
  return before.replace(/\n---\s*$/m, "").trimEnd()
}

function normalizeDocKey(docKey: string): string {
  const normalized = docKey.trim().replaceAll("\\", "/").replaceAll(/^\/+|\/+$/g, "")
  if (!normalized) throw new Error("Public doc key is required")
  if (normalized.includes("..")) throw new Error(`Invalid public doc key: '${docKey}'`)

  const segments = normalized.split("/")
  for (const seg of segments) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(seg)) {
      throw new Error(`Invalid public doc key segment: '${seg}' (from '${docKey}')`)
    }
  }

  return segments.join("/")
}

function resolvePublicDocAbsPath(docKey: string, locale: PublicDocLocale): string {
  const key = normalizeDocKey(docKey)
  const candidate = path.resolve(PUBLIC_DOCS_ROOT, `${key}.${locale}.md`)

  // Defense in depth (blocks traversal even if future changes loosen validation).
  const rootAbs = path.resolve(PUBLIC_DOCS_ROOT) + path.sep
  if (!candidate.startsWith(rootAbs)) {
    throw new Error(`Public doc path traversal blocked: '${docKey}'`)
  }

  return candidate
}

async function readFileIfExists(absPath: string): Promise<string | null> {
  try {
    return await fs.readFile(absPath, "utf8")
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null
    }
    throw error
  }
}

export async function getPublicDoc({
  docKey,
  locale,
  fallbackLocale = "en",
}: GetPublicDocArgs): Promise<PublicDoc> {
  const absPath = resolvePublicDocAbsPath(docKey, locale)
  const primary = await readFileIfExists(absPath)

  if (primary !== null) {
    return { key: normalizeDocKey(docKey), locale, absPath, markdown: primary }
  }

  const fallbackAbsPath = resolvePublicDocAbsPath(docKey, fallbackLocale)
  const fallback = await readFileIfExists(fallbackAbsPath)

  if (fallback !== null) {
    return { key: normalizeDocKey(docKey), locale: fallbackLocale, absPath: fallbackAbsPath, markdown: fallback }
  }

  throw new Error(
    `Missing public doc: docs/public/${normalizeDocKey(docKey)}.${locale}.md (or fallback ${fallbackLocale})`,
  )
}

export function extractLastUpdatedDate(markdown: string): string | null {
  const normalized = normalizeMarkdown(markdown)
  const match = normalized.match(/\*Last updated:\s*(\d{4}-\d{2}-\d{2})\*/g)
  if (!match || match.length === 0) return null
  const last = match.at(-1)
  if (!last) return null
  const dateMatch = last.match(/(\d{4}-\d{2}-\d{2})/)
  return dateMatch?.[1] ?? null
}

export function parsePublicDocIntro(markdown: string): { notice: string; markdown: string } {
  const normalized = stripLastUpdatedFooter(markdown)
  const sectionMatch = normalized.match(/^##\s+[a-z0-9][a-z0-9-]*\s*:\s*.+\s*$/m)
  const pre = sectionMatch && typeof sectionMatch.index === "number" ? normalized.slice(0, sectionMatch.index) : normalized

  const lines = pre.split("\n")
  const noticeLines: string[] = []
  const bodyLines: string[] = []

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith("# ")) continue
    if (line.trim() === "---") continue

    const trimmed = line.trimStart()
    if (trimmed.startsWith(">")) {
      noticeLines.push(trimmed.replace(/^\>\s?/, ""))
      continue
    }

    bodyLines.push(line)
  }

  return {
    notice: noticeLines.join(" ").replaceAll(/\s+/g, " ").trim(),
    markdown: bodyLines.join("\n").trim(),
  }
}

/**
 * Parses sections from markdown using H2 headings:
 * `## <id>: <Title>`
 *
 * The `<id>` is stable across locales; `<Title>` is localized.
 */
export function parsePublicDocSections(markdown: string): PublicDocSection[] {
  const lines = stripLastUpdatedFooter(markdown).split("\n")
  const sections: PublicDocSection[] = []

  const re = /^##\s+([a-z0-9][a-z0-9-]*)\s*:\s*(.+)\s*$/
  let active: { id: string; title: string; buf: string[] } | null = null

  function commit() {
    if (!active) return
    sections.push({
      id: active.id,
      title: active.title.trim(),
      markdown: active.buf.join("\n").trim(),
    })
    active = null
  }

  for (const raw of lines) {
    const match = raw.match(re)
    if (match) {
      const id = match[1]
      const title = match[2]
      if (id && title) {
        commit()
        active = { id, title, buf: [] }
        continue
      }
    }
    if (active) active.buf.push(raw)
  }

  commit()
  return sections
}
