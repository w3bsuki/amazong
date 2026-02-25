import { SecurityContent } from "./security-content"
import { withAccountPageShell } from "../_lib/account-page-shell"

export const metadata = {
  title: "Security | Treido",
  description: "Update your password and security settings.",
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return withAccountPageShell(params, async ({ locale, user }) => {
    return {
      title: locale === "bg" ? "Сигурност" : "Security",
      content: <SecurityContent locale={locale} userEmail={user.email || ""} />,
    }
  })
}
