import { beforeAll, describe, expect, it, vi } from "vitest"

// `lib/ai/env.ts` is server-only; in unit tests we can safely mock the guard.
vi.mock("server-only", () => ({}))

let parseAiModelSpec: typeof import("@/lib/ai/env").parseAiModelSpec

beforeAll(async () => {
  const mod = await import("@/lib/ai/env")
  parseAiModelSpec = mod.parseAiModelSpec
})

describe("lib/ai/env.parseAiModelSpec", () => {
  it("parses google spec", () => {
    expect(parseAiModelSpec("google/gemini-2.0-flash-lite")).toEqual({
      provider: "google",
      modelId: "gemini-2.0-flash-lite",
    })
  })

  it("parses openai spec", () => {
    expect(parseAiModelSpec("openai/gpt-4o-mini")).toEqual({
      provider: "openai",
      modelId: "gpt-4o-mini",
    })
  })

  it("trims input", () => {
    expect(parseAiModelSpec("  google/gemini-2.0-flash-lite  ")).toEqual({
      provider: "google",
      modelId: "gemini-2.0-flash-lite",
    })
  })

  it("throws on missing provider prefix", () => {
    expect(() => parseAiModelSpec("gemini-2.0-flash-lite")).toThrow(/Expected "<provider>\/<modelId>"/)
  })

  it("throws on unsupported provider", () => {
    expect(() => parseAiModelSpec("foo/bar")).toThrow(/Unsupported AI provider/)
  })
})
