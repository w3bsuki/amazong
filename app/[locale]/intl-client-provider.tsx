"use client";

import type { ReactNode } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

export function IntlClientProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}) {
  return <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>;
}
