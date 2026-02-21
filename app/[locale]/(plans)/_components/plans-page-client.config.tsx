import { ChartColumn as ChartBar, CreditCard, Crown, Rocket, ShieldCheck, Sparkles as Sparkle, Star, CircleHelp as Question, Store as Storefront, User, Zap as Lightning } from "lucide-react"

import type { PlansFeatureIconKey } from "./plans-page-client.types"

export const planIcons: Record<string, React.ReactNode> = {
  free: <User className="size-4" />,
  basic: <User className="size-4" />,
  starter: <Storefront className="size-4" />,
  premium: <Crown className="size-4" />,
  pro: <Star className="size-4" />,
  ultimate: <Rocket className="size-4" />,
}

export const navItems = [
  { id: "pricing", icon: CreditCard },
  { id: "comparison", icon: ChartBar },
  { id: "features", icon: Sparkle },
  { id: "guarantee", icon: ShieldCheck },
  { id: "faq", icon: Question },
] as const

export const featureIcons: Record<PlansFeatureIconKey, React.ComponentType<{ className?: string }>> = {
  lightning: Lightning,
  rocket: Rocket,
  sparkle: Sparkle,
}
