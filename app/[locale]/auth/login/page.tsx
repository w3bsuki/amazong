"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Auth')
  const router = useRouter()

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
      // Force a hard reload to ensure auth state is synced
      window.location.href = "/"
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white dark:bg-zinc-900">
      <div className="w-full max-w-[350px]">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <span className="text-3xl font-bold tracking-tighter">amazon</span>
          </div>
          <Card className="rounded-sm border-zinc-300 shadow-none">
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
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8 rounded-sm border-zinc-400 focus-visible:ring-1 focus-visible:ring-brand-warning focus-visible:border-brand-warning shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="font-bold text-xs">
                        {t('password')}
                      </Label>
                      <Link href="#" className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline">
                        {t('forgotPassword')}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-8 rounded-sm border-zinc-400 focus-visible:ring-1 focus-visible:ring-brand-warning focus-visible:border-brand-warning shadow-[0_1px_0_rgba(255,255,255,0.5),0_1px_0_rgba(0,0,0,0.07)_inset]"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                      <span className="text-lg">!</span> {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-[#f0c14b] hover:bg-[#f4d078] text-black border border-[#a88734] rounded-sm h-8 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] text-sm font-normal"
                    disabled={isLoading}
                  >
                    {isLoading ? t('signingIn') : t('signIn')}
                  </Button>
                </div>

                <div className="mt-4 text-xs text-zinc-600">
                  {t('byContinuing')}{" "}
                  <Link href="#" className="text-[#007185] hover:underline">
                    {t('conditionsOfUse')}
                  </Link>{" "}
                  {t('and')}{" "}
                  <Link href="#" className="text-[#007185] hover:underline">
                    {t('privacyNotice')}
                  </Link>
                  .
                </div>

                <div className="mt-6 flex items-center gap-2 before:h-px before:flex-1 before:bg-zinc-300 after:h-px after:flex-1 after:bg-zinc-300">
                  <span className="text-xs text-zinc-500">{t('newToAmazon')}</span>
                </div>

                <Link href="/auth/sign-up" className="mt-4 block">
                  <Button
                    variant="outline"
                    className="w-full bg-zinc-50 hover:bg-zinc-100 border-zinc-300 shadow-sm h-8 text-sm font-normal rounded-sm"
                  >
                    {t('createAccount')}
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-y-2">
          <div className="flex justify-center gap-8 text-xs text-[#007185]">
            <Link href="#" className="hover:text-[#c7511f] hover:underline">
              {t('conditionsOfUse')}
            </Link>
            <Link href="#" className="hover:text-[#c7511f] hover:underline">
              {t('privacyNotice')}
            </Link>
            <Link href="#" className="hover:text-[#c7511f] hover:underline">
              {t('help')}
            </Link>
          </div>
          <p className="text-xs text-zinc-500">{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </div>
  )
}
