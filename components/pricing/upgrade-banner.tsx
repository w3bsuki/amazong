"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Crown, Star, ArrowRight, Rocket } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlansModal } from "@/components/pricing/plans-modal"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

interface UpgradeBannerProps {
  /** Current user's tier */
  currentTier?: string
  /** Visual variant */
  variant?: "default" | "compact" | "card"
  /** Additional CSS classes */
  className?: string
}

// =============================================================================
// Translations
// =============================================================================

const translations = {
  en: {
    freeUser: {
      title: "Upgrade to Premium",
      description: "Unlock lower commissions, priority support, and listing boosts",
      cta: "View Plans",
    },
    premiumUser: {
      title: "Go Business",
      description: "Get unlimited listings, analytics, and the verified seller badge",
      cta: "Upgrade Now",
    },
    basicSeller: {
      title: "Start Selling Smarter",
      description: "Lower your 10% commission rate with a Premium or Business plan",
      cta: "Compare Plans",
    },
    badge: "Save up to 50% on fees",
  },
  bg: {
    freeUser: {
      title: "Надградете до Premium",
      description: "Отключете по-ниски комисиони, приоритетна поддръжка и бустове",
      cta: "Виж планове",
    },
    premiumUser: {
      title: "Станете бизнес",
      description: "Получете неограничени обяви, аналитика и верифициран бадж",
      cta: "Надгради сега",
    },
    basicSeller: {
      title: "Продавайте по-умно",
      description: "Намалете 10% комисиона с Premium или Business план",
      cta: "Сравни планове",
    },
    badge: "Спести до 50% от таксите",
  },
}

// =============================================================================
// Main Component
// =============================================================================

export function UpgradeBanner({ 
  currentTier = "basic", 
  variant = "default",
  className,
}: UpgradeBannerProps) {
  const params = useParams()
  const locale = (params?.locale as string) || "en"
  const t = translations[locale as keyof typeof translations] || translations.en

  // Determine content based on tier
  const content = currentTier === "premium" 
    ? t.premiumUser 
    : currentTier === "basic" 
      ? t.basicSeller 
      : t.freeUser

  // Business users don't need upgrade prompts
  if (currentTier === "business") return null

  if (variant === "compact") {
    return (
      <PlansModal
        currentTier={currentTier}
        source="account"
        trigger={
          <button 
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg",
              "bg-linear-to-r from-primary/10 via-primary/5 to-transparent",
              "border border-primary/20 hover:border-primary/40",
              "transition-all hover:shadow-md group",
              className
            )}
          >
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Crown weight="fill" className="size-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{content.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{content.description}</p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </button>
        }
      />
    )
  }

  if (variant === "card") {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-0">
          <div className="relative bg-linear-to-br from-primary/10 via-primary/5 to-background p-5">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <Star 
              weight="fill" 
              className="absolute top-3 right-3 size-5 text-primary/20" 
            />
            
            <div className="relative z-10">
              <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20 text-xs">
                <Rocket weight="fill" className="size-3 mr-1" />
                {t.badge}
              </Badge>
              
              <h3 className="text-lg font-semibold mb-1">{content.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{content.description}</p>
              
              <PlansModal
                currentTier={currentTier}
                source="account"
                trigger={
                  <Button className="w-full sm:w-auto">
                    <Crown weight="fill" className="size-4 mr-2" />
                    {content.cta}
                  </Button>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant - full width banner
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-linear-to-r from-primary/15 via-primary/10 to-primary/5",
        "border border-primary/20 p-4 sm:p-5",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <Star 
        weight="fill" 
        className="absolute top-4 right-4 size-6 text-primary/20" 
      />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Crown weight="fill" className="size-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold">{content.title}</h3>
              <Badge variant="secondary" className="text-2xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                {t.badge}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{content.description}</p>
          </div>
        </div>
        
        <PlansModal
          currentTier={currentTier}
          source="account"
          trigger={
            <Button className="w-full sm:w-auto shrink-0">
              {content.cta}
              <ArrowRight className="size-4 ml-2" />
            </Button>
          }
        />
      </div>
    </div>
  )
}
