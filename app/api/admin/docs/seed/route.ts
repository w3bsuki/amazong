import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { ADMIN_DOC_TEMPLATES } from "./templates"

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(request)
  const json = (body: unknown, init?: ResponseInit) =>
    applyCookies(NextResponse.json(body, init))

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return json({ error: "unauthorized" }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return json({ error: "forbidden" }, { status: 403 })
  }

  const { data: existing, error: existingError } = await supabase
    .from("admin_docs")
    .select("slug")

  if (existingError) {
    return json({ error: "failed_to_load_existing" }, { status: 500 })
  }

  const existingSlugs = new Set((existing ?? []).map((d) => d.slug))
  const toInsert = ADMIN_DOC_TEMPLATES.filter((t) => !existingSlugs.has(t.slug)).map((t) => ({
    title: t.title,
    slug: t.slug,
    category: t.category,
    status: t.status,
    content: t.content,
    author_id: user.id,
  }))

  if (toInsert.length === 0) {
    return json({ inserted: 0 })
  }

  const { error: insertError } = await supabase.from("admin_docs").insert(toInsert)
  if (insertError) {
    return json({ error: "failed_to_seed" }, { status: 500 })
  }

  return json({ inserted: toInsert.length })
}
