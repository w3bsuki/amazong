"use client"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AccountDropdownProps {
    user: User | null
}

export function AccountDropdown({ user }: AccountDropdownProps) {
    const t = useTranslations('Header')
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <HoverCard openDelay={100} closeDelay={200}>
            <HoverCardTrigger asChild>
                <Link href={user ? "/account" : "/auth/login"}>
                    <Button variant="ghost" className="flex flex-col items-start hover:bg-zinc-800 h-[50px] text-white border-none ring-0 focus-visible:ring-0 rounded-[2px] px-2">
                        <span className="text-[12px] text-[#ccc] leading-[14px]">
                            {user ? `${t('hello')}, ${user.email?.split('@')[0]}` : t('helloSignIn')}
                        </span>
                        <span className="font-bold text-[14px] flex items-center gap-1 leading-[15px]">
                            {t('accountAndLists')}
                            <span className="text-[10px] text-[#a0a0a0]">▼</span>
                        </span>
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-[500px] p-0 bg-white text-black border-none shadow-lg z-50 rounded-[3px] overflow-hidden" align="end" sideOffset={0}>
                <div className="flex flex-col items-center p-4 bg-[#f3f3f3] border-b border-[#ddd]">
                    {!user ? (
                        <>
                            <Link href="/auth/login" className="w-56">
                                <Button className="w-full bg-[#f0c14b] hover:bg-[#e2b13c] text-black shadow-sm border border-[#a88734] rounded-[3px] h-[30px] font-normal text-[13px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]">
                                    {t('signIn')}
                                </Button>
                            </Link>
                            <div className="text-[11px] mt-2 text-[#333]">
                                {t('newCustomer')} <Link href="/auth/sign-up" className="text-[#007185] hover:underline hover:text-[#c7511f]">{t('startHere')}</Link>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-2">
                            <p className="text-sm font-medium">{t('hello')}, {user.email}</p>
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                className="w-56 h-[30px] text-xs"
                            >
                                {t('signOut')}
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex p-5">
                    <div className="flex-1 border-r border-[#eee] pr-5">
                        <h3 className="font-bold text-[16px] mb-2 text-black">{t('yourLists')}</h3>
                        <ul className="space-y-1.5 text-[13px] text-[#444]">
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('createList')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('findList')}</Link></li>
                        </ul>
                    </div>
                    <div className="flex-1 pl-5">
                        <h3 className="font-bold text-[16px] mb-2 text-black">{t('yourAccount')}</h3>
                        <ul className="space-y-1.5 text-[13px] text-[#444]">
                            <li><Link href="/account" className="hover:text-[#c7511f] hover:underline">{t('account')}</Link></li>
                            <li><Link href="/account/orders" className="hover:text-[#c7511f] hover:underline">{t('orders')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('recommendations')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('browsingHistory')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('watchlist')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('videoPurchases')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('kindleUnlimited')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('contentDevices')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('subscribeSave')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('memberships')}</Link></li>
                            <li><Link href="#" className="hover:text-[#c7511f] hover:underline">{t('musicLibrary')}</Link></li>
                        </ul>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
