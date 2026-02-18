import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { DashboardHeaderShell } from "@/components/shared/dashboard-header-shell"
import { Button } from "@/components/ui/button"
import { LocaleSwitcher } from "./locale-switcher"

export async function DashboardHeader() {
  const t = await getTranslations("AdminHeader")

  return (
    <DashboardHeaderShell>
      <h1 className="text-base font-medium">{t("title")}</h1>
      <div className="ml-auto flex items-center gap-2">
        <LocaleSwitcher />
        <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
          <Link href="/" className="dark:text-foreground">
            {t("backToStore")}
          </Link>
        </Button>
      </div>
    </DashboardHeaderShell>
  )
}
