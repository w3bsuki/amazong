import { notFound } from "next/navigation"
import { setRequestLocale, getTranslations } from "next-intl/server"

import { isAiAssistantEnabled } from "@/lib/ai/env"
import { AssistantPlayground } from "./_components/assistant-playground"

export default async function AssistantPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  if (!isAiAssistantEnabled()) notFound()

  const t = await getTranslations("Assistant")
  const safeLocale = locale === "bg" ? "bg" : "en"

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      <AssistantPlayground locale={safeLocale} />
    </div>
  )
}

