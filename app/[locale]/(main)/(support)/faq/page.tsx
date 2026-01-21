import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  CreditCard, 
  ArrowsClockwise, 
  User, 
  Shield, 
  Truck, 
  Question,
  CaretDown
} from "@phosphor-icons/react/dist/ssr"
import { Link } from "@/i18n/routing"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { AppBreadcrumb } from "@/components/navigation/app-breadcrumb"
import type { Metadata } from 'next'
import { routing, validateLocale } from "@/i18n/routing"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'FAQPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

// FAQ data structure
const faqCategories = {
  en: [
    {
      id: 'orders',
      icon: Package,
      title: 'Orders & Shipping',
      faqs: [
        { q: 'How do I track my order?', a: 'You can track your order by going to "My Orders" in your account. Click on the order you want to track to see real-time shipping updates.' },
        { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight shipping are also available at checkout.' },
        { q: 'Can I change my shipping address after ordering?', a: 'You can change your shipping address within 1 hour of placing your order. Go to "My Orders" and click "Edit" next to the shipping address.' },
        { q: 'Do you ship internationally?', a: 'Currently, we ship within Bulgaria and select EU countries. International shipping options are expanding soon.' },
      ]
    },
    {
      id: 'returns',
      icon: ArrowsClockwise,
      title: 'Returns & Refunds',
      faqs: [
        { q: 'What is your return policy?', a: 'We offer 30-day returns on most items. Items must be in original condition with tags attached. Some categories like intimates and personalized items are final sale.' },
        { q: 'How do I start a return?', a: 'Go to "My Orders", find the item you want to return, and click "Return Item". Follow the instructions to print your return label.' },
        { q: 'When will I receive my refund?', a: 'Refunds are processed within 3-5 business days after we receive your return. It may take an additional 5-10 days for the refund to appear on your statement.' },
        { q: 'Can I exchange an item instead of returning it?', a: 'Yes! During the return process, you can choose to exchange for a different size or color if available.' },
      ]
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Payments & Pricing',
      faqs: [
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers.' },
        { q: 'Is my payment information secure?', a: 'Yes, all payments are processed through Stripe with bank-level SSL encryption. We never store your full card details.' },
        { q: 'Can I pay in installments?', a: 'Yes, we offer installment payments through Klarna for orders over €50. Select "Pay in 4" at checkout.' },
        { q: 'Why was my payment declined?', a: 'Payments may be declined due to insufficient funds, incorrect card details, or bank security measures. Please try again or use a different payment method.' },
      ]
    },
    {
      id: 'account',
      icon: User,
      title: 'Account & Profile',
      faqs: [
        { q: 'How do I create an account?', a: 'Click "Sign Up" in the top right corner. You can register with your email or sign up instantly with Google or Apple.' },
        { q: 'How do I reset my password?', a: 'Click "Sign In", then "Forgot Password". Enter your email and we\'ll send you a reset link.' },
        { q: 'Can I delete my account?', a: 'Yes, you can delete your account from Settings > Privacy > Delete Account. This action is permanent and cannot be undone.' },
        { q: 'How do I change my email address?', a: 'Go to Account Settings and click on your email. You\'ll need to verify the new email address before the change takes effect.' },
      ]
    },
    {
      id: 'selling',
      icon: Shield,
      title: 'Selling on Treido',
      faqs: [
        { q: 'How do I start selling?', a: 'Click "Sell" in the navigation bar and follow the steps to create your seller account. You\'ll need to verify your identity and set up payment details.' },
        { q: 'What fees does Treido charge?', a: 'Personal sellers pay 0% seller fee. Business accounts pay a small seller fee (0.5–1.5%) depending on plan. Buyers pay a Buyer Protection fee at checkout (percent + fixed, capped).' },
        { q: 'How do I get paid for my sales?', a: 'Payments are transferred to your bank account within 3-5 business days after the buyer confirms receipt or after the protection period ends.' },
        { q: 'What items can I sell?', a: 'You can sell most new and used items. Prohibited items include weapons, drugs, counterfeit goods, and hazardous materials. See our full policy for details.' },
      ]
    },
    {
      id: 'protection',
      icon: Shield,
      title: 'Buyer Protection',
      faqs: [
        { q: 'What is Buyer Protection?', a: 'Buyer Protection ensures you receive the item as described or get a full refund. It covers all purchases made through Treido\'s secure checkout.' },
        { q: 'How do I file a claim?', a: 'If there\'s an issue with your order, go to "My Orders" and click "Report a Problem". Our team will review your case within 24-48 hours.' },
        { q: 'What does Buyer Protection cover?', a: 'It covers items not received, items significantly not as described, and damaged items. You\'re protected for the full purchase price including shipping.' },
        { q: 'How long does protection last?', a: 'Protection is active from purchase until 30 days after confirmed delivery. Make sure to inspect items and report issues promptly.' },
      ]
    },
  ],
  bg: [
    {
      id: 'orders',
      icon: Package,
      title: 'Поръчки и доставка',
      faqs: [
        { q: 'Как да проследя поръчката си?', a: 'Можете да проследите поръчката си от "Моите поръчки" в профила ви. Кликнете на поръчката, за да видите актуализации в реално време.' },
        { q: 'Колко време отнема доставката?', a: 'Стандартната доставка отнема 5-7 работни дни. Експресна доставка (2-3 дни) и доставка на следващия ден също са налични.' },
        { q: 'Мога ли да променя адреса за доставка след поръчка?', a: 'Можете да промените адреса до 1 час след поръчката. Отидете в "Моите поръчки" и кликнете "Редактирай".' },
        { q: 'Доставяте ли в чужбина?', a: 'В момента доставяме в България и избрани страни от ЕС. Разширяваме международните опции скоро.' },
      ]
    },
    {
      id: 'returns',
      icon: ArrowsClockwise,
      title: 'Връщания и възстановявания',
      faqs: [
        { q: 'Каква е политиката ви за връщане?', a: 'Предлагаме 30-дневно връщане на повечето артикули. Артикулите трябва да са в оригинално състояние с етикети.' },
        { q: 'Как да започна връщане?', a: 'Отидете в "Моите поръчки", намерете артикула и кликнете "Върни артикул". Следвайте инструкциите за печат на етикет.' },
        { q: 'Кога ще получа възстановяването?', a: 'Възстановяванията се обработват в рамките на 3-5 работни дни след получаване на връщането.' },
        { q: 'Мога ли да сменя артикул вместо да го върна?', a: 'Да! По време на процеса на връщане можете да изберете да смените с различен размер или цвят.' },
      ]
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Плащания и цени',
      faqs: [
        { q: 'Какви методи на плащане приемате?', a: 'Приемаме всички основни кредитни карти (Visa, Mastercard), PayPal, Apple Pay, Google Pay и банкови преводи.' },
        { q: 'Защитена ли е платежната ми информация?', a: 'Да, всички плащания се обработват през Stripe със SSL криптиране. Никога не съхраняваме пълните данни на картата ви.' },
        { q: 'Мога ли да платя на вноски?', a: 'Да, предлагаме плащане на вноски чрез Klarna за поръчки над 50€. Изберете "Плати на 4" при плащане.' },
        { q: 'Защо плащането ми беше отказано?', a: 'Плащанията могат да бъдат отказани поради недостатъчни средства или грешни данни. Моля, опитайте отново.' },
      ]
    },
    {
      id: 'account',
      icon: User,
      title: 'Акаунт и профил',
      faqs: [
        { q: 'Как да създам акаунт?', a: 'Кликнете "Регистрация" горе вдясно. Можете да се регистрирате с имейл или с Google/Apple.' },
        { q: 'Как да нулирам паролата си?', a: 'Кликнете "Вход", после "Забравена парола". Въведете имейла си и ще ви изпратим линк за нулиране.' },
        { q: 'Мога ли да изтрия акаунта си?', a: 'Да, можете да изтриете акаунта си от Настройки > Поверителност > Изтрий акаунт. Това действие е необратимо.' },
        { q: 'Как да променя имейл адреса си?', a: 'Отидете в Настройки на акаунта и кликнете на имейла си. Ще трябва да потвърдите новия имейл.' },
      ]
    },
    {
      id: 'selling',
      icon: Shield,
      title: 'Продаване в Treido',
      faqs: [
        { q: 'Как да започна да продавам?', a: 'Кликнете "Продай" в навигацията и следвайте стъпките за създаване на продавачки акаунт.' },
        { q: 'Какви такси начислява Treido?', a: 'Личните продавачи плащат 0% такса за продавача. Бизнес акаунти плащат малка такса (0.5–1.5%) според плана. Купувачите плащат такса „Защита на купувача“ при плащане (процент + фиксирана, с лимит).' },
        { q: 'Как получавам плащане за продажбите си?', a: 'Плащанията се превеждат по банковата ви сметка в рамките на 3-5 работни дни след потвърждение.' },
        { q: 'Какви артикули мога да продавам?', a: 'Можете да продавате повечето нови и употребявани артикули. Забранени са оръжия, наркотици, фалшификати.' },
      ]
    },
    {
      id: 'protection',
      icon: Shield,
      title: 'Защита на купувача',
      faqs: [
        { q: 'Какво е Защита на купувача?', a: 'Защитата на купувача гарантира, че ще получите артикула както е описан или пълно възстановяване.' },
        { q: 'Как да подам жалба?', a: 'Ако има проблем с поръчката, отидете в "Моите поръчки" и кликнете "Докладвай проблем".' },
        { q: 'Какво покрива защитата?', a: 'Покрива неполучени артикули, артикули значително различни от описанието и повредени артикули.' },
        { q: 'Колко дълго трае защитата?', a: 'Защитата е активна от покупката до 30 дни след потвърдена доставка.' },
      ]
    },
  ],
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  setRequestLocale(locale)

  const categories = faqCategories[locale as keyof typeof faqCategories] || faqCategories.en
  const t = {
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about shopping, selling, and more.',
      searchPlaceholder: 'Search FAQ...',
      cantFind: "Can't find what you're looking for?",
      contactUs: 'Contact our support team',
      categories: 'Browse by category',
    },
    bg: {
      title: 'Често задавани въпроси',
      subtitle: 'Намерете отговори на често срещани въпроси за пазаруване, продаване и още.',
      searchPlaceholder: 'Търсене в ЧЗВ...',
      cantFind: 'Не намирате това, което търсите?',
      contactUs: 'Свържете се с нашия екип',
      categories: 'Прегледай по категория',
    },
  }[locale as 'en' | 'bg'] || {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about shopping, selling, and more.',
    searchPlaceholder: 'Search FAQ...',
    cantFind: "Can't find what you're looking for?",
    contactUs: 'Contact our support team',
    categories: 'Browse by category',
  }

  const breadcrumbItems = [
    { label: locale === 'bg' ? 'Начало' : 'Home', href: `/${locale}` },
    { label: locale === 'bg' ? 'ЧЗВ' : 'FAQ' },
  ]

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container py-8 px-4 sm:px-6">
        <AppBreadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">{t.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="flex flex-col items-center p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-center"
            >
              <category.icon className="w-8 h-8 mb-2 text-primary" />
              <span className="text-sm font-medium">{category.title}</span>
            </a>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Card key={category.id} id={category.id} className="scroll-mt-20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-primary" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card className="mt-10 max-w-2xl mx-auto bg-muted/50">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div className="text-center sm:text-left">
              <p className="font-medium">{t.cantFind}</p>
            </div>
            <Link 
              href="/customer-service" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {t.contactUs}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
