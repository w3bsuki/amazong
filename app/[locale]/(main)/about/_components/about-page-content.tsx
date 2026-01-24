import { getTranslations } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { PageShell } from "@/components/shared/page-shell"
import {
  Users,
  Heart,
  Shield,
  Truck,
  Trophy,
  Target,
  Leaf,
  Headphones,
  CheckCircle,
  Lightning,
  Package,
} from "@phosphor-icons/react/dist/ssr"
import { Link } from "@/i18n/routing"

export async function AboutPageContent() {
  const t = await getTranslations("About")
  const tBreadcrumbs = await getTranslations("Breadcrumbs")

  return (
    <PageShell className="pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-brand text-primary-foreground relative">
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="container py-12 md:py-20 relative z-10">
          <div className="[&_nav]:border-primary-foreground/20 [&_nav]:mb-4 [&_a]:text-primary-foreground/80 [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground [&_svg]:text-primary-foreground/50">
            <AppBreadcrumb
              items={breadcrumbPresets(tBreadcrumbs).about}
              ariaLabel={tBreadcrumbs("ariaLabel")}
              homeLabel={tBreadcrumbs("homeLabel")}
            />
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Mission Section */}
        <section className="py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 text-brand text-sm font-medium mb-4">
                <Target className="size-4" />
                {t("ourMission")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("missionTitle")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{t("missionDesc")}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-success mt-0.5 shrink-0" />
                  <span className="text-sm">{t("missionPoint1")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-success mt-0.5 shrink-0" />
                  <span className="text-sm">{t("missionPoint2")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-success mt-0.5 shrink-0" />
                  <span className="text-sm">{t("missionPoint3")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-success mt-0.5 shrink-0" />
                  <span className="text-sm">{t("missionPoint4")}</span>
                </div>
              </div>
            </div>
            <div className="relative">
                  <div className="aspect-video bg-brand/10 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-8">
                      <div className="bg-card p-4 text-center shadow-sm">
                        <Lightning className="size-8 text-brand mx-auto mb-2" />
                        <div className="text-lg font-bold text-brand">{t("statGrowing")}</div>
                        <div className="text-xs text-muted-foreground">{t("statGrowingDesc")}</div>
                      </div>
                      <div className="bg-card p-4 text-center shadow-sm">
                        <Shield className="size-8 text-brand mx-auto mb-2" />
                        <div className="text-lg font-bold text-brand">{t("statSecure")}</div>
                        <div className="text-xs text-muted-foreground">{t("statSecureDesc")}</div>
                      </div>
                      <div className="bg-card p-4 text-center shadow-sm">
                        <Users className="size-8 text-brand mx-auto mb-2" />
                        <div className="text-lg font-bold text-brand">{t("statLocal")}</div>
                        <div className="text-xs text-muted-foreground">{t("statLocalDesc")}</div>
                      </div>
                      <div className="bg-card p-4 text-center shadow-sm">
                        <Heart className="size-8 text-brand mx-auto mb-2" />
                        <div className="text-lg font-bold text-brand">{t("statPassion")}</div>
                        <div className="text-xs text-muted-foreground">{t("statPassionDesc")}</div>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("ourValues")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("valuesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Heart className="size-6 text-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t("valueCustomerFirst")}</h3>
                <p className="text-muted-foreground text-sm">{t("valueCustomerFirstDesc")}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Shield className="size-6 text-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t("valueTrust")}</h3>
                <p className="text-muted-foreground text-sm">{t("valueTrustDesc")}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Lightning className="size-6 text-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t("valueInnovation")}</h3>
                <p className="text-muted-foreground text-sm">{t("valueInnovationDesc")}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Leaf className="size-6 text-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t("valueSustainability")}</h3>
                <p className="text-muted-foreground text-sm">{t("valueSustainabilityDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("whatWeOffer")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("whatWeOfferSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6">
              <div className="size-16 bg-success/10 text-success flex items-center justify-center mx-auto mb-4">
                <Truck className="size-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("offerFastDelivery")}</h3>
              <p className="text-muted-foreground text-sm">{t("offerFastDeliveryDesc")}</p>
            </div>

            <div className="text-center p-6">
              <div className="size-16 bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
                <Trophy className="size-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("offerQuality")}</h3>
              <p className="text-muted-foreground text-sm">{t("offerQualityDesc")}</p>
            </div>

            <div className="text-center p-6">
              <div className="size-16 bg-deal-light text-deal flex items-center justify-center mx-auto mb-4">
                <Headphones className="size-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("offerSupport")}</h3>
              <p className="text-muted-foreground text-sm">{t("offerSupportDesc")}</p>
            </div>
          </div>
        </section>

        {/* Our Promises Section */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="bg-muted p-4 md:p-4">
            <h3 className="text-xl font-bold text-center mb-8">{t("ourPromises")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="size-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="size-6 text-brand" />
                </div>
                <div className="text-lg font-bold">100%</div>
                <div className="text-sm text-muted-foreground">{t("promiseSecure")}</div>
              </div>

              <div>
                <div className="size-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Headphones className="size-6 text-brand" />
                </div>
                <div className="text-lg font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">{t("customerSupport")}</div>
              </div>

              <div>
                <div className="size-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="size-6 text-brand" />
                </div>
                <div className="text-lg font-bold">30</div>
                <div className="text-sm text-muted-foreground">{t("dayReturns")}</div>
              </div>

              <div>
                <div className="size-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="size-6 text-brand" />
                </div>
                <div className="text-lg font-bold">{t("promiseVerified")}</div>
                <div className="text-sm text-muted-foreground">{t("promiseVerifiedDesc")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
            <p className="text-muted-foreground mb-8">{t("ctaSubtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-8 py-3 bg-brand text-white font-medium hover:bg-brand-dark transition-colors"
              >
                {t("ctaShopNow")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border border-brand text-brand font-medium hover:bg-brand/5 transition-colors"
              >
                {t("ctaContactUs")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
