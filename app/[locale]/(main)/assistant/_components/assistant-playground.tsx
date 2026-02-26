"use client"

import dynamic from "next/dynamic"
import {
  type AssistantCopy,
} from "./assistant-playground-ui"

const AssistantPlaygroundRuntime = dynamic(
  () => import("./assistant-playground-runtime").then((mod) => mod.AssistantPlaygroundRuntime),
  {
    ssr: false,
    loading: () => <div className="min-h-dvh bg-background" />,
  },
)

export function AssistantPlayground({
  locale,
  copy,
}: {
  locale: "en" | "bg"
  copy: AssistantCopy
}) {
  return <AssistantPlaygroundRuntime locale={locale} copy={copy} />
}
