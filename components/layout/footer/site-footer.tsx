"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { CaretUp } from "@phosphor-icons/react"

// Social Media Icons (inline SVGs for better performance)
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
)

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
)

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
)

const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
)

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
)

const PinterestIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
    </svg>
)

// Privacy toggle icon (CCPA/GDPR compliant icon)
const PrivacyIcon = () => (
    <svg viewBox="0 0 30 14" className="w-7 h-4 inline-block mr-1" aria-hidden="true">
        <path d="M7.4 12.8h6.8l3.1-11.6H7.4C4.2 1.2 1.6 3.8 1.6 7s2.6 5.8 5.8 5.8z" fill="transparent" stroke="currentColor" strokeWidth="1"/>
        <path d="M22.6 1.2h-6.8l-3.1 11.6h6.8c3.2 0 5.8-2.6 5.8-5.8s-2.6-5.8-5.8-5.8z" fill="currentColor"/>
        <circle cx="7.4" cy="7" r="2.3" fill="currentColor"/>
        <circle cx="22.6" cy="7" r="2.3" fill="transparent" stroke="currentColor" strokeWidth="1"/>
    </svg>
)

export function SiteFooter() {
    const t = useTranslations('Footer')

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const currentYear = new Date().getFullYear()

    const footerSections = [
        {
            id: "about",
            title: t('aboutUs'),
            links: [
                { label: t('aboutUsLink'), href: "/about" },
                { label: t('careers'), href: "/careers" },
                { label: t('newsAndBlog'), href: "/blog" },
                { label: t('sustainability'), href: "/sustainability" },
                { label: t('pressCenter'), href: "/press" },
                { label: t('investors'), href: "/investors" },
                { label: t('affiliatesPartners'), href: "/affiliates" },
                { label: t('advertise'), href: "/advertise" },
                { label: t('suppliers'), href: "/suppliers" },
            ]
        },
        {
            id: "help",
            title: t('help'),
            links: [
                { label: t('helpCenter'), href: "/customer-service" },
                { label: t('returns'), href: "/returns" },
                { label: t('trackOrders'), href: "/account/orders" },
                { label: t('recalls'), href: "/recalls" },
                { label: t('contactUs'), href: "/contact" },
                { label: t('feedback'), href: "/feedback" },
                { label: t('accessibility'), href: "/accessibility" },
                { label: t('securityFraud'), href: "/security" },
            ]
        },
        {
            id: "stores",
            title: t('storesServices'),
            links: [
                { label: t('findStore'), href: "/store-locator" },
                { label: t('pharmacy'), href: "/pharmacy" },
                { label: t('optical'), href: "/optical" },
                { label: t('clinic'), href: "/clinic" },
                { label: t('moreServices'), href: "/services" },
            ]
        },
        {
            id: "services",
            title: t('services'),
            links: [
                { label: t('membershipProgram'), href: "/membership" },
                { label: t('giftCards'), href: "/gift-cards" },
                { label: t('giftRegistry'), href: "/registry" },
                { label: t('sameDayDelivery'), href: "/same-day-delivery" },
                { label: t('orderPickup'), href: "/order-pickup" },
                { label: t('freeShipping'), href: "/free-shipping" },
                { label: t('sellWithUs'), href: "/sell" },
            ]
        },
    ]

    const socialLinks = [
        { name: "Pinterest", href: "#", icon: PinterestIcon },
        { name: "Facebook", href: "#", icon: FacebookIcon },
        { name: "Instagram", href: "#", icon: InstagramIcon },
        { name: "X", href: "#", icon: XIcon },
        { name: "YouTube", href: "#", icon: YouTubeIcon },
        { name: "TikTok", href: "#", icon: TikTokIcon },
    ]

    const legalLinks = [
        { label: t('terms'), href: "/terms" },
        { label: t('privacyPolicy'), href: "/privacy" },
        { label: t('cookiePolicy'), href: "/cookies" },
        { label: t('caPrivacyRights'), href: "/privacy#ca-rights" },
        { label: t('yourPrivacyChoices'), href: "/privacy-choices", hasIcon: true },
        { label: t('interestBasedAds'), href: "/interest-based-ads" },
    ]

    return (
        <footer 
            id="footerHeader" 
            className="bg-primary text-primary-foreground/80 mt-auto w-full"
            role="contentinfo"
            aria-label={t('footerLabel')}
        >
            {/* Back to Top */}
            <button
                className="w-full bg-primary/90 hover:bg-primary/80 py-3.5 text-center transition-colors tap-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary group"
                onClick={scrollToTop}
                aria-label={t('backToTop')}
            >
                <span className="text-sm font-normal text-primary-foreground inline-flex items-center gap-1.5">
                    <CaretUp size={16} weight="regular" />
                    {t('backToTop')}
                </span>
            </button>

            {/* Mobile Footer - Accordion */}
            <div className="md:hidden px-4 py-6">
                <Accordion type="single" collapsible className="w-full">
                    {footerSections.map((section) => (
                        <AccordionItem key={section.id} value={section.id} className="border-border/20">
                            <AccordionTrigger className="text-sm font-medium text-primary-foreground hover:no-underline py-4 hover:text-accent">
                                {section.title}
                            </AccordionTrigger>
                            <AccordionContent>
                                <nav aria-label={section.title}>
                                    <ul className="flex flex-col gap-3 pb-2">
                                        {section.links.map((link, linkIndex) => (
                                            <li key={linkIndex}>
                                                <Link 
                                                    href={link.href} 
                                                    className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors tap-transparent py-1 inline-block"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Desktop Footer Links - 4-Column Grid */}
            <div className="hidden md:block border-b border-border/20">
                <div className="container py-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                        {footerSections.map((section) => (
                            <div key={section.id}>
                                <h4 className="font-medium text-primary-foreground text-sm mb-4 pb-2 border-b border-border/10">
                                    {section.title}
                                </h4>
                                <nav aria-label={section.title}>
                                    <ul className="space-y-2.5">
                                        {section.links.map((link, linkIndex) => (
                                            <li key={linkIndex}>
                                                <Link 
                                                    href={link.href} 
                                                    className="text-sm text-primary-foreground/90 hover:text-primary-foreground hover:underline underline-offset-2 transition-colors inline-block"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Brand Logo, Social Media & Legal Section */}
            <div className="container py-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="inline-block group" aria-label={t('homePage')}>
                        <span className="text-3xl font-semibold text-primary-foreground tracking-tight group-hover:text-accent transition-colors">
                            AMZN
                        </span>
                    </Link>
                </div>

                {/* Social Media Icons */}
                <nav aria-label={t('socialMedia')} className="flex justify-center gap-3 mb-8">
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-11 rounded-full bg-primary-foreground/10 hover:bg-accent/20 flex items-center justify-center text-primary-foreground/70 hover:text-accent tap-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={social.name}
                        >
                            <social.icon />
                        </a>
                    ))}
                </nav>

                {/* Legal Links */}
                <nav aria-label={t('legalLinks')} className="flex flex-wrap justify-center gap-x-5 gap-y-2.5 text-xs text-primary-foreground/90 mb-6">
                    {legalLinks.map((link, index) => (
                        <Link 
                            key={index}
                            href={link.href} 
                            className="hover:text-primary-foreground hover:underline underline-offset-2 transition-colors whitespace-nowrap flex items-center"
                        >
                            {link.hasIcon && <PrivacyIcon />}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Copyright */}
                <p className="text-xs text-primary-foreground/80 text-center">
                    {t('copyright', { year: currentYear })}
                </p>
            </div>
        </footer>
    )
}
