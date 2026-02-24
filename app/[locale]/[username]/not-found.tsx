import { Link } from "@/i18n/routing"
import { getLocale, getTranslations } from "next-intl/server"
import { PageShell } from "../_components/page-shell"

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: "ProfileNotFound" })

  return (
    <PageShell className="py-10">
      <div className="mx-auto w-full max-w-2xl rounded-lg border border-border bg-card px-4 py-10">
        <div className="text-6xl font-bold text-muted-foreground">404</div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("description")}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-interactive-hover"
          >
            {t("goToHomepage")}
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            {t("searchProducts")}
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
