import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'vitest'

function readJsonObject(relativePath: string): Record<string, unknown> {
  const absolutePath = join(process.cwd(), relativePath)
  const raw = readFileSync(absolutePath, 'utf8')
  const parsed = JSON.parse(raw) as unknown
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Expected ${relativePath} to be a JSON object.`)
  }
  return parsed as Record<string, unknown>
}

function collectLeafKeys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : []
  }

  const result: string[] = []
  for (const key of Object.keys(value)) {
    const next = prefix ? `${prefix}.${key}` : key
    const child = (value as Record<string, unknown>)[key]

    if (child !== null && typeof child === 'object' && !Array.isArray(child)) {
      result.push(...collectLeafKeys(child, next))
    } else {
      result.push(next)
    }
  }

  return result
}

function formatMissing(label: string, keys: string[]): string {
  const head = keys.slice(0, 30)
  const lines = head.map((key) => `- ${key}`)
  const suffix = keys.length > head.length ? `\n… +${keys.length - head.length} more` : ''
  return `${label} (${keys.length}):\n${lines.join('\n')}${suffix}`
}

describe('i18n messages', () => {
  it('keeps key parity between en.json and bg.json', () => {
    const en = readJsonObject('messages/en.json')
    const bg = readJsonObject('messages/bg.json')

    const enKeys = new Set(collectLeafKeys(en))
    const bgKeys = new Set(collectLeafKeys(bg))

    const missingInBg = [...enKeys].filter((key) => !bgKeys.has(key)).sort()
    const missingInEn = [...bgKeys].filter((key) => !enKeys.has(key)).sort()

    if (missingInBg.length > 0 || missingInEn.length > 0) {
      const parts: string[] = []
      if (missingInBg.length > 0) parts.push(formatMissing('Missing in messages/bg.json', missingInBg))
      if (missingInEn.length > 0) parts.push(formatMissing('Missing in messages/en.json', missingInEn))
      throw new Error(parts.join('\n\n'))
    }
  })
})

