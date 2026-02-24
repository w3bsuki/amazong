import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { getLocale, getTranslations } from "next-intl/server"
import { PageShell } from "../../../_components/page-shell"

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: "CategoryNotFound" })

  return (
    <PageShell className="py-10">
      <div className="mx-auto flex min-h-(--dialog-h-50vh) w-full max-w-2xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center">
          <div className="mb-4 text-7xl font-bold text-muted-foreground">404</div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="mb-6 text-muted-foreground">
            {t("description")}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/categories">
              <Button className="w-full sm:w-auto">{t("browseCategories")}</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">{t("goToHomepage")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
