"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, WarningCircle, SpinnerGap } from "@phosphor-icons/react"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const t = useTranslations('Auth')
  const locale = useLocale()

  // Email validation
  const isValidEmail = useCallback((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }, [])

  const emailError = emailTouched && email && !isValidEmail(email)
  const emailValid = emailTouched && email && isValidEmail(email)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {},
      })
      if (error) throw error
      // Force a hard reload to ensure auth state is synced, respecting current locale
      window.location.href = `/${locale}/`
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = isValidEmail(email) && password.length >= 1

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-[350px]">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <span className="text-3xl font-bold tracking-tighter">amazon</span>
          </div>
          <Card className="rounded-sm border-border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-normal">{t('signIn')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="font-bold text-xs">
                      {t('emailOrPhone')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                        className={cn(
                          "h-8 rounded-sm border-input focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset] pr-8",
                          emailError && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
                          emailValid && "border-brand-success focus-visible:ring-brand-success focus-visible:border-brand-success"
                        )}
                      />
                      {emailValid && (
                        <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-brand-success" weight="fill" />
                      )}
                      {emailError && (
                        <WarningCircle className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-destructive" weight="fill" />
                      )}
                    </div>
                    {emailError && (
                      <p className="text-[10px] text-destructive">Please enter a valid email address</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="font-bold text-xs">
                        {t('password')}
                      </Label>
                      <Link href="#" className="text-xs text-link hover:text-link-hover hover:underline">
                        {t('forgotPassword')}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-8 rounded-sm border-input focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset]"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                      <WarningCircle className="size-4 shrink-0" weight="fill" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-brand hover:bg-brand/90 text-foreground border border-brand-dark rounded-sm h-8 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] text-sm font-normal gap-2"
                    disabled={isLoading || !isFormValid}
                  >
                    {isLoading && <SpinnerGap className="size-4 animate-spin" />}
                    {isLoading ? t('signingIn') : t('signIn')}
                  </Button>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  {t('byContinuing')}{" "}
                  <Link href="#" className="text-link hover:underline">
                    {t('conditionsOfUse')}
                  </Link>{" "}
                  {t('and')}{" "}
                  <Link href="#" className="text-link hover:underline">
                    {t('privacyNotice')}
                  </Link>
                  .
                </div>

                <div className="mt-6 flex items-center gap-2 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                  <span className="text-xs text-muted-foreground">{t('newToAmazon')}</span>
                </div>

                <Link href="/auth/sign-up" className="mt-4 block">
                  <Button
                    variant="outline"
                    className="w-full bg-muted hover:bg-muted/80 border-border shadow-sm h-8 text-sm font-normal rounded-sm"
                  >
                    {t('createAccount')}
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-y-2">
          <div className="flex justify-center gap-8 text-xs text-link">
            <Link href="#" className="hover:text-link-hover hover:underline">
              {t('conditionsOfUse')}
            </Link>
            <Link href="#" className="hover:text-link-hover hover:underline">
              {t('privacyNotice')}
            </Link>
            <Link href="#" className="hover:text-link-hover hover:underline">
              {t('help')}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </div>
  )
}
