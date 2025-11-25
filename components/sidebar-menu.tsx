"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, UserCircle, ChevronRight, X, Globe, LogIn, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/routing"
import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"

export function SidebarMenu() {
    const [open, setOpen] = useState(false)
    const t = useTranslations('Sidebar')
    const locale = useLocale()

    const menuSections = [
        {
            title: t('digitalContent'),
            items: [
                { label: t('amazonMusic'), href: "/search?q=Amazon+Music" },
                { label: t('kindleBooks'), href: "/search?q=Kindle" },
                { label: t('amazonAppstore'), href: "/search?q=Appstore" },
            ],
        },
        {
            title: t('shopByDepartment'),
            items: [
                { label: t('electronics'), href: "/search?category=electronics" },
                { label: t('computers'), href: "/search?category=computers" },
                { label: t('smartHome'), href: "/search?q=Smart+Home" },
                { label: t('artsCrafts'), href: "/search?category=arts" },
                { label: t('automotive'), href: "/search?category=automotive" },
                { label: t('baby'), href: "/search?category=baby" },
                { label: t('beauty'), href: "/search?category=beauty" },
                { label: t('womensFashion'), href: "/search?category=fashion" },
                { label: t('mensFashion'), href: "/search?category=fashion" },
                { label: t('girlsFashion'), href: "/search?category=fashion" },
                { label: t('boysFashion'), href: "/search?category=fashion" },
                { label: t('healthHousehold'), href: "/search?category=health" },
                { label: t('homeKitchen'), href: "/search?category=home" },
                { label: t('industrialScientific'), href: "/search?category=industrial" },
                { label: t('luggage'), href: "/search?category=luggage" },
                { label: t('moviesTV'), href: "/search?category=movies" },
                { label: t('petSupplies'), href: "/search?category=pets" },
                { label: t('software'), href: "/search?category=software" },
                { label: t('sportsOutdoors'), href: "/search?category=sports" },
                { label: t('toolsHome'), href: "/search?category=tools" },
                { label: t('toysGames'), href: "/search?category=toys" },
                { label: t('videoGames'), href: "/search?category=videogames" },
            ],
        },
        {
            title: t('programsFeatures'),
            items: [
                { label: t('giftCards'), href: "/gift-cards" },
                { label: t('shopByInterest'), href: "/search?q=Shop+By+Interest" },
                { label: t('amazonLive'), href: "/search?q=Amazon+Live" },
                { label: t('internationalShopping'), href: "/search?q=International+Shopping" },
                { label: t('registry'), href: "/registry" },
                { label: t('todaysDeals'), href: "/todays-deals" },
            ],
        },
        {
            title: t('helpSettings'),
            items: [
                { label: t('yourAccount'), href: "/account" },
                { label: t('customerService'), href: "/customer-service" },
            ],
        },
    ]

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

    const toggleSection = (title: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }))
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center gap-1 font-bold md:hover:outline md:outline-1 md:outline-white p-0 md:p-1 rounded-sm cursor-pointer">
                    <Menu className="h-6 w-6" />
                    <span className="text-sm hidden md:inline">{t('all')}</span>
                </button>
            </SheetTrigger>
            <SheetContent 
                side="left" 
                className="w-[85vw] max-w-[320px] md:w-[365px] md:max-w-[365px] p-0 border-r-0 bg-white text-black gap-0"
            >
                {/* Header with Sign In */}
                <SheetHeader className="bg-[#232f3e] text-white p-4 py-3 flex flex-row items-center gap-3 space-y-0">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                        <UserCircle className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                        <SheetTitle className="text-white text-lg md:text-xl font-bold">{t('helloSignIn')}</SheetTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 text-white hover:bg-transparent hover:text-zinc-300 touch-target"
                        onClick={() => setOpen(false)}
                    >
                        <X className="h-7 w-7 md:h-8 md:w-8" />
                        <span className="sr-only">{t('close')}</span>
                    </Button>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-60px)] pb-4">
                    <div className="flex flex-col">
                        {/* Quick Actions - Mobile Only */}
                        <div className="md:hidden px-4 py-4 bg-slate-50 border-b border-slate-200">
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/auth/login"
                                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 tap-transparent active-scale"
                                    onClick={() => setOpen(false)}
                                >
                                    <LogIn className="h-5 w-5 text-slate-500" />
                                    {t('signIn')}
                                </Link>
                                <Link
                                    href="/account"
                                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 tap-transparent active-scale"
                                    onClick={() => setOpen(false)}
                                >
                                    <User className="h-5 w-5 text-slate-500" />
                                    {t('yourAccount')}
                                </Link>
                            </div>
                            
                            {/* Language Toggle - Mobile */}
                            <div className="mt-3 flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                                <Globe className="h-5 w-5 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">{t('language')}</span>
                                <div className="ml-auto flex gap-1">
                                    <Link
                                        href="/"
                                        locale="en"
                                        className={`px-3 py-1.5 rounded text-xs font-medium tap-transparent ${locale === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        EN
                                    </Link>
                                    <Link
                                        href="/"
                                        locale="bg"
                                        className={`px-3 py-1.5 rounded text-xs font-medium tap-transparent ${locale === 'bg' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        БГ
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {menuSections.map((section, index) => {
                            const isExpandable = section.items.length > 4;
                            const isExpanded = expandedSections[section.title];
                            const visibleItems = isExpandable && !isExpanded ? section.items.slice(0, 4) : section.items;

                            return (
                                <div key={index}>
                                    <div className="px-5 md:px-9 py-4">
                                        <h3 className="font-bold text-base md:text-lg mb-2 text-[#111111]">{section.title}</h3>
                                        <ul className="space-y-0">
                                            {visibleItems.map((item, i) => (
                                                <li key={i}>
                                                    <Link
                                                        href={item.href}
                                                        className="flex items-center justify-between py-3.5 md:py-3 text-sm text-[#111111] hover:bg-zinc-100 -mx-5 md:-mx-9 px-5 md:px-9 cursor-pointer group tap-transparent touch-action-manipulation"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span>{item.label}</span>
                                                        <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-[#111111]" />
                                                    </Link>
                                                </li>
                                            ))}
                                            {isExpandable && (
                                                <li>
                                                    <button
                                                        onClick={() => toggleSection(section.title)}
                                                        className="flex items-center gap-1 py-3.5 md:py-3 text-sm text-[#111111] hover:bg-zinc-100 -mx-5 md:-mx-9 px-5 md:px-9 cursor-pointer w-[calc(100%+2.5rem)] md:w-[calc(100%+4.5rem)] text-left font-medium tap-transparent"
                                                    >
                                                        <span>{isExpanded ? t('seeLess') : t('seeAll')}</span>
                                                        <ChevronRight className={`h-4 w-4 text-zinc-400 transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    {index < menuSections.length - 1 && <Separator className="bg-zinc-200" />}
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
