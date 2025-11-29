import { getTranslations } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/app-breadcrumb"
import { 
  Users, Globe, Heart, Shield, Truck, 
  Trophy, Target, Leaf, Headphones,
  CheckCircle, Star, TrendUp, Lightning, Package
} from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'bg' ? 'За нас' : 'About Us',
    description: locale === 'bg' 
      ? 'Научете повече за AMZN - вашият доверен партньор за онлайн пазаруване в България.'
      : 'Learn more about AMZN - your trusted partner for online shopping in Bulgaria.',
  };
}

export default async function AboutPage() {
  const t = await getTranslations('About')
  
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-header-bg to-header-bg-secondary text-white">
        <div className="container py-12 md:py-20">
          <div className="[&_nav]:border-white/20 [&_nav]:mb-4 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
            <AppBreadcrumb items={breadcrumbPresets.about} />
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('heroTitle')}</h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Mission Section */}
        <section className="py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 text-brand text-sm font-medium mb-4">
                <Target className="size-4" />
                {t('ourMission')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('missionTitle')}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {t('missionDesc')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-brand-success mt-0.5 shrink-0" />
                  <span className="text-sm">{t('missionPoint1')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-brand-success mt-0.5 shrink-0" />
                  <span className="text-sm">{t('missionPoint2')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-brand-success mt-0.5 shrink-0" />
                  <span className="text-sm">{t('missionPoint3')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-brand-success mt-0.5 shrink-0" />
                  <span className="text-sm">{t('missionPoint4')}</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="bg-white shadow-lg p-6 text-center">
                    <TrendUp className="size-8 text-brand mx-auto mb-2" />
                    <div className="text-2xl font-bold text-brand">15+</div>
                    <div className="text-xs text-muted-foreground">{t('yearsExperience')}</div>
                  </div>
                  <div className="bg-white shadow-lg p-6 text-center">
                    <Package className="size-8 text-brand mx-auto mb-2" />
                    <div className="text-2xl font-bold text-brand">50M+</div>
                    <div className="text-xs text-muted-foreground">{t('productsDelivered')}</div>
                  </div>
                  <div className="bg-white shadow-lg p-6 text-center">
                    <Users className="size-8 text-brand mx-auto mb-2" />
                    <div className="text-2xl font-bold text-brand">10M+</div>
                    <div className="text-xs text-muted-foreground">{t('happyCustomers')}</div>
                  </div>
                  <div className="bg-white shadow-lg p-6 text-center">
                    <Globe className="size-8 text-brand mx-auto mb-2" />
                    <div className="text-2xl font-bold text-brand">50+</div>
                    <div className="text-xs text-muted-foreground">{t('countriesServed')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('ourValues')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('valuesSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Heart className="size-6 text-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('valueCustomerFirst')}</h3>
                <p className="text-muted-foreground text-sm">{t('valueCustomerFirstDesc')}</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Shield className="size-6 text-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('valueTrust')}</h3>
                <p className="text-muted-foreground text-sm">{t('valueTrustDesc')}</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Lightning className="size-6 text-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('valueInnovation')}</h3>
                <p className="text-muted-foreground text-sm">{t('valueInnovationDesc')}</p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Leaf className="size-6 text-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">{t('valueSustainability')}</h3>
                <p className="text-muted-foreground text-sm">{t('valueSustainabilityDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('whatWeOffer')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('whatWeOfferSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="size-16 bg-brand-success-light text-brand-success flex items-center justify-center mx-auto mb-4">
                <Truck className="size-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('offerFastDelivery')}</h3>
              <p className="text-muted-foreground text-sm">{t('offerFastDeliveryDesc')}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="size-16 bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
                <Trophy className="size-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('offerQuality')}</h3>
              <p className="text-muted-foreground text-sm">{t('offerQualityDesc')}</p>
            </div>
            
            <div className="text-center p-6">
              <div className="size-16 bg-brand-deal-light text-brand-deal flex items-center justify-center mx-auto mb-4">
                <Headphones className="size-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('offerSupport')}</h3>
              <p className="text-muted-foreground text-sm">{t('offerSupportDesc')}</p>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="bg-muted p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-5 fill-rating text-rating" />
                  ))}
                </div>
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="text-sm text-muted-foreground">{t('customerRating')}</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-brand mb-2">98%</div>
                <div className="text-sm text-muted-foreground">{t('satisfactionRate')}</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-brand mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">{t('customerSupport')}</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-brand mb-2">30</div>
                <div className="text-sm text-muted-foreground">{t('dayReturns')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
            <p className="text-muted-foreground mb-8">{t('ctaSubtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/search" 
                className="inline-flex items-center justify-center px-8 py-3 bg-brand text-white font-medium hover:bg-brand-dark transition-colors"
              >
                {t('ctaShopNow')}
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 border border-brand text-brand font-medium hover:bg-brand/5 transition-colors"
              >
                {t('ctaContactUs')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
