import { LoginForm } from "../../_components/login-form"
import { login } from "../../_actions/auth"
import type { Metadata } from "next"
import { buildRouteMetadata, resolveRouteLocale } from "../_lib/route-locale-metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  return buildRouteMetadata({
    params,
    namespace: "Auth",
    titleKey: "signIn",
  })
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ next?: string; redirect?: string }>
}) {
  const locale = await resolveRouteLocale(params)
  const sp = await searchParams
  const redirectPath = sp.redirect ?? sp.next ?? null
  return <LoginForm locale={locale} redirectPath={redirectPath} loginAction={login} />
}
