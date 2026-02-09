import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, UserPlus } from "@phosphor-icons/react/dist/ssr"
import { AppBreadcrumb, breadcrumbPresets } from "../../_components/navigation/app-breadcrumb"
import { validateLocale } from "@/i18n/routing"
import { setRequestLocale, getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { PageShell } from "../../_components/page-shell"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: localeParam } = await params
    const locale = validateLocale(localeParam)
    setRequestLocale(locale)
    const t = await getTranslations("RegistryPage")

    return {
        title: t("heroTitle"),
        description: t("heroSubtitle"),
        robots: { index: false, follow: false },
    }
}

export default async function RegistryPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
        const { locale: localeParam } = await params
        const locale = validateLocale(localeParam)
        setRequestLocale(locale)
        const t = await getTranslations("RegistryPage")
        const tBreadcrumbs = await getTranslations("Breadcrumbs")

    return (
        <PageShell>
            <div className="container pt-4">
                <AppBreadcrumb
                    items={breadcrumbPresets(tBreadcrumbs).registry}
                    ariaLabel={tBreadcrumbs("ariaLabel")}
                    homeLabel={tBreadcrumbs("homeLabel")}
                />
            </div>
            
            {/* Hero Section */}
            <div className="relative bg-header-bg text-header-text py-16 px-4">
                <div className="container flex flex-col md:flex-row items-center justify-between">
                    <div className="space-y-6 max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-bold">
                            {t("heroTitle")}
                        </h1>
                        <p className="text-lg text-header-text/80">
                            {t("heroSubtitle")}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-primary hover:bg-interactive-hover text-primary-foreground font-bold h-12 px-8 rounded-sm">
                                {t("createRegistry")}
                            </Button>
                            <Button variant="outline" className="bg-transparent border-header-text text-header-text hover:bg-header-text/10 font-bold h-12 px-8 rounded-sm">
                                {t("findRegistry")}
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Gift className="w-64 h-64 text-primary opacity-90" />
                    </div>
                </div>
            </div>

            {/* Registry Types */}
            <div className="container py-12">
                <h2 className="text-3xl font-bold text-center mb-12">{t("typesTitle")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:border-hover-border transition-colors cursor-pointer border border-border">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-selected w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Gift className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle>{t("weddingTitle")}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            {t("weddingDesc")}
                        </CardContent>
                    </Card>

                    <Card className="hover:border-hover-border transition-colors cursor-pointer border border-border">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-selected w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <UserPlus className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle>{t("babyTitle")}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            {t("babyDesc")}
                        </CardContent>
                    </Card>

                    <Card className="hover:border-hover-border transition-colors cursor-pointer border border-border">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-selected w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <Gift className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle>{t("birthdayTitle")}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            {t("birthdayDesc")}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-muted py-16 px-4">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">{t("benefitsTitle")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">{t("benefit1Title")}</h3>
                            <p className="text-sm text-muted-foreground">{t("benefit1Desc")}</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">{t("benefit2Title")}</h3>
                            <p className="text-sm text-muted-foreground">{t("benefit2Desc")}</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">{t("benefit3Title")}</h3>
                            <p className="text-sm text-muted-foreground">{t("benefit3Desc")}</p>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-lg">{t("benefit4Title")}</h3>
                            <p className="text-sm text-muted-foreground">{t("benefit4Desc")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    )
}


