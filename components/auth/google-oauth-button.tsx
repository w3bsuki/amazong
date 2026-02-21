"use client"

import { useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Chrome, LoaderCircle as SpinnerGap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export function GoogleOAuthButton({
  nextPath,
  onError,
  onNavigateAway,
  className,
}: {
  nextPath: string
  onError?: ((message: string) => void) | undefined
  onNavigateAway?: (() => void) | undefined
  className?: string
}) {
  const t = useTranslations("Auth")
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn("w-full", className)}
      disabled={isPending}
      onClick={() => {
        onNavigateAway?.()
        startTransition(async () => {
          try {
            const supabase = createClient()
            const origin = window.location.origin
            const redirectTo = `${origin}/auth/confirm?locale=${encodeURIComponent(locale)}&next=${encodeURIComponent(nextPath)}`

            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo },
            })

            if (error) onError?.(t("error"))
          } catch {
            onError?.(t("error"))
          }
        })
      }}
    >
      {isPending ? (
        <SpinnerGap className="size-5 animate-spin motion-reduce:animate-none" />
      ) : (
        <Chrome className="size-5" />
      )}
      {t("continueWithGoogle")}
    </Button>
  )
}
