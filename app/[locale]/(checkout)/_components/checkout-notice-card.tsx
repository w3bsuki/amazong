import { Lock } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import type { CheckoutNotice, TranslationFn } from "./checkout-layout-types"

export function CheckoutNoticeCard({
  checkoutNotice,
  t,
  mobile,
}: {
  checkoutNotice: CheckoutNotice
  t: TranslationFn
  mobile?: boolean
}) {
  if (mobile) {
    return (
      <div role="alert" className="rounded-lg border border-border bg-surface-subtle p-3">
        <div className="flex gap-3">
          <div className="mt-0.5 shrink-0">
            <Lock className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">{checkoutNotice.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{checkoutNotice.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button asChild size="default" className="flex-1">
                <Link href={checkoutNotice.primaryAction.href}>{checkoutNotice.primaryAction.label}</Link>
              </Button>
              {checkoutNotice.showSecondaryCartAction && (
                <Button asChild size="default" variant="secondary" className="flex-1">
                  <Link href="/cart">{t("backToCart")}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div role="alert" className="mb-5 rounded-lg border border-border bg-surface-subtle p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 size-5 text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{checkoutNotice.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{checkoutNotice.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="default">
            <Link href={checkoutNotice.primaryAction.href}>{checkoutNotice.primaryAction.label}</Link>
          </Button>
          {checkoutNotice.showSecondaryCartAction && (
            <Button asChild size="default" variant="secondary">
              <Link href="/cart">{t("backToCart")}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
