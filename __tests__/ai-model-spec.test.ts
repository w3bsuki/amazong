import { describe, expect, it } from 'vitest'

import { parseAiModelSpec } from '@/lib/ai/env'

describe('lib/ai/env.parseAiModelSpec', () => {
  it('parses google spec', () => {
    expect(parseAiModelSpec('google/gemini-2.0-flash-lite')).toEqual({
      provider: 'google',
      modelId: 'gemini-2.0-flash-lite',
    })
  })

  it('parses openai spec', () => {
    expect(parseAiModelSpec('openai/gpt-4o-mini')).toEqual({
      provider: 'openai',
      modelId: 'gpt-4o-mini',
    })
  })

  it('trims input', () => {
    expect(parseAiModelSpec('  google/gemini-2.0-flash-lite  ')).toEqual({
      provider: 'google',
      modelId: 'gemini-2.0-flash-lite',
    })
  })

  it('throws on missing provider prefix', () => {
    expect(() => parseAiModelSpec('gemini-2.0-flash-lite')).toThrow(/Expected "<provider>\/<modelId>"/)
  })

  it('throws on unsupported provider', () => {
    expect(() => parseAiModelSpec('foo/bar')).toThrow(/Unsupported AI provider/)
  })
})

