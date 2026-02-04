import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Envelope, WarningCircle } from "@phosphor-icons/react/dist/ssr"
import { Link } from "@/i18n/routing"
import { AppBreadcrumb, type BreadcrumbItemData } from "@/components/navigation/app-breadcrumb"
import type { Icon } from "@phosphor-icons/react"
import { PageShell } from "@/components/shared/page-shell"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export interface LegalSection {
  id: string
  icon: Icon
  title: string
  desc: string
}

export interface RelatedLink {
  href: string
  icon: Icon
  title: string
  description: string
}

interface LegalPageLayoutProps {
  /** Hero icon component */
  heroIcon: Icon
  /** Page title */
  title: string
  /** Last updated text */
  lastUpdated: string
  /** Breadcrumb items */
  breadcrumbItems: readonly BreadcrumbItemData[]
  /** Accessible label for the breadcrumb navigation */
  breadcrumbAriaLabel: string
  /** Custom home label for the breadcrumb */
  breadcrumbHomeLabel?: string
  /** Table of contents label */
  tocLabel: string
  /** Introduction notice text */
  introNotice: string
  /** Introduction body text */
  introText: string
  /** Whether to use warning style for intro (default: info style) */
  introVariant?: "info" | "warning"
  /** Accordion sections */
  sections: LegalSection[]
  /** Default open section ID */
  defaultSection: string
  /** Questions section title */
  questionsTitle: string
  /** Questions section description */
  questionsDesc: string
  /** Contact button text */
  contactButtonText: string
  /** Contact email address */
  contactEmail: string
  /** Related page links */
  relatedLinks: RelatedLink[]
}

export function LegalPageLayout({
  heroIcon: HeroIcon,
  title,
  lastUpdated,
  breadcrumbItems,
  breadcrumbAriaLabel,
  breadcrumbHomeLabel,
  tocLabel,
  introNotice,
  introText,
  introVariant = "info",
  sections,
  defaultSection,
  questionsTitle,
  questionsDesc,
  contactButtonText,
  contactEmail,
  relatedLinks,
}: LegalPageLayoutProps) {
  const introStyles = introVariant === "warning" 
    ? "bg-warning/10 border-warning" 
    : "bg-info/10 border-info"
  
  const introIconColor = introVariant === "warning" 
    ? "text-warning" 
    : "text-info"

  return (
    <PageShell className="pb-20 sm:pb-12">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container py-10 md:py-14">
          <div className="[&_nav]:border-primary-foreground/20 [&_nav]:mb-4 [&_a]:text-primary-foreground/80 [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground [&_svg]:text-primary-foreground/50">
            <AppBreadcrumb
              items={breadcrumbItems}
              ariaLabel={breadcrumbAriaLabel}
              {...(breadcrumbHomeLabel === undefined ? {} : { homeLabel: breadcrumbHomeLabel })}
            />
          </div>
          <div className="flex items-start gap-4">
            <div className="size-14 bg-primary-foreground/10 flex items-center justify-center shrink-0">
              <HeroIcon className="size-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">{title}</h1>
              <p className="text-primary-foreground/70">{lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
                  {tocLabel}
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <section.icon className="size-4" />
                      <span className="truncate">{section.title}</span>
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Introduction Notice */}
            <Card>
              <CardContent className="p-6">
                <div className={`flex items-start gap-4 p-4 border-l-4 mb-4 ${introStyles}`}>
                  <WarningCircle className={`size-5 shrink-0 mt-0.5 ${introIconColor}`} />
                  <p className="text-sm text-muted-foreground">{introNotice}</p>
                </div>
                <div className="richtext text-muted-foreground leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {introText}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Accordion Sections */}
            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full" defaultValue={defaultSection}>
                  {sections.map((section, index) => (
                    <AccordionItem key={section.id} value={section.id} id={section.id} className="scroll-mt-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="size-8 bg-selected flex items-center justify-center shrink-0">
                            <section.icon className="size-4 text-primary" />
                          </div>
                          <span className="font-semibold text-left">
                            {index + 1}. {section.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-11 pr-4">
                          <div className="richtext text-muted-foreground leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {section.desc}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-muted">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
                    <Envelope className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{questionsTitle}</h3>
                    <p className="text-muted-foreground mb-4">{questionsDesc}</p>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild variant="cta" size="sm" className="px-4">
                        <Link href="/contact">{contactButtonText}</Link>
                      </Button>
                      <a 
                        href={`mailto:${contactEmail}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-border text-sm font-medium hover:bg-background transition-colors"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="block p-4 border border-border hover:border-hover-border hover:bg-hover transition-colors"
                >
                  <link.icon className="size-5 text-primary mb-2" />
                  <h4 className="font-medium">{link.title}</h4>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </PageShell>
  )
}
