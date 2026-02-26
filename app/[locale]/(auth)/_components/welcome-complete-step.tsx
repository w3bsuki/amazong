"use client"

import { Link } from "@/i18n/routing"
import { MotionConfig, motion } from "framer-motion"
import { ArrowRight, Check, CircleUser as UserCircle, ShoppingBag, Store as Storefront } from "lucide-react"
import { useTranslations } from "next-intl"

export function WelcomeCompleteStep({ username }: { username: string | null | undefined }) {
  const tOnboarding = useTranslations("Onboarding")
  const tNavigation = useTranslations("Navigation")
  const profileHref = username ? `/${username}` : "/"

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        key="complete"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="size-20 bg-selected rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="size-10 text-primary" />
          </motion.div>

          <h2 className="text-xl font-semibold text-foreground mb-2">{tOnboarding("complete.title")}</h2>
          <p className="text-muted-foreground mb-6">{tOnboarding("complete.subtitle")}</p>

          <div className="space-y-3 text-left">
            <Link href="/" className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-xl border border-border transition-colors group"
              >
                <div className="size-12 bg-selected rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingBag className="size-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{tOnboarding("complete.startBrowsing")}</h3>
                  <p className="text-sm text-muted-foreground">{tOnboarding("complete.subtitle")}</p>
                </div>
                <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            </Link>

            <Link href="/sell" className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-xl border border-border transition-colors group"
              >
                <div className="size-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <Storefront className="size-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{tOnboarding("complete.listFirstItem")}</h3>
                  <p className="text-sm text-muted-foreground">{tOnboarding("complete.completeStore")}</p>
                </div>
                <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            </Link>

            <Link href={profileHref} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 bg-surface-subtle hover:bg-hover active:bg-active rounded-xl border border-border transition-colors group"
              >
                <div className="size-12 bg-selected rounded-xl flex items-center justify-center shrink-0">
                  <UserCircle className="size-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{tNavigation("profile")}</h3>
                  <p className="text-sm text-muted-foreground">{username ? `/${username}` : tOnboarding("complete.completeStore")}</p>
                </div>
                <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  )
}
