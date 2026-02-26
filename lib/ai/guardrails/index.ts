import "server-only"

import type { ZodSchema } from "zod"

import { isSafeUserProvidedUrl } from "@/lib/ai/safe-url"

export type GuardrailResult = { ok: boolean; reason?: string }

const MAX_TEXT_CHARS = 2000
const MAX_IMAGE_URL_CHARS = 2048

const MALICIOUS_PROMPT_PATTERNS = [
  /ignore\s+previous\s+instructions/i,
  /reveal\s+(the\s+)?system\s+prompt/i,
  /\bjailbreak\b/i,
  /\bbypass\b.+\b(safety|policy|guardrail)\b/i,
  /<script[\s>]/i,
  /\b(drop|truncate)\s+table\b/i,
]

const PII_PATTERNS: Array<{ id: string; regex: RegExp }> = [
  { id: "email", regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
  { id: "phone", regex: /(?:\+?\d[\d\s().-]{7,}\d)/ },
  { id: "credit_card", regex: /\b(?:\d[ -]*?){13,19}\b/ },
  { id: "iban", regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/ },
]

const EXPECTED_PII_FIELD_PATTERNS = [
  /email/i,
  /phone/i,
  /contact/i,
  /iban/i,
  /card/i,
]

function isExpectedPiiPath(path: string[]): boolean {
  const leaf = path[path.length - 1] ?? ""
  return EXPECTED_PII_FIELD_PATTERNS.some((pattern) => pattern.test(leaf))
}

function findPiiLikeString(
  value: unknown,
  path: string[] = [],
): { path: string[]; piiType: string } | null {
  if (typeof value === "string") {
    for (const pattern of PII_PATTERNS) {
      if (pattern.regex.test(value) && !isExpectedPiiPath(path)) {
        return { path, piiType: pattern.id }
      }
    }
    return null
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const match = findPiiLikeString(value[index], [...path, String(index)])
      if (match) return match
    }
    return null
  }

  if (typeof value === "object" && value !== null) {
    for (const [key, nested] of Object.entries(value)) {
      const match = findPiiLikeString(nested, [...path, key])
      if (match) return match
    }
  }

  return null
}

export function preInferenceCheck(input: {
  text?: string
  imageUrl?: string
  userId: string
}): GuardrailResult {
  if (!input.userId || input.userId.trim().length === 0) {
    return { ok: false, reason: "missing-user-id" }
  }

  const text = input.text
  if (typeof text === "string") {
    if (text.length > MAX_TEXT_CHARS) {
      return { ok: false, reason: "text-too-long" }
    }
    if (MALICIOUS_PROMPT_PATTERNS.some((pattern) => pattern.test(text))) {
      return { ok: false, reason: "malicious-input-pattern" }
    }
  }

  const imageUrl = input.imageUrl
  if (typeof imageUrl === "string") {
    if (imageUrl.length > MAX_IMAGE_URL_CHARS) {
      return { ok: false, reason: "image-url-too-long" }
    }
    if (!isSafeUserProvidedUrl(imageUrl)) {
      return { ok: false, reason: "unsafe-image-url" }
    }
  }

  return { ok: true }
}

export function postInferenceCheck<T>(
  output: T,
  schema: ZodSchema<T>,
): { ok: boolean; validated: T | null; reason?: string } {
  const parsed = schema.safeParse(output)
  if (!parsed.success) {
    return { ok: false, validated: null, reason: "schema-validation-failed" }
  }

  const piiHit = findPiiLikeString(parsed.data)
  if (piiHit) {
    return {
      ok: false,
      validated: null,
      reason: `pii-detected:${piiHit.piiType}@${piiHit.path.join(".") || "root"}`,
    }
  }

  return { ok: true, validated: parsed.data }
}
