"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Buildings, 
  User, 
  ArrowLeft,
  Package,
  SignOut,
  UserCircle,
  SpinnerGap,
  Check,
  CaretRight,
  Rocket,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { PlansGrid, PlansGridSkeleton, type Plan } from "@/components/plan-card"
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = {
  en: [
    { q: "Is it free to list?", a: "Yes! List for FREE within your plan's limit. You only pay when your item sells." },
    { q: "When do I pay?", a: "Only when you make a sale. We deduct a small % from your earnings - you never pay upfront." },
    { q: "How much is the fee?", a: "Free plan: 12%. Plus: 9%. Pro: 6%. Business Enterprise: just 3%. The more you sell, the more you save!" },
    { q: "What if I exceed my listing limit?", a: "Simply upgrade to a higher plan for more listings and lower fees. No surprise charges!" },
    { q: "Can I switch between plans?", a: "Yes, upgrade or downgrade anytime. Changes take effect immediately." },
    { q: "Can I cancel anytime?", a: "Yes. Access continues until your billing period ends. No cancellation fees." },
    { q: "What are boosts?", a: "Boosts increase your listing visibility in search results for 7 days. Paid plans include free boosts!" },
    { q: "Why should I pay for a plan?", a: "Free plan is great for casual sellers. Paid plans give you more listings, lower fees, and features like analytics and boosts." },
  ],
  bg: [
    { q: "Безплатно ли е да обявя продукт?", a: "Да! Публикувай БЕЗПЛАТНО в рамките на лимита. Плащаш само когато продадеш." },
    { q: "Кога плащам?", a: "Само при продажба. Удържаме малък % от печалбата ти - никога не плащаш предварително." },
    { q: "Колко е таксата?", a: "Безплатен план: 12%. Plus: 9%. Pro: 6%. Business Enterprise: само 3%. Колкото повече продаваш, толкова повече спестяваш!" },
    { q: "Какво става ако надвиша лимита?", a: "Просто надгради към по-висок план за повече обяви и по-ниски такси. Без изненади!" },
    { q: "Мога ли да сменям планове?", a: "Да, надградете или понижете по всяко време. Промените влизат в сила веднага." },
    { q: "Мога ли да откажа по всяко време?", a: "Да. Достъпът продължава до края на платения период. Без такси за отказ." },
    { q: "Какво са бустовете?", a: "Бустовете увеличават видимостта на обявите за 7 дни. Платените планове включват безплатни бустове!" },
    { q: "Защо да плащам за план?", a: "Безплатният план е страхотен за случайни продавачи. Платените дават повече обяви, по-ниски такси и функции като аналитика и бустове." },
  ],
}

const translations = {
  en: {
    title: "Choose your plan",
    subtitle: "No hidden fees. Cancel anytime.",
    personal: "Personal",
    business: "Business",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 17%",
    backToHome: "Back",
    currentPlan: "Your current plan",
    signIn: "Sign In",
    signOut: "Sign Out",
    faq: "Questions?",
    startSelling: "Start selling today",
    startSellingDesc: "Join thousands of sellers. Create your store in minutes.",
    createStore: "Create Your Store",
    signUpFree: "Sign Up Free",
  },
  bg: {
    title: "Изберете план",
    subtitle: "Без скрити такси. Отказ по всяко време.",
    personal: "Личен",
    business: "Бизнес",
    monthly: "Месечно",
    yearly: "Годишно",
    save: "Спестете 17%",
    backToHome: "Назад",
    currentPlan: "Вашият текущ план",
    signIn: "Вход",
    signOut: "Изход",
    faq: "Въпроси?",
    startSelling: "Започнете да продавате днес",
    startSellingDesc: "Присъединете се към хиляди продавачи. Създайте магазин за минути.",
    createStore: "Създайте магазин",
    signUpFree: "Регистрация",
  }
}

