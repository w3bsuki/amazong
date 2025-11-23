"use client"
"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, UserCircle, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/routing"
import { useState } from "react"
import { useTranslations } from "next-intl"

export function SidebarMenu() {
    const [open, setOpen] = useState(false)
    const t = useTranslations('Sidebar')

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
                { label: t('language'), href: "#" },
                { label: t('country'), href: "#" },
                { label: t('customerService'), href: "/customer-service" },
                { label: t('signIn'), href: "/auth/login" },
            ],
        },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center gap-1 font-bold hover:outline outline-1 outline-white p-1 rounded-sm cursor-pointer">
                    <Menu className="h-6 w-6" />
                    <span className="text-sm">{t('all')}</span>
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[365px] p-0 border-r-0 bg-white text-black gap-0 sm:max-w-[365px]">
                <SheetHeader className="bg-[#232f3e] text-white p-4 py-3 flex flex-row items-center gap-3 space-y-0">
                    <UserCircle className="h-8 w-8" />
                    <SheetTitle className="text-white text-xl font-bold">{t('helloSignIn')}</SheetTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 text-white hover:bg-transparent hover:text-zinc-300"
                        onClick={() => setOpen(false)}
                    >
                        <X className="h-8 w-8" />
                        <span className="sr-only">{t('close')}</span>
                    </Button>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-60px)] pb-4">
                    <div className="flex flex-col">
                        {menuSections.map((section, index) => (
                            <div key={index}>
                                <div className="px-9 py-4">
                                    <h3 className="font-bold text-lg mb-2 text-[#111111]">{section.title}</h3>
                                    <ul className="space-y-0">
                                        {section.items.map((item, i) => (
                                            <li key={i}>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center justify-between py-3 text-sm text-[#111111] hover:bg-zinc-100 -mx-9 px-9 cursor-pointer group"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <span>{item.label}</span>
                                                    <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-[#111111]" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {index < menuSections.length - 1 && <Separator className="bg-zinc-200" />}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
