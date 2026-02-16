import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      status: "ready",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}

export function HEAD() {
  return new Response(null, { status: 200 })
}
