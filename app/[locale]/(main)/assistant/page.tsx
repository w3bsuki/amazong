import { notFound } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import type { Metadata } from "next"

import { isAiAssistantEnabled } from "@/lib/ai/env"
import { createPageMetadata } from "@/lib/seo/metadata"
import { AssistantPlayground } from "./_components/assistant-playground"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Assistant" })

  return createPageMetadata({
    locale,
    path: "/assistant",
    title: t("title"),
    description: t("assistantIntro"),
  })
}

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

  const copy = {
    title: t("title"),
    assistantIntro: t("assistantIntro"),
    chatEmpty: t("chatEmpty"),
    chatPlaceholder: t("chatPlaceholder"),
    quickStart: t("quickStart"),
    suggestionOne: t("suggestionOne"),
    suggestionTwo: t("suggestionTwo"),
    suggestionThree: t("suggestionThree"),
    send: t("send"),
    stop: t("stop"),
    results: t("results"),
    loading: t("loading"),
  }

  return (
    <>
      <h1 className="sr-only">{copy.title}</h1>
      <AssistantPlayground locale={safeLocale} copy={copy} />
    </>
  )
}
