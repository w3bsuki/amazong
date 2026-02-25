import { routing } from "@/i18n/routing"

export function localeStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export function emptyStaticParams() {
  return []
}

/**
 * Next.js (cacheComponents) requires every `generateStaticParams` to return at least
 * one result so it can perform build-time validation.
 *
 * Use this UUID for "build validation only" dynamic routes that are rendered
 * server-side at runtime (auth-required pages, dashboards, etc).
 */
export const BUILD_VALIDATION_UUID = "00000000-0000-0000-0000-000000000000" as const

export function localeStaticParamsWith<T extends Record<string, string>>(params: T) {
  return routing.locales.map((locale) => ({ locale, ...params }))
}
