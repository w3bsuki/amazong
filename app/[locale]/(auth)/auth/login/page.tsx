import { LoginForm } from "../../_components/login-form"
import { login } from "../../_actions/auth"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "Auth" })

  return {
    title: t("signIn"),
  }
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ next?: string; redirect?: string }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const redirectPath = sp.redirect ?? sp.next ?? null
  return <LoginForm locale={locale} redirectPath={redirectPath} loginAction={login} />
}
