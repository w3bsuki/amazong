import { describe, expect, it } from 'vitest'
import { safeJsonParse } from '@/lib/safe-json'

describe('lib/safe-json', () => {
  it('parses valid JSON', () => {
    const result = safeJsonParse<{ a: number }>('{"a":1}')
    expect(result).toEqual({ a: 1 })
  })

  it('returns undefined on invalid JSON', () => {
    const result = safeJsonParse('not json')
    expect(result).toBeUndefined()
  })

  it('returns undefined on null/empty input', () => {
    expect(safeJsonParse(null)).toBeUndefined()
    expect(safeJsonParse(undefined)).toBeUndefined()
    expect(safeJsonParse('')).toBeUndefined()
  })
})
