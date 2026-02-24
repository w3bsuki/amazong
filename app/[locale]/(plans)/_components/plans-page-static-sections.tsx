import { ShieldCheck } from "lucide-react"

import { Link } from "@/i18n/routing"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

import { featureIcons } from "./plans-page-client.config"
import type { PlansPageContent } from "./plans-page-client.types"

export function PlansHeroSection({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section id="pricing" className="mb-12 scroll-mt-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{subtitle}</p>
    </section>
  )
}

export function PlansControls({
  accountType,
  setAccountType,
  yearly,
  setYearly,
  t,
}: {
  accountType: "personal" | "business"
  setAccountType: (value: "personal" | "business") => void
  yearly: boolean
  setYearly: (value: boolean) => void
  t: PlansPageContent
}) {
  return (
    <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <div className="flex items-center gap-3 rounded-full border bg-surface-subtle p-1">
        <button
          type="button"
          onClick={() => setAccountType("personal")}
          aria-pressed={accountType === "personal"}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            accountType === "personal"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t.personal}
        </button>
        <button
          type="button"
          onClick={() => setAccountType("business")}
          aria-pressed={accountType === "business"}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            accountType === "business"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t.business}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className={cn("text-sm", !yearly && "font-medium")}>{t.monthly}</span>
        <Switch checked={yearly} onCheckedChange={setYearly} />
        <span className={cn("text-sm", yearly && "font-medium")}>{t.yearly}</span>
        {yearly && (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            {t.saveLabel}
          </span>
        )}
      </div>
    </div>
  )
}

export function PlansFeaturesSection({ t }: { t: PlansPageContent }) {
  return (
    <section id="features" className="mb-16 scroll-mt-20">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t.features.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t.features.subtitle}</p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-3">
        {t.features.items.map((feature, i) => {
          const Icon = featureIcons[feature.icon]
          return (
            <div key={i} className="flex flex-col items-center bg-background p-4 text-center">
              <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-selected">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function PlansGuaranteeSection({ t }: { t: PlansPageContent }) {
  return (
    <section id="guarantee" className="mb-16 scroll-mt-20">
      <div className="flex flex-col items-center gap-4 rounded-md border border-selected-border bg-hover p-4 text-center sm:flex-row sm:text-left">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-selected">
          <ShieldCheck className="size-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{t.guarantee.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t.guarantee.desc}</p>
        </div>
      </div>
    </section>
  )
}

export function PlansFaqSection({ t }: { t: PlansPageContent }) {
  return (
    <section id="faq" className="scroll-mt-20">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t.faq.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t.faq.subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Accordion type="single" collapsible className="w-full">
          {t.faq.items.map((item, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-b px-0 last:border-0">
              <AccordionTrigger className="px-5 py-4 text-left text-sm hover:no-underline data-[state=open]:bg-selected">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export function PlansFooter({
  tFooter,
}: {
  tFooter: (key: string) => string
}) {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <span className="text-sm text-muted-foreground">{tFooter("copyrightSimple")}</span>
        <div className="flex gap-4 text-sm">
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            {tFooter("terms")}
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            {tFooter("privacyPolicy")}
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            {tFooter("contactUs")}
          </Link>
        </div>
      </div>
    </footer>
  )
}
