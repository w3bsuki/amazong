import type { ReactNode } from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

export function IntlClientProvider({
  locale,
  messages,
  timeZone = "Europe/Sofia",
  children,
}: {
  locale: string;
  messages: AbstractIntlMessages;
  timeZone?: string;
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
}

