import { NextResponse } from 'next/server'

type EnvCheck = {
  key: string
  required: boolean
}

const CHECKS: EnvCheck[] = [
  { key: 'NEXT_PUBLIC_APP_URL', required: true },
  { key: 'STRIPE_SECRET_KEY', required: true },
  { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', required: true },
  { key: 'STRIPE_WEBHOOK_SECRET', required: true },
  { key: 'STRIPE_SUBSCRIPTION_WEBHOOK_SECRET', required: true },
]

export async function GET() {
  const missing = CHECKS
    .filter((check) => check.required)
    .filter((check) => !process.env[check.key])
    .map((check) => check.key)

  return NextResponse.json({
    ok: missing.length === 0,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
    missing,
  })
}
