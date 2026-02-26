export type EvalCase = {
  id: string
  input: Record<string, unknown>
  expected: Record<string, unknown>
  locale: "en" | "bg"
}

export type EvalResult = {
  caseId: string
  passed: boolean
  score: number
  details: string
}

export async function runEvalSuite(
  cases: EvalCase[],
  runner: (input: Record<string, unknown>) => Promise<unknown>,
  scorer: (expected: unknown, actual: unknown) => EvalResult,
): Promise<EvalResult[]> {
  const results: EvalResult[] = []

  for (const evalCase of cases) {
    try {
      const actual = await runner(evalCase.input)
      const scored = scorer(evalCase.expected, actual)
      results.push({ ...scored, caseId: evalCase.id })
    } catch (error) {
      const details = error instanceof Error ? error.message : "unknown runner error"
      results.push({
        caseId: evalCase.id,
        passed: false,
        score: 0,
        details: `runner-error:${details}`,
      })
    }
  }

  return results
}
