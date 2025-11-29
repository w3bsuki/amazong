"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { List, UserCircle, CaretRight, X, Globe, SignIn, User, MapPin, Chat } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/routing"
import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { User as SupabaseUser } from "@supabase/supabase-js"

interface SidebarMenuProps {
    user?: SupabaseUser | null
}

export function SidebarMenu({ user }: SidebarMenuProps) {
    const [open, setOpen] = useState(false)
    const t = useTranslations('Sidebar')
    const locale = useLocale()

    // Get display name from user metadata or email
    const getUserDisplayName = () => {
        if (!user) return null
        if (user.user_metadata?.full_name) return user.user_metadata.full_name
        if (user.user_metadata?.name) return user.user_metadata.name
        if (user.email) return user.email.split('@')[0]
        return null
    }

    const displayName = getUserDisplayName()
    const isLoggedIn = !!user

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
                { label: t('gaming'), href: "/search?category=gaming" },
                { label: t('smartHome'), href: "/search?category=smart-home" },
                { label: t('homeKitchen'), href: "/search?category=home" },
                { label: t('fashion'), href: "/search?category=fashion" },
                { label: t('beauty'), href: "/search?category=beauty" },
                { label: t('toys'), href: "/search?category=toys" },
                { label: t('sports'), href: "/search?category=sports" },
                { label: t('books'), href: "/search?category=books" },
                { label: t('automotive'), href: "/search?category=automotive" },
                { label: t('garden'), href: "/search?category=garden" },
                { label: t('health'), href: "/search?category=health" },
                { label: t('baby'), href: "/search?category=baby" },
                { label: t('pets'), href: "/search?category=pets" },
                { label: t('office'), href: "/search?category=office" },
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
                { label: t('orders'), href: "/account/orders" },
                { label: t('messages'), href: "/account/messages" },
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
                <button className="flex items-center justify-center gap-1 font-bold md:hover:outline md:outline-1 md:outline-white size-10 p-1.5 md:p-1.5 rounded-md cursor-pointer">
                    <List size={22} weight="regular" />
                    <span className="text-sm hidden md:inline">{t('all')}</span>
                </button>
            </SheetTrigger>
            <SheetContent 
                side="left" 
                className="w-[85vw] max-w-xs md:w-[365px] md:max-w-[365px] p-0 border-r-0 bg-white text-black gap-0"
            >
                {/* Header with Sign In / User Name - matches mobile header exactly */}
                <SheetHeader className="bg-header-bg text-header-text px-2 py-2 md:p-4 md:py-3 flex flex-row items-center gap-1 md:gap-3 space-y-0">
                    <div className="size-10 rounded-full bg-muted-foreground/30 flex items-center justify-center shrink-0">
                        <UserCircle size={24} weight="regular" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <SheetTitle className="text-header-text text-lg md:text-xl font-bold truncate">
                            {isLoggedIn 
                                ? `${locale === 'bg' ? 'Здравей' : 'Hello'}, ${displayName}`
                                : t('helloSignIn')
                            }
                        </SheetTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 md:right-2 md:top-2 size-10 text-header-text hover:bg-transparent hover:text-header-text-muted"
                        onClick={() => setOpen(false)}
                    >
                        <X size={24} weight="regular" />
                        <span className="sr-only">{t('close')}</span>
                    </Button>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-60px)] pb-4">
                    <div className="flex flex-col">
                        {/* Quick Actions - Mobile Only */}
                        <div className="md:hidden px-4 py-3 bg-secondary border-b border-border">
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href="/auth/login"
                                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-card rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-transform"
                                    onClick={() => setOpen(false)}
                                >
                                    <SignIn size={16} weight="regular" className="text-muted-foreground" />
                                    {t('signIn')}
                                </Link>
                                <Link
                                    href="/account"
                                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-card rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-transform"
                                    onClick={() => setOpen(false)}
                                >
                                    <User size={16} weight="regular" className="text-muted-foreground" />
                                    {t('account')}
                                </Link>
                            </div>
                            
                            {/* Language Toggle - Mobile */}
                            <div className="mt-2.5 flex items-center gap-2 py-2 px-3 bg-card rounded-lg border border-border">
                                <Globe size={16} weight="regular" className="text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{t('language')}</span>
                                <div className="ml-auto flex gap-1">
                                    <Link
                                        href="/"
                                        locale="en"
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${locale === 'en' ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        EN
                                    </Link>
                                    <Link
                                        href="/"
                                        locale="bg"
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${locale === 'bg' ? 'bg-brand text-white' : 'bg-muted text-muted-foreground'}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        БГ
                                    </Link>
                                </div>
                            </div>

                            {/* Delivery Location Toggle - Mobile */}
                            <div className="mt-2 flex items-center gap-2 py-2 px-3 bg-card rounded-lg border border-border">
                                <MapPin size={16} weight="regular" className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{t('deliverTo')}</span>
                                <span className="text-sm font-medium text-foreground">Bulgaria</span>
                                <CaretRight size={16} weight="regular" className="ml-auto text-muted-foreground" />
                            </div>
                            
                            {/* Messages - Mobile */}
                            <Link
                                href="/account/messages"
                                className="mt-2 flex items-center gap-2 py-2 px-3 bg-card rounded-lg border border-border"
                                onClick={() => setOpen(false)}
                            >
                                <Chat size={20} weight="regular" className="text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{t('messages')}</span>
                                <CaretRight size={16} weight="regular" className="ml-auto text-muted-foreground" />
                            </Link>
                        </div>

                        {menuSections.map((section, index) => {
                            const isExpandable = section.items.length > 4;
                            const isExpanded = expandedSections[section.title];
                            const visibleItems = isExpandable && !isExpanded ? section.items.slice(0, 4) : section.items;

                            return (
                                <div key={index}>
                                    <div className="px-5 md:px-9 py-4">
                                        <h3 className="font-bold text-base md:text-lg mb-2 text-foreground">{section.title}</h3>
                                        <ul className="space-y-0">
                                            {visibleItems.map((item, i) => (
                                                <li key={i}>
                                                    <Link
                                                        href={item.href}
                                                        className="flex items-center justify-between py-3 md:py-2.5 text-sm text-foreground hover:bg-muted -mx-5 md:-mx-9 px-5 md:px-9 cursor-pointer group"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span>{item.label}</span>
                                                        <CaretRight size={16} weight="regular" className="text-muted-foreground group-hover:text-foreground" />
                                                    </Link>
                                                </li>
                                            ))}
                                            {isExpandable && (
                                                <li>
                                                    <button
                                                        onClick={() => toggleSection(section.title)}
                                                        className="flex items-center gap-1 py-3 md:py-2.5 text-sm text-foreground hover:bg-muted -mx-5 md:-mx-9 px-5 md:px-9 cursor-pointer w-[calc(100%+2.5rem)] md:w-[calc(100%+4.5rem)] text-left font-medium"
                                                    >
                                                        <span>{isExpanded ? t('seeLess') : t('seeAll')}</span>
                                                        <CaretRight size={16} weight="regular" className={`text-muted-foreground transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    {index < menuSections.length - 1 && <Separator className="bg-border" />}
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
