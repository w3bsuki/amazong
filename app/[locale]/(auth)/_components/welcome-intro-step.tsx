"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CircleCheck as CheckCircle, PartyPopper as Confetti, Sparkles as Sparkle } from "lucide-react"
import { useTranslations } from "next-intl"

export function WelcomeIntroStep({
  name,
  isPending,
  onStart,
  onSkip,
}: {
  name: string
  isPending: boolean
  onStart: () => void
  onSkip: () => void
}) {
  const t = useTranslations("Onboarding")

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      <div className="relative bg-primary px-6 py-10 text-center text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-hover rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-hover rounded-full" />
          <Confetti className="absolute top-4 right-4 size-8 text-foreground opacity-80" />
          <Confetti className="absolute bottom-4 left-4 size-6 text-foreground opacity-80" />
        </div>

        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="size-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="size-12 text-primary-foreground" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-2"
          >
            {t("accountType.title")} {name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-foreground"
          >
            {t("accountType.subtitle")}
          </motion.p>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2 text-center">{t("profile.title")}</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {t("profile.subtitle")}
        </p>

        <div className="space-y-3">
          <Button onClick={onStart} className="w-full h-12 bg-primary text-primary-foreground hover:bg-interactive-hover">
            <Sparkle className="size-5 mr-2" />
            {t("common.continue")}
          </Button>
          <button
            type="button"
            onClick={onSkip}
            disabled={isPending}
            className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
          >
            {isPending ? t("common.processing") : t("common.skipForNow")}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
