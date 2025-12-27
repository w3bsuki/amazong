import { NextRequest, NextResponse } from "next/server";

// Serve a favicon request without letting it fall through to the dynamic
// `/[locale]` segment (e.g. treating `favicon.ico` as a locale).
export function GET(request: NextRequest) {
  const url = new URL("/icon.svg", request.url);
  return NextResponse.redirect(url);
}
