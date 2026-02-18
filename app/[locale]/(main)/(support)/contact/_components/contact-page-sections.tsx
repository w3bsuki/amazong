import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight as CaretRight, Clock, Mail as Envelope, Headphones, MapPin, Phone, CircleHelp as Question, ShieldCheck, Send as PaperPlaneTilt } from "lucide-react";

type Translate = (key: string, values?: Record<string, string | number | Date>) => string

export interface QuickHelpItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  href: string
}

export function ContactQuickHelpSection({
  t,
  quickHelp,
}: {
  t: Translate
  quickHelp: QuickHelpItem[]
}) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold tracking-tight mb-6">{t("quickHelp")}</h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
        {quickHelp.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="h-full hover:shadow-md hover:border-hover-border transition-all cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0 group-hover:bg-hover transition-colors">
                    <item.icon className="size-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold tracking-tight">{item.title}</h3>
                      <CaretRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function ContactFormCard({ t }: { t: Translate }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 bg-selected flex items-center justify-center">
            <PaperPlaneTilt className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{t("sendMessage")}</h2>
            <p className="text-sm text-muted-foreground">{t("sendMessageDesc")}</p>
          </div>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="name">
                  {t("name")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input id="name" name="name" placeholder={t("namePlaceholder")} required />
              </FieldContent>
            </Field>
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="email">
                  {t("email")} <span className="text-destructive">*</span>
                </FieldLabel>
                <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} required />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldContent>
              <FieldLabel htmlFor="phone">{t("phone")}</FieldLabel>
              <Input id="phone" name="phone" type="tel" placeholder={t("phonePlaceholder")} />
            </FieldContent>
          </Field>

          <Field>
            <FieldContent>
              <FieldLabel htmlFor="orderNumber">{t("orderNumber")}</FieldLabel>
              <Input id="orderNumber" name="orderNumber" placeholder={t("orderNumberPlaceholder")} />
              <FieldDescription className="text-xs">{t("orderNumberHint")}</FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldContent>
              <FieldLabel htmlFor="subject">
                {t("subject")} <span className="text-destructive">*</span>
              </FieldLabel>
              <select
                id="subject"
                name="subject"
                className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">{t("selectSubject")}</option>
                <option value="order">{t("subjectOrder")}</option>
                <option value="return">{t("subjectReturn")}</option>
                <option value="payment">{t("subjectPayment")}</option>
                <option value="product">{t("subjectProduct")}</option>
                <option value="account">{t("subjectAccount")}</option>
                <option value="other">{t("subjectOther")}</option>
              </select>
            </FieldContent>
          </Field>

          <Field>
            <FieldContent>
              <FieldLabel htmlFor="message">
                {t("message")} <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="message"
                name="message"
                placeholder={t("messagePlaceholder")}
                className="min-h-(--textarea-min-h) resize-none"
                required
              />
              <FieldDescription className="text-xs">{t("messageHint")}</FieldDescription>
            </FieldContent>
          </Field>

          <div className="flex items-start gap-3 p-4 bg-muted">
            <ShieldCheck className="size-5 text-success shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">{t("privacyNote")}</p>
          </div>

          <Button type="submit" variant="cta" className="w-full sm:w-auto">
            <PaperPlaneTilt className="size-4 mr-2" />
            {t("send")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function ContactInfoSidebar({ t }: { t: Translate }) {
  return (
    <div className="space-y-4">
      <Card className="border-selected-border bg-selected">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 bg-surface-subtle flex items-center justify-center">
              <Headphones className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight">{t("customerService")}</h3>
              <p className="text-sm text-muted-foreground">{t("fastestWay")}</p>
            </div>
          </div>
          <Link href="/customer-service">
            <Button variant="outline" className="w-full border-selected-border text-primary hover:bg-primary hover:text-primary-foreground">
              {t("visitHelpCenter")}
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
              <Envelope className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight">{t("emailUs")}</h3>
              <a href="mailto:help@treido.com" className="text-sm text-primary hover:underline">
                help@treido.com
              </a>
              <p className="text-xs text-muted-foreground mt-1">{t("emailResponse")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
              <Phone className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight">{t("callUs")}</h3>
              <a href="tel:+35921234567" className="text-sm text-primary hover:underline">
                +359 2 123 4567
              </a>
              <p className="text-xs text-muted-foreground mt-1">{t("callHours")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
              <MapPin className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight">{t("headquarters")}</h3>
              <p className="text-sm text-muted-foreground">
                Treido Ltd.<br />
                bul. Vitosha 100<br />
                1463 Sofia, Bulgaria
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
              <Clock className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold tracking-tight">{t("hours")}</h3>
              <div className="text-sm text-muted-foreground space-y-1 mt-1">
                <p>{t("weekdays")}: 09:00 - 21:00</p>
                <p>{t("saturday")}: 10:00 - 18:00</p>
                <p>{t("sunday")}: 10:00 - 16:00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ContactFaqTeaser({ t }: { t: Translate }) {
  return (
    <section className="mt-12">
      <Card className="bg-muted">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="size-12 bg-surface-subtle flex items-center justify-center shrink-0">
                <Question className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold tracking-tight text-lg">{t("faqTitle")}</h3>
                <p className="text-muted-foreground">{t("faqDesc")}</p>
              </div>
            </div>
            <Link href="/customer-service">
              <Button variant="outline" className="whitespace-nowrap">
                {t("viewFaq")}
                <CaretRight className="size-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
