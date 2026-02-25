/**
 * Global Not Found Page
 *
 * Shown for unmatched routes outside the locale segment.
 *
 * Keep this file dependency-minimal: Turbopack prerendering is sensitive to
 * route-segment imports and locale-bound helpers here.
 */
import { Suspense } from "react"

import { Link } from "@/i18n/routing"

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="min-h-dvh flex items-center justify-center p-4">
          <div className="mx-auto max-w-md text-center">
            <div className="mb-8">
              <span className="text-8xl font-bold text-muted-foreground">404</span>
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight">Page not found</h1>
            <p className="mb-6 text-muted-foreground">The page you are looking for does not exist.</p>

            <Suspense fallback={null}>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  locale="en"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-interactive-hover"
                >
                  Go to homepage
                </Link>
                <Link
                  href="/contact"
                  locale="en"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Contact us
                </Link>
              </div>
            </Suspense>
          </div>
        </main>
      </body>
    </html>
  )
}

