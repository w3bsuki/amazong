/**
 * Global Not Found Page
 * 
 * This page is shown for any unmatched routes across the entire application.
 * It handles 404 errors at the root level.
 * 
 * Note: This is a Server Component so we use basic HTML elements
 * to avoid issues with client-only components (Button uses React Context).
 */
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link, routing } from "@/i18n/routing"
import { PageShell } from "./[locale]/_components/page-shell"

export default async function GlobalNotFound() {
  const locale = routing.defaultLocale
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "GlobalNotFound" })

  return (
    <html lang={locale}>
      <body className="bg-background text-foreground">
        <PageShell className="flex flex-col items-center justify-center p-4">
          <div className="mx-auto max-w-md text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="relative mx-auto h-40 w-40">
                <div className="flex items-center justify-center h-full">
                  <span className="text-8xl font-bold text-muted-foreground">
                    404
                  </span>
                </div>
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="mb-6 text-muted-foreground">
              {t("description")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-interactive-hover"
              >
                {t("goToHomepage")}
              </Link>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              {t("supportPrefix")}{" "}
              <Link href={`/${locale}/contact`} className="text-primary hover:underline">
                {t("supportLink")}
              </Link>
              {t("supportSuffix")}
            </p>
          </div>
        </PageShell>
      </body>
    </html>
  )
}

