import { ForgotPasswordForm } from "../../_components/forgot-password-form"
import { requestPasswordReset } from "../../_actions/auth"

export const metadata = {
  title: "Forgot Password | Treido",
  description: "Request a password reset link for your Treido account.",
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <ForgotPasswordForm locale={locale} requestPasswordResetAction={requestPasswordReset} />
}
