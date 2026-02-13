import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function SellersEmptyState() {
  const t = useTranslations("SellersDirectory.empty")

  return (
    <div className="text-center py-12">
      <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="size-8 text-muted-foreground" fill="currentColor" viewBox="0 0 256 256">
          <path d="M232,64H208V48a24,24,0,0,0-24-24H72A24,24,0,0,0,48,48V64H24A16,16,0,0,0,8,80v24a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,72,176v32H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16h-8V176a39.8,39.8,0,0,0,15.56-16.53A56.06,56.06,0,0,0,248,104V80A16,16,0,0,0,232,64Z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">
        {t("title")}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        {t("description")}
      </p>
      <Link href="/sell">
        <Button>{t("cta")}</Button>
      </Link>
    </div>
  )
}
