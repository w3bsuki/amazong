"use client"

import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  const maybeLocale = segments[0]
  if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
    segments.shift()
  }
  const normalized = `/${segments.join("/")}`
  return normalized === "/" ? "/" : normalized.replace(/\/+$/, "")
}

interface AuthGateCardProps {
  title: string
  description?: string
  /** Locale-agnostic path to return to after sign-in */
  nextPath?: string
  /** Show "Back to Home" secondary action */
  showBackToHome?: boolean
  className?: string
}

export function AuthGateCard({
  title,
  description,
  nextPath,
  showBackToHome = true,
  className,
}: AuthGateCardProps) {
  const tAuth = useTranslations("Auth")
  const pathname = usePathname()
  const next = stripLocalePrefix(nextPath ?? pathname)

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Lock className="size-5" aria-hidden="true" />
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription className="text-sm">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href={{ pathname: "/auth/login", query: { next } }}>{tAuth("signIn")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={{ pathname: "/auth/sign-up", query: { next } }}>{tAuth("signUp")}</Link>
          </Button>
          {showBackToHome ? (
            <Button asChild variant="ghost">
              <Link href="/">{tAuth("backToHome")}</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="sr-only" />
    </Card>
  )
}