export default function PlansPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || "en"
  const t = translations[locale as keyof typeof translations] || translations.en
  
  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [currentTier, setCurrentTier] = useState<string>("basic")
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null)

  // Check auth state + fetch seller tier
  useEffect(() => {
    const supabase = createClient()
    
    async function loadUserAndSeller() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)
      setAuthLoading(false)
      
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tier, account_type')
          .eq('id', authUser.id)
          .single()
        
        if (profile) {
          setCurrentTier(profile.tier || 'basic')
          if (profile.account_type) {
            setAccountType(profile.account_type)
          }
        }
      }
    }
    
    loadUserAndSeller()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: SupabaseUser | null } | null) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/plans")
        if (res.ok) {
          const data = await res.json()
          setPlans(data)
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleSelectPlan = async (plan: Plan) => {
    // If not logged in, redirect to sell page (which handles auth)
    if (!user) {
      router.push(`/${locale}/sell`)
      return
    }

    // If already on this plan, do nothing
    if (plan.tier === currentTier) {
      return
    }

    // Free plan - just show info
    if (plan.price_monthly === 0) {
      toast.info(locale === "bg" ? "Това е безплатният план" : "This is the free plan")
      return
    }

    setSubscribingPlanId(plan.id)
    
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingPeriod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(locale === "bg" ? "Грешка при плащане" : "Payment error")
    } finally {
      setSubscribingPlanId(null)
    }
  }

  const filteredPlans = plans.filter(p => p.account_type === accountType)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link 
            href={`/${locale}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm font-medium">{t.backToHome}</span>
          </Link>
          
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Package weight="bold" className="size-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">Amazong</span>
          </Link>
          
          {authLoading ? (
            <div className="w-20 h-9 bg-muted rounded-md animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/account`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserCircle className="size-4" weight="fill" />
                  <span className="hidden sm:inline max-w-24 truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-muted-foreground"
              >
                {isSigningOut ? (
                  <SpinnerGap className="size-4 animate-spin" />
                ) : (
                  <SignOut className="size-4" />
                )}
              </Button>
            </div>
          ) : (
            <Link href={`/${locale}/auth/login`}>
              <Button variant="outline" size="sm">
                {t.signIn}
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8 md:py-12 flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* Account Type Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-muted/60 border">
            <button
              onClick={() => setAccountType("personal")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                accountType === "personal"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User weight={accountType === "personal" ? "fill" : "regular"} className="size-4" />
              {t.personal}
            </button>
            <button
              onClick={() => setAccountType("business")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                accountType === "business"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Buildings weight={accountType === "business" ? "fill" : "regular"} className="size-4" />
              {t.business}
            </button>
          </div>

          <div className="hidden sm:block w-px h-8 bg-border" />

          {/* Billing Toggle */}
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-sm font-medium transition-colors",
              billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"
            )}>
              {t.monthly}
            </span>
            <Switch 
              checked={billingPeriod === "yearly"}
              onCheckedChange={(checked) => setBillingPeriod(checked ? "yearly" : "monthly")}
            />
            <span className={cn(
              "text-sm font-medium transition-colors flex items-center gap-1.5",
              billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"
            )}>
              {t.yearly}
              <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                {t.save}
              </Badge>
            </span>
          </div>
        </div>

        {/* Current Plan Indicator (when logged in) */}
        {user && currentTier !== "basic" && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
              <Check weight="bold" className="size-3 text-emerald-500" />
              {t.currentPlan}: <span className="font-semibold capitalize">{currentTier}</span>
            </Badge>
          </div>
        )}

        {/* Plans Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={accountType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <PlansGridSkeleton count={accountType === "personal" ? 2 : 3} variant="full" />
            ) : (
              <PlansGrid
                plans={filteredPlans}
                locale={locale}
                billingPeriod={billingPeriod}
                currentTier={currentTier}
                loadingPlanId={subscribingPlanId}
                onSelectPlan={handleSelectPlan}
                variant="full"
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* How Fees Work Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-2">
            {locale === "bg" ? "Как работят таксите?" : "How do fees work?"}
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
            {locale === "bg" 
              ? "Всички такси се плащат от продавача. Купувачите никога не плащат такси."
              : "All fees are paid by sellers from their earnings. Buyers never pay fees."}
          </p>
          
          {/* Fee Cards */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 mb-10">
            {/* Subscription */}
            <div className="bg-card border rounded-xl p-4 text-center">
              <div className="size-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package weight="duotone" className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">
                {locale === "bg" ? "Абонамент" : "Subscription"}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {locale === "bg" ? "Месечна/годишна такса за план" : "Monthly/yearly plan fee"}
              </p>
              <p className="text-lg font-bold text-primary">$0 - $200</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {locale === "bg" ? "По-високи планове = по-ниски такси" : "Higher plans = lower fees"}
              </p>
            </div>
            
            {/* Final Value Fee */}
            <div className="bg-card border rounded-xl p-4 text-center">
              <div className="size-10 mx-auto mb-3 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-amber-500">%</span>
              </div>
              <h3 className="font-semibold mb-1 text-sm">
                {locale === "bg" ? "Такса продажба" : "Sale Fee (FVF)"}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {locale === "bg" ? "% от цената при продажба" : "% of price when item sells"}
              </p>
              <p className="text-lg font-bold text-amber-500">3% - 12%</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {locale === "bg" ? "По-нисък от eBay (13%)" : "Lower than eBay (13%)"}
              </p>
            </div>
            
            {/* Per-Order Fee */}
            <div className="bg-card border rounded-xl p-4 text-center">
              <div className="size-10 mx-auto mb-3 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-500">$</span>
              </div>
              <h3 className="font-semibold mb-1 text-sm">
                {locale === "bg" ? "Такса поръчка" : "Per-Order Fee"}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {locale === "bg" ? "Фиксирана такса за обработка" : "Flat fee for payment processing"}
              </p>
              <p className="text-lg font-bold text-emerald-500">0 - 0.25 лв</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {locale === "bg" ? "Enterprise: БЕЗ такса!" : "Enterprise: NO fee!"}
              </p>
            </div>
            
            {/* Insertion Fee */}
            <div className="bg-card border rounded-xl p-4 text-center">
              <div className="size-10 mx-auto mb-3 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-500">+</span>
              </div>
              <h3 className="font-semibold mb-1 text-sm">
                {locale === "bg" ? "Такса обява" : "Insertion Fee"}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {locale === "bg" ? "За обяви над безплатния лимит" : "For listings over free allowance"}
              </p>
              <p className="text-lg font-bold text-blue-500">0 - 0.30 лв</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {locale === "bg" ? "Безплатни обяви: 50-∞" : "Free listings: 50-∞"}
              </p>
            </div>
          </div>
          
          {/* Example Calculation */}
          <div className="bg-card border rounded-xl p-5 max-w-md mx-auto">
            <h3 className="font-semibold mb-3 text-center">
              {locale === "bg" ? "Пример: Продажба на 50 лв" : "Example: Selling a 50 лв item"}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === "bg" ? "Цена на артикула" : "Item price"}</span>
                <span className="font-medium">50.00 лв</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>{locale === "bg" ? "Такса продажба (8%)" : "Sale fee (8%)"}</span>
                <span>-4.00 лв</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>{locale === "bg" ? "Такса поръчка" : "Per-order fee"}</span>
                <span>-0.20 лв</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>{locale === "bg" ? "Вие получавате" : "You receive"}</span>
                <span className="text-lg">45.80 лв</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-center pt-2">
                {locale === "bg" 
                  ? "* Пример с Basic план ($15/мес). По-високите планове = по-малко такси!"
                  : "* Example with Basic plan ($15/mo). Higher plans = even less fees!"}
              </p>
            </div>
          </div>
          
          {/* Comparison Table */}
          <div className="mt-8 bg-card border rounded-xl p-4 overflow-x-auto">
            <h3 className="font-semibold text-center mb-4">
              {locale === "bg" ? "Сравнение с други платформи" : "How we compare"}
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">{locale === "bg" ? "Платформа" : "Platform"}</th>
                  <th className="text-center py-2 px-2">{locale === "bg" ? "Такса продажба" : "Sale Fee"}</th>
                  <th className="text-center py-2 px-2">{locale === "bg" ? "На поръчка" : "Per-Order"}</th>
                  <th className="text-center py-2 pl-4">{locale === "bg" ? "Абонамент" : "Subscription"}</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="py-2 pr-4 font-medium text-foreground">eBay</td>
                  <td className="text-center py-2 px-2">12.7-14.9%</td>
                  <td className="text-center py-2 px-2">$0.30-0.40</td>
                  <td className="text-center py-2 pl-4">$4.95-299/mo</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-medium text-foreground">Amazon</td>
                  <td className="text-center py-2 px-2">8-17%*</td>
                  <td className="text-center py-2 px-2">$0.99/item†</td>
                  <td className="text-center py-2 pl-4">$39.99/mo</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-medium text-foreground">Etsy</td>
                  <td className="text-center py-2 px-2">6.5% + 3%</td>
                  <td className="text-center py-2 px-2">$0.20</td>
                  <td className="text-center py-2 pl-4">$15/mo</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="py-2 pr-4 font-bold text-primary">Amazong</td>
                  <td className="text-center py-2 px-2 font-bold text-primary">3-12%</td>
                  <td className="text-center py-2 px-2 font-bold text-primary">0-0.25 лв</td>
                  <td className="text-center py-2 pl-4 font-bold text-primary">$0-200/mo</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">
              {locale === "bg" 
                ? "* Amazon: 8% за електроника, 15% за повечето, до 20% за бижута. † Без Pro план."
                : "* Amazon: 8% electronics, 15% most categories, up to 20% jewelry. † Without Pro plan."}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-center mb-6">{t.faq}</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems[locale as keyof typeof faqItems]?.map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`faq-${i}`}
                className="bg-card border rounded-lg px-4 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left text-sm font-medium py-3 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-3">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-12 md:py-16 px-4">
          <div className="container max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 md:p-10 border border-primary/20">
              <div className="inline-flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
                <Rocket weight="fill" className="size-6 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">{t.startSelling}</h2>
              <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
                {t.startSellingDesc}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" onClick={() => router.push(`/${locale}/sell`)}>
                  {t.createStore}
                  <CaretRight className="size-4 ml-1" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push(`/${locale}/auth/sign-up`)}>
                  {t.signUpFree}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 Amazong</p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
              {locale === "bg" ? "Условия" : "Terms"}
            </Link>
            <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
              {locale === "bg" ? "Поверителност" : "Privacy"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
