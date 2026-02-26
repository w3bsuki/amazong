import "server-only"

import { assistantChatPromptSpec } from "@/lib/ai/prompts/assistant-chat.v1"
import { listingAutofillPromptSpec } from "@/lib/ai/prompts/listing-autofill.v1"
import { listingDescriptionPromptSpec } from "@/lib/ai/prompts/listing-description.v1"
import { listingFindSimilarPromptSpec } from "@/lib/ai/prompts/listing-find-similar.v1"

export type PromptSpec = {
  id: string
  version: string
  system: string
  inputTemplate?: string
  outputSchemaRef: string
  rolloutStatus: "draft" | "shadow" | "canary" | "active" | "retired"
}

function buildRegistry(prompts: PromptSpec[]): Record<string, PromptSpec> {
  const registry: Record<string, PromptSpec> = {}

  for (const prompt of prompts) {
    if (registry[prompt.id]) {
      throw new Error(`Duplicate prompt id "${prompt.id}"`)
    }
    registry[prompt.id] = prompt
  }

  return registry
}

function parseVersion(version: string): number[] {
  return version.split(".").map((part) => Number.parseInt(part, 10)).map((part) => (Number.isFinite(part) ? part : 0))
}

function compareVersions(left: string, right: string): number {
  const leftParts = parseVersion(left)
  const rightParts = parseVersion(right)
  const maxParts = Math.max(leftParts.length, rightParts.length)

  for (let index = 0; index < maxParts; index += 1) {
    const leftValue = leftParts[index] ?? 0
    const rightValue = rightParts[index] ?? 0
    if (leftValue > rightValue) return 1
    if (leftValue < rightValue) return -1
  }

  return 0
}

export const registry: Record<string, PromptSpec> = buildRegistry([
  listingAutofillPromptSpec,
  assistantChatPromptSpec,
  listingDescriptionPromptSpec,
  listingFindSimilarPromptSpec,
])

export const promptRegistry: Record<string, PromptSpec> = registry

export function getPrompt(id: string): PromptSpec {
  const prompt = registry[id]
  if (!prompt) {
    throw new Error(`Prompt "${id}" not found`)
  }

  return prompt
}

export function getActivePrompt(featureIntent: string): PromptSpec {
  const featurePrefix = `${featureIntent}.v`
  const activePrompts = Object.values(registry).filter(
    (prompt) => prompt.rolloutStatus === "active" && prompt.id.startsWith(featurePrefix),
  )

  if (activePrompts.length === 0) {
    throw new Error(`No active prompt found for feature intent "${featureIntent}"`)
  }

  const [firstPrompt, ...otherPrompts] = activePrompts
  if (!firstPrompt) {
    throw new Error(`No active prompt found for feature intent "${featureIntent}"`)
  }
  if (otherPrompts.length === 0) return firstPrompt

  return otherPrompts.reduce((latest, current) => {
    return compareVersions(current.version, latest.version) > 0 ? current : latest
  }, firstPrompt)
}
