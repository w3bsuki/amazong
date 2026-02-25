import type { NextRequest } from "next/server"

import { isAiAssistantEnabled } from "@/lib/ai/env"
import { isSafeUserProvidedUrl } from "@/lib/ai/safe-url"

type JsonFn = (body: unknown, init?: { status?: number; headers?: HeadersInit }) => Response

type SafeParseResult<T> = { success: true; data: T } | { success: false; error: unknown }
type SchemaLike<T> = { safeParse: (input: unknown) => SafeParseResult<T> }

type SupabaseAuthLike = {
  auth: {
    getUser: () => Promise<{ data: { user: unknown | null } }>
  }
}

export async function requireAuthedUser({
  supabase,
  json,
}: {
  supabase: SupabaseAuthLike
  json: JsonFn
}): Promise<{ ok: true; user: unknown } | { ok: false; response: Response }> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      response: json(
        { error: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "private, no-store" } }
      ),
    }
  }

  return { ok: true, user }
}

export function requireAiAssistantEnabled(json: JsonFn): { ok: true } | { ok: false; response: Response } {
  if (!isAiAssistantEnabled()) {
    return { ok: false, response: json({ error: "AI assistant disabled" }, { status: 404 }) }
  }

  return { ok: true }
}

export async function parseRequestJson<T>(
  request: NextRequest,
  schema: SchemaLike<T>,
  json: JsonFn
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return { ok: false, response: json({ error: "Invalid request" }, { status: 400 }) }
  }

  return { ok: true, data: parsed.data }
}

export function validateAiImageUrl(
  imageUrl: string,
  json: JsonFn
): { ok: true } | { ok: false; response: Response } {
  if (!isSafeUserProvidedUrl(imageUrl)) {
    return { ok: false, response: json({ error: "Invalid imageUrl" }, { status: 400 }) }
  }

  return { ok: true }
}

