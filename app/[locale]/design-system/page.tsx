import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { DesignSystemClient } from "./_components/design-system-client";

export const metadata: Metadata = {
  title: "Treido Design System v2",
  description: "Comprehensive design system built on shadcn/ui and Tailwind CSS v4 with oklch colors.",
  robots: "noindex, nofollow", // Don't index experimental pages
};

/**
 * Design System - Standalone Experimental Page
 * 
 * NOT part of the main layout - this is an isolated showcase for 
 * testing and iterating on design tokens, components, and patterns.
 * 
 * Route: /[locale]/design-system
 */
export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DesignSystemClient />;
}

