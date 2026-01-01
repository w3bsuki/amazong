import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

function getLocaleFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/([a-zA-Z]{2})(?:\/|$)/)
  const locale = match?.[1]
  return locale ? locale.toLowerCase() : null
}

function isAccountPath(pathname: string): boolean {
  const locale = getLocaleFromPath(pathname)
  if (locale) return pathname === `/${locale}/account` || pathname.startsWith(`/${locale}/account/`)
  return pathname === '/account' || pathname.startsWith('/account/')
}

function isSellerOrdersPath(pathname: string): boolean {
  const locale = getLocaleFromPath(pathname)
  if (locale) return pathname === `/${locale}/sell/orders` || pathname.startsWith(`/${locale}/sell/orders/`)
  return pathname === '/sell/orders' || pathname.startsWith('/sell/orders/')
}

function isSellPath(pathname: string): boolean {
  const locale = getLocaleFromPath(pathname)
  if (locale) return pathname === `/${locale}/sell` || pathname.startsWith(`/${locale}/sell/`)
  return pathname === '/sell' || pathname.startsWith('/sell/')
}

function isChatPath(pathname: string): boolean {
  const locale = getLocaleFromPath(pathname)
  if (locale) return pathname === `/${locale}/chat` || pathname.startsWith(`/${locale}/chat/`)
  return pathname === '/chat' || pathname.startsWith('/chat/')
}

function withAuthCookieDomain<TOptions extends Record<string, unknown> | undefined>(
  options: TOptions,
): TOptions {
  if (!options || typeof options !== 'object') return options
  const domain = process.env.AUTH_COOKIE_DOMAIN
  // Only apply an explicit cookie domain in production. In local dev/E2E on
  // localhost, setting a non-local domain prevents the browser from sending
  // the auth cookies back, which breaks SSR-protected routes.
  if (!domain || process.env.NODE_ENV !== 'production') return options
  return { ...options, domain }
}

export async function updateSession(request: NextRequest, response?: NextResponse) {
  const pathname = request.nextUrl.pathname
  const locale = getLocaleFromPath(pathname)
  const authPrefix = locale ? `/${locale}/auth` : '/auth'
  const loginPath = locale ? `/${locale}/auth/login` : '/auth/login'

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // In E2E/local tests we still want account routes to be protected.
    // If Supabase isn't configured, treat user as unauthenticated.
    if ((isAccountPath(pathname) || isSellPath(pathname) || isChatPath(pathname)) && !pathname.startsWith(authPrefix)) {
      const url = request.nextUrl.clone()
      url.pathname = loginPath
      url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(url)
    }

    console.warn("Supabase environment variables are missing. Skipping session update.")
    return response || NextResponse.next({ request })
  }

  let supabaseResponse = response || NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = response || NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, withAuthCookieDomain(options)))
        },
      },
    },
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /[locale]/account/* (and legacy /account/*) routes.
  if (!user && (isAccountPath(pathname) || isSellPath(pathname) || isChatPath(pathname)) && !pathname.startsWith(authPrefix)) {
    const url = request.nextUrl.clone()
    url.pathname = loginPath
    url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(url)
  }

  // Keep legacy protection behavior (but make it locale-aware as well).
  if (!user && !pathname.startsWith(authPrefix) && pathname.startsWith("/protected")) {
    const url = request.nextUrl.clone()
    url.pathname = loginPath
    url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
