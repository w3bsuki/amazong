import { Button } from "@/components/ui/button"

export default function GiftCardsHero({ t }: { t: (key: string) => string }) {
  return (
    <div className="bg-header-bg text-header-text py-8 px-4">
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{t("title")}</h1>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <Button variant="secondary" className="bg-background text-foreground hover:bg-muted rounded-full px-6">
            {t("allGiftCards")}
          </Button>
          <Button variant="ghost" className="text-header-text hover:bg-header-text/10 rounded-full px-6">
            {t("eGiftCards")}
          </Button>
          <Button variant="ghost" className="text-header-text hover:bg-header-text/10 rounded-full px-6">
            {t("printAtHome")}
          </Button>
          <Button variant="ghost" className="text-header-text hover:bg-header-text/10 rounded-full px-6">
            {t("mail")}
          </Button>
        </div>
      </div>
    </div>
  )
}
