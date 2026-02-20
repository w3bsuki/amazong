import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { noStoreJson } from "@/lib/api/response-helpers"
import { createRouteHandlerClient } from "@/lib/supabase/server"

export function createRouteJsonHelpers(request: NextRequest) {
  const { supabase, applyCookies } = createRouteHandlerClient(request)

  const json = (body: unknown, init?: Parameters<typeof NextResponse.json>[1]) =>
    applyCookies(NextResponse.json(body, init))

  const noStore = (body: unknown, init?: Parameters<typeof noStoreJson>[1]) =>
    applyCookies(noStoreJson(body, init))

  return { supabase, json, noStore }
}

