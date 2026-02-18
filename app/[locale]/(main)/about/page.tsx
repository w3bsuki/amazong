import type { Metadata } from "next"
import { Suspense } from "react"
import { setRequestLocale } from "next-intl/server"
import { validateLocale } from "@/i18n/routing"
import { AboutPageContent } from "./_components/about-page-content"
import { Skeleton } from "@/components/ui/skeleton"
import { PageShell } from "../../_components/page-shell"

// Generate static params for all locales - required for Next.js 16 Cache Components
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  return {
    title: locale === 'bg' ? 'За нас' : 'About Us',
    description: locale === 'bg' 
      ? 'Научете повече за Treido - вашият доверен партньор за онлайн пазаруване в България.'
      : 'Learn more about Treido - your trusted partner for online shopping in Bulgaria.',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  return (
    <Suspense fallback={<AboutPageSkeleton />}>
      <AboutPageContent />
    </Suspense>
  )
}

function AboutPageSkeleton() {
  return (
    <PageShell className="pb-20 sm:pb-12">
      <div className="bg-primary text-primary-foreground relative">
        <div className="absolute inset-0 bg-overlay-dark/20" />
        <div className="container py-12 md:py-20 relative z-10">
          <Skeleton className="h-8 w-48 mb-4 bg-muted" />
          <Skeleton className="h-12 w-96 mb-4 bg-muted" />
          <Skeleton className="h-6 w-80 bg-muted" />
        </div>
      </div>
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="aspect-video" />
        </div>
      </div>
    </PageShell>
  )
}

