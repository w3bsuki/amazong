import { LoginForm } from "../../_components/login-form"

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
  return <LoginForm locale={locale} redirectPath={redirectPath} />
}
