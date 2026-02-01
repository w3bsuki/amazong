import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

export default async function NotFound() {
  const t = await getTranslations("CategoryNotFound")

  return (
    <div className="min-h-(--dialog-h-50vh) flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-text-subtle mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-6">
          {t("description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/categories">
            <Button className="w-full sm:w-auto">{t("browseCategories")}</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">{t("goToHomepage")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
