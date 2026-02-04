import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase/server"
import { ADMIN_DOC_TEMPLATES, ADMIN_DOC_TEMPLATES_BG } from "./templates"

const SUPPORTED_LOCALES = new Set(["en", "bg"])
const SEED_CATEGORIES = new Set(["ops", "guides"])

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

  const requestBody = await request
    .json()
    .catch(() => ({} as { locale?: unknown }))
  const rawLocale =
    typeof requestBody === "object" && requestBody && "locale" in requestBody
      ? requestBody.locale
      : undefined
  const locale = SUPPORTED_LOCALES.has(String(rawLocale)) ? String(rawLocale) : "en"

  const { data: existing, error: existingError } = await supabase
    .from("admin_docs")
    .select("slug")
    .eq("locale", locale)

  if (existingError) {
    return json({ error: "failed_to_load_existing" }, { status: 500 })
  }

  const existingSlugs = new Set((existing ?? []).map((d) => d.slug))
  const templatesAll = locale === "bg" ? ADMIN_DOC_TEMPLATES_BG : ADMIN_DOC_TEMPLATES
  const templates = templatesAll.filter((t) => SEED_CATEGORIES.has(t.category))
  const toInsert = templates.filter((t) => !existingSlugs.has(t.slug)).map((t) => ({
    title: t.title,
    slug: t.slug,
    category: t.category,
    status: t.status,
    content: t.content,
    author_id: user.id,
    locale,
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
