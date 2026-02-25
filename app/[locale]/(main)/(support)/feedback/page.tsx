import { getTranslations, setRequestLocale } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bug, MessageCircleMore as ChatCircleDots, CircleCheck as CheckCircle, Heart, Lightbulb, Send as PaperPlaneTilt, Star } from "lucide-react";

import { Link } from "@/i18n/routing"
import { StaticHeroPageShell } from "../../_components/static-hero-page-shell"
import type { Metadata } from 'next'
import { validateLocale } from "@/i18n/routing"
import { createPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Feedback')
  
  return createPageMetadata({
    locale,
    path: "/feedback",
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)
  const t = await getTranslations('Feedback')
  const tBreadcrumbs = await getTranslations("Breadcrumbs")
  
  const breadcrumbItems = [
    { label: t('breadcrumbFeedback') },
  ]
  
  const feedbackTypes = [
    { icon: Star, title: t('generalFeedback'), desc: t('generalFeedbackDesc') },
    { icon: Lightbulb, title: t('featureRequest'), desc: t('featureRequestDesc') },
    { icon: Bug, title: t('reportBug'), desc: t('reportBugDesc') },
    { icon: Heart, title: t('compliment'), desc: t('complimentDesc') },
  ]
  
  return (
    <StaticHeroPageShell
      title={t("metaTitle")}
      breadcrumbItems={breadcrumbItems}
      breadcrumbAriaLabel={tBreadcrumbs("ariaLabel")}
      breadcrumbHomeLabel={tBreadcrumbs("homeLabel")}
      hero={
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <ChatCircleDots className="size-8" />
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">{t('heroTitle')}</h1>
          </div>
          <p className="text-foreground text-lg">{t('heroSubtitle')}</p>
        </div>
      }
    >
        {/* Why Your Feedback Matters */}
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-4">{t('whyMattersTitle')}</h2>
          <p className="text-muted-foreground max-w-2xl">{t('whyMattersDesc')}</p>
        </section>

        {/* Feedback Types */}
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-6">{t('feedbackTypesTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {feedbackTypes.map((type, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-5">
                  <div className="size-12 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-3">
                    <type.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="font-semibold tracking-tight text-sm mb-1">{type.title}</h3>
                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Feedback Form */}
        <section className="max-w-2xl">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-selected rounded-lg flex items-center justify-center">
                  <PaperPlaneTilt className="size-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold tracking-tight text-lg">{t('formTitle')}</h2>
                  <p className="text-sm text-muted-foreground">{t('formSubtitle')}</p>
                </div>
              </div>

              <form className="space-y-6">
                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor="feedback">{t('feedbackLabel')}</FieldLabel>
                    <Textarea
                      id="feedback"
                      name="feedback"
                      placeholder={t('feedbackPlaceholder')}
                      className="min-h-(--textarea-min-h) resize-none"
                    />
                    <FieldDescription className="text-xs">{t('feedbackHint')}</FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor="email">{t('emailLabel')}</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('emailPlaceholder')}
                    />
                    <FieldDescription className="text-xs">{t('emailHint')}</FieldDescription>
                  </FieldContent>
                </Field>

                <Button type="submit" className="w-full sm:w-auto">
                  <PaperPlaneTilt className="size-4 mr-2" />
                  {t('submitButton')}
                </Button>
              </form>

              {/* Trust message */}
              <div className="mt-6 pt-6 border-t flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle className="size-5 text-success shrink-0 mt-0.5" />
                <p>{t('trustMessage')}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Alternative Contact */}
        <section className="mt-10 text-center">
          <p className="text-muted-foreground">
            {t('needHelp')}{' '}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              {t('contactUs')}
            </Link>
          </p>
        </section>
    </StaticHeroPageShell>
  )
}


