"use client"

import { useRouter } from "@/i18n/routing"
import { useEffect, useMemo, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"

import { MinimalHeader } from "./minimal-header"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { PageShell } from "../../_components/page-shell"

import { navItems } from "./plans-page-client.config"
import { formatPrice } from "./plans-page-client.helpers"
import type {
  PlansPageClientServerActions,
  PlansPageContent,
  SubscriptionPlanRow,
} from "./plans-page-client.types"
import {
  PlansComparisonSection,
  PlansControls,
  PlansFaqSection,
  PlansFeaturesSection,
  PlansFooter,
  PlansGuaranteeSection,
  PlansHeroSection,
  PlansPricingGrid,
} from "./plans-page-sections"

export default function PlansPageClient(props: {
  locale: string
  initialPlans: SubscriptionPlanRow[]
  initialUserId: string | null
  initialCurrentTier: string
  actions: PlansPageClientServerActions
}) {
  const router = useRouter()
  const locale = props.locale || "en"
  const tPlans = useTranslations("Plans")
  const tCommon = useTranslations("Common")
  const tFooter = useTranslations("Footer")
  const t = tPlans.raw("page") as PlansPageContent
  const actions = props.actions

  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const [yearly, setYearly] = useState(false)
  const [plans] = useState<SubscriptionPlanRow[]>(props.initialPlans)
  const [userId] = useState<string | null>(props.initialUserId)
  const [currentTier, setCurrentTier] = useState<string>(props.initialCurrentTier || "free")
  const [subscribingId, setSubscribingId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("pricing")

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )

    navItems.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => !p.account_type || p.account_type === accountType)
  }, [plans, accountType])

  const handleSelect = async (planId: string, price: number, isCurrent: boolean) => {
    if (!userId) {
      router.push("/auth/login?next=/plans")
      return
    }

    if (isCurrent) return

    setSubscribingId(planId)

    try {
      if (price === 0) {
        const res = await actions.downgradeToFreeTier()
        if (res?.error) throw new Error(res.error)
        setCurrentTier("free")
        toast.success(tPlans("toast.planChanged"))
      } else {
        const billingPeriod = yearly ? "yearly" : "monthly"
        const res = await actions.createSubscriptionCheckoutSession({
          planId,
          billingPeriod,
          locale: locale === "bg" ? "bg" : "en",
        })
        if (res?.error) throw new Error(res.error)
        if (res?.url) {
          window.location.href = res.url
        } else {
          // No URL returned but no error - unexpected state
          throw new Error(tPlans("errors.checkoutSessionFailed"))
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : tCommon("error")
      toast.error(message)
    } finally {
      setSubscribingId(null)
    }
  }

  const formatPriceForLocale = (price: number) => formatPrice(locale, price)

  return (
    <PageShell>
      <MinimalHeader showBack={false}>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ id, icon: Icon }: { id: string; icon: LucideIcon }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(id)}
              className={cn(
                "gap-2 text-muted-foreground",
                activeSection === id && "bg-muted text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span className="text-sm">{t.nav[id as keyof typeof t.nav]}</span>
            </Button>
          ))}
        </nav>
      </MinimalHeader>

      <main className="container py-12">
        <section
          ref={(el) => {
            sectionRefs.current.pricing = el
          }}
        >
          <PlansHeroSection title={t.title} subtitle={t.subtitle} />
        </section>

        <PlansControls
          accountType={accountType}
          setAccountType={setAccountType}
          yearly={yearly}
          setYearly={setYearly}
          t={t}
        />

        <PlansPricingGrid
          filteredPlans={filteredPlans}
          yearly={yearly}
          currentTier={currentTier}
          locale={locale}
          t={t}
          subscribingId={subscribingId}
          onSelect={handleSelect}
        />

        <section
          ref={(el) => {
            sectionRefs.current.comparison = el
          }}
        >
          <PlansComparisonSection
            filteredPlans={filteredPlans}
            yearly={yearly}
            currentTier={currentTier}
            t={t}
            formatPrice={formatPriceForLocale}
          />
        </section>

        <section
          ref={(el) => {
            sectionRefs.current.features = el
          }}
        >
          <PlansFeaturesSection t={t} />
        </section>

        <section
          ref={(el) => {
            sectionRefs.current.guarantee = el
          }}
        >
          <PlansGuaranteeSection t={t} />
        </section>

        <section
          ref={(el) => {
            sectionRefs.current.faq = el
          }}
        >
          <PlansFaqSection t={t} />
        </section>
      </main>

      <PlansFooter tFooter={tFooter} />
    </PageShell>
  )
}

