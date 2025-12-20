import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SellFormDemo } from "./sell-form-demo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DemoSellFormPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SellFormDemo locale={locale} />;
}
