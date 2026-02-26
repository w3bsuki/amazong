import { describe, expect, it, vi } from "vitest"

import { runEvalSuite, type EvalCase, type EvalResult } from "@/lib/ai/eval/harness"
import { listingAutofillGoldenSet } from "@/lib/ai/eval/golden-sets/listing-autofill"

function listingAutofillScorer(expected: unknown, actual: unknown): EvalResult {
  const expectedRecord = expected as {
    titleKeywords?: string[]
    categorySlug?: string
    condition?: string
  }
  const actualRecord = actual as {
    title?: string
    categoryHint?: string
    condition?: string
  }

  const keywords = expectedRecord.titleKeywords ?? []
  const title = String(actualRecord.title ?? "").toLowerCase()
  const keywordHits = keywords.filter((keyword) => title.includes(keyword.toLowerCase())).length
  const keywordScore = keywords.length > 0 ? keywordHits / keywords.length : 0
  const categoryScore = expectedRecord.categorySlug === actualRecord.categoryHint ? 1 : 0
  const conditionScore = expectedRecord.condition === actualRecord.condition ? 1 : 0
  const score = Number(((keywordScore + categoryScore + conditionScore) / 3).toFixed(2))

  return {
    caseId: "overridden-by-harness",
    passed: score >= 0.66,
    score,
    details: `keywordHits=${keywordHits}/${keywords.length}; category=${categoryScore}; condition=${conditionScore}`,
  }
}

describe("lib/ai/eval/harness.runEvalSuite", () => {
  it("runs all cases and preserves the source case id", async () => {
    const cases: EvalCase[] = [
      { id: "case-1", input: { query: "phone" }, expected: { query: "phone" }, locale: "en" },
      { id: "case-2", input: { query: "jacket" }, expected: { query: "jacket" }, locale: "bg" },
    ]

    const runner = vi.fn(async (input: Record<string, unknown>) => input)
    const scorer = vi.fn((expected: unknown, actual: unknown) => {
      const expectedRecord = expected as Record<string, unknown>
      const actualRecord = actual as Record<string, unknown>
      const matched = expectedRecord.query === actualRecord.query
      return {
        caseId: "placeholder",
        passed: matched,
        score: matched ? 1 : 0,
        details: matched ? "exact-match" : "mismatch",
      }
    })

    const results = await runEvalSuite(cases, runner, scorer)

    expect(runner).toHaveBeenCalledTimes(2)
    expect(scorer).toHaveBeenCalledTimes(2)
    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({ caseId: "case-1", passed: true, score: 1 })
    expect(results[1]).toMatchObject({ caseId: "case-2", passed: true, score: 1 })
  })

  it("captures runner failures as failed eval results", async () => {
    const cases: EvalCase[] = [
      { id: "case-ok", input: { mode: "ok" }, expected: { mode: "ok" }, locale: "en" },
      { id: "case-fail", input: { mode: "fail" }, expected: { mode: "fail" }, locale: "en" },
    ]

    const runner = vi.fn(async (input: Record<string, unknown>) => {
      if (input.mode === "fail") throw new Error("boom")
      return input
    })

    const results = await runEvalSuite(cases, runner, () => ({
      caseId: "placeholder",
      passed: true,
      score: 1,
      details: "ok",
    }))

    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({ caseId: "case-ok", passed: true, score: 1 })
    expect(results[1]).toMatchObject({
      caseId: "case-fail",
      passed: false,
      score: 0,
      details: "runner-error:boom",
    })
  })

  it("provides a 5-case localized golden set scaffold", () => {
    expect(listingAutofillGoldenSet).toHaveLength(5)
    expect(listingAutofillGoldenSet.some((item) => item.locale === "en")).toBe(true)
    expect(listingAutofillGoldenSet.some((item) => item.locale === "bg")).toBe(true)
  })

  it("scores a mock listing-autofill suite without AI calls", async () => {
    const mockRunner = vi.fn(async (input: Record<string, unknown>) => {
      const imageDescription = String(input.imageDescription ?? "").toLowerCase()

      if (imageDescription.includes("iphone")) {
        return { title: "Black iPhone 13 smartphone", categoryHint: "phones", condition: "used-excellent" }
      }
      if (imageDescription.includes("zara")) {
        return { title: "Бежово яке Zara", categoryHint: "women-clothing", condition: "used-like-new" }
      }

      return { title: "Generic listing title", categoryHint: "misc", condition: "used-good" }
    })

    const results = await runEvalSuite(
      listingAutofillGoldenSet.slice(0, 2),
      mockRunner,
      listingAutofillScorer,
    )

    expect(results).toHaveLength(2)
    expect(results[0]?.caseId).toBe("autofill-en-iphone-used-excellent")
    expect(results[1]?.caseId).toBe("autofill-bg-zara-jacket-like-new")
    expect(results.every((result) => result.passed)).toBe(true)
  })
})
