"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Star,
    Percent,
    Clock,
    Fire,
    DeviceMobile,
    House,
    TShirt,
    PaintBrush,
    PuzzlePiece, 
    Barbell,
    Lightning as Zap,
    type Icon
} from "@phosphor-icons/react"
import { AppBreadcrumb, breadcrumbPresets } from "@/components/navigation/app-breadcrumb"
import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"

// Deal categories with Phosphor icons for circle filters
const dealCategories: { id: string; icon: Icon; slug: string }[] = [
    { id: "all", icon: Fire, slug: "all" },
    { id: "electronics", icon: DeviceMobile, slug: "electronics" },
    { id: "home", icon: House, slug: "home" },
    { id: "fashion", icon: TShirt, slug: "fashion" },
    { id: "beauty", icon: PaintBrush, slug: "beauty" },
    { id: "toys", icon: PuzzlePiece, slug: "toys" },
    { id: "sports", icon: Barbell, slug: "sports" },
]

export default function TodaysDealsPage() {
    const t = useTranslations('TodaysDeals')
    const locale = useLocale()
    const [activeCategory, setActiveCategory] = useState("all")
    const [activeTab, setActiveTab] = useState("all")

    const tabs = [
        { id: "all", label: t('allDeals') },
        { id: "available", label: t('available') },
        { id: "upcoming", label: t('upcoming') },
        { id: "watchlist", label: t('watchlist') },
    ]

    const getCategoryName = (id: string) => {
        const names: Record<string, { en: string; bg: string }> = {
            all: { en: "All Deals", bg: "Всички оферти" },
            electronics: { en: "Electronics", bg: "Електроника" },
            home: { en: "Home", bg: "Дом" },
            fashion: { en: "Fashion", bg: "Мода" },
            beauty: { en: "Beauty", bg: "Красота" },
            toys: { en: "Toys", bg: "Играчки" },
            sports: { en: "Sports", bg: "Спорт" },
        }
        return locale === "bg" ? names[id]?.bg : names[id]?.en
    }

    const deals = [
        {
            id: 1,
            title: "Amazon Fire TV Stick 4K streaming device",
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: 50,
            price: 24.99,
            originalPrice: 49.99,
            rating: 4.7,
            reviews: 12500,
            timeLeft: "2:14:32",
            category: "electronics"
        },
        {
            id: 2,
            title: "Echo Dot (5th Gen) | Digital Clock",
            image: "https://images.unsplash.com/photo-1543512214-318c77a07298?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: 35,
            price: 39.99,
            originalPrice: 59.99,
            rating: 4.6,
            reviews: 8400,
            timeLeft: "5:22:10",
            category: "electronics"
        },
        {
            id: 3,
            title: "Samsung 55-Inch Class Crystal UHD 4K TV",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: 22,
            price: 347.99,
            originalPrice: 447.99,
            rating: 4.5,
            reviews: 3200,
            timeLeft: "12:45:00",
            category: "electronics"
        },
        {
            id: 4,
            title: "Sony WH-1000XM5 Wireless Headphones",
            image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: 18,
            price: 328.00,
            originalPrice: 399.99,
            rating: 4.8,
            reviews: 5600,
            timeLeft: "8:30:15",
            category: "electronics"
        },
        {
            id: 5,
            title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
            image: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: 40,
            price: 59.95,
            originalPrice: 99.99,
            rating: 4.7,
            reviews: 145000,
            timeLeft: "1:15:00",
            category: "home"
        },
        {
            id: 6,
            title: "Fitbit Charge 6 Fitness Tracker",
            image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: 25,
            price: 119.95,
            originalPrice: 159.95,
            rating: 4.4,
            reviews: 2100,
            timeLeft: "6:00:00",
            category: "sports"
        }
    ]

    // Filter deals by category
    const filteredDeals = activeCategory === "all" 
        ? deals 
        : deals.filter(deal => deal.category === activeCategory)

    return (
        <div className="min-h-screen bg-background pb-20 sm:pb-12">
            {/* Hero Banner */}
            <div className="bg-linear-to-r from-brand-deal via-brand-deal to-brand-deal/90 text-white py-6 sm:py-10">
                <div className="container">
                    {/* Breadcrumb */}
                    <div className="[&_nav]:border-white/20 [&_nav]:mb-2 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
                        <AppBreadcrumb 
                            items={breadcrumbPresets.todaysDeals}
                            homeLabel={locale === "bg" ? "Начало" : "Amazong"}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-12 sm:size-14 bg-white/10 rounded-full flex items-center justify-center">
                            <Zap className="size-6 sm:size-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold">{t('title')}</h1>
                            <p className="text-white/80 text-sm sm:text-base mt-1">
                                {locale === "bg" ? "Спести до 70% на хиляди продукти" : "Save up to 70% on thousands of items"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container -mt-4 sm:-mt-6">
                {/* Category Circles - Filter by deal category */}
                <div className="bg-card rounded-lg border border-border p-4 mb-4 sm:mb-6">
                    <h2 className="text-sm font-semibold text-foreground mb-3">
                        {locale === "bg" ? "Филтрирай по категория" : "Filter by category"}
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
                        {dealCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 min-w-[70px] shrink-0 snap-start",
                                    "touch-action-manipulation active:scale-95 transition-transform"
                                )}
                            >
                                <div className={cn(
                                    "size-14 sm:size-16 rounded-full flex items-center justify-center",
                                    "border-2 transition-all",
                                    activeCategory === cat.id 
                                        ? "bg-primary/10 border-primary" 
                                        : "bg-muted border-transparent hover:shadow-sm"
                                )}>
                                    <cat.icon className={cn(
                                        "size-6 sm:size-7 transition-colors",
                                        activeCategory === cat.id ? "text-primary" : "text-muted-foreground"
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-xs font-medium text-center transition-colors",
                                    activeCategory === cat.id ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {getCategoryName(cat.id)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Filters */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4 sm:mb-6 no-scrollbar snap-x snap-mandatory sm:snap-none">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "min-h-11 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 snap-start",
                                "touch-action-manipulation active:scale-95",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-foreground hover:bg-muted border border-border"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-semibold text-foreground">{filteredDeals.length}</span>{" "}
                    {locale === "bg" ? "оферти намерени" : "deals found"}
                </p>

                {/* Deals Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                    {filteredDeals.map((deal) => (
                        <Card 
                            key={deal.id} 
                            className="h-full hover:shadow-product-hover transition-shadow cursor-pointer border-border rounded-lg overflow-hidden group"
                        >
                            <CardContent className="p-2 sm:p-3 md:p-4">
                                {/* Image with discount badge */}
                                <div className="aspect-square relative mb-2 sm:mb-3 bg-secondary rounded-lg overflow-hidden">
                                    <Image
                                        src={deal.image}
                                        alt={deal.title}
                                        fill
                                        className="object-contain w-full h-full mix-blend-multiply"
                                    />
                                    {/* Discount badge */}
                                    <div className="absolute top-1.5 left-1.5">
                                        <Badge className="bg-brand-deal hover:bg-brand-deal text-white rounded-md px-1.5 py-0.5 text-xs font-bold">
                                            -{deal.discount}%
                                        </Badge>
                                    </div>
                                </div>

                                {/* Time remaining */}
                                <div className="flex items-center gap-1 text-brand-deal text-xs font-medium mb-2">
                                    <Clock className="size-3" />
                                    <span>{locale === "bg" ? "Приключва след" : "Ends in"} {deal.timeLeft}</span>
                                </div>

                                {/* Price */}
                                <div className="mb-1.5 sm:mb-2">
                                    <span className="text-lg sm:text-2xl font-bold text-foreground">
                                        ${deal.price.toFixed(2)}
                                    </span>
                                    <span className="text-muted-foreground text-xs sm:text-sm line-through ml-2">
                                        ${deal.originalPrice.toFixed(2)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xs sm:text-sm font-medium line-clamp-2 mb-1.5 sm:mb-2 text-foreground group-hover:text-primary transition-colors min-h-8 sm:min-h-10">
                                    {deal.title}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                    <div className="flex text-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "size-3 sm:size-3.5",
                                                    i < Math.floor(deal.rating) ? "fill-current" : "text-rating-empty fill-current"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-link font-medium">
                                        {deal.reviews.toLocaleString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty state */}
                {filteredDeals.length === 0 && (
                    <div className="text-center py-12">
                        <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Percent className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {locale === "bg" ? "Няма оферти в тази категория" : "No deals in this category"}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {locale === "bg" ? "Проверете отново по-късно" : "Check back later for new deals"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
