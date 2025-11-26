"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Percent } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Breadcrumb } from "@/components/breadcrumb"

export default function TodaysDealsPage() {
    const t = useTranslations('TodaysDeals')
    const [activeCategory, setActiveCategory] = useState(t('allDeals'))

    const categories = [t('allDeals'), t('available'), t('upcoming'), t('watchlist'), t('digitalDeals')]

    const deals = [
        {
            id: 1,
            title: "Amazon Fire TV Stick 4K streaming device",
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: "50% off",
            price: 24.99,
            originalPrice: 49.99,
            rating: 4.7,
            reviews: 12500,
            timeLeft: "Ends in 2:14:32"
        },
        {
            id: 2,
            title: "Echo Dot (5th Gen) | Digital Clock",
            image: "https://images.unsplash.com/photo-1543512214-318c77a07298?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: "35% off",
            price: 39.99,
            originalPrice: 59.99,
            rating: 4.6,
            reviews: 8400,
            timeLeft: "Ends in 5:22:10"
        },
        {
            id: 3,
            title: "Samsung 55-Inch Class Crystal UHD 4K TV",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: "22% off",
            price: 347.99,
            originalPrice: 447.99,
            rating: 4.5,
            reviews: 3200,
            timeLeft: "Ends in 12:45:00"
        },
        {
            id: 4,
            title: "Sony WH-1000XM5 Wireless Headphones",
            image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: "18% off",
            price: 328.00,
            originalPrice: 399.99,
            rating: 4.8,
            reviews: 5600,
            timeLeft: "Ends in 8:30:15"
        },
        {
            id: 5,
            title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
            image: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: "40% off",
            price: 59.95,
            originalPrice: 99.99,
            rating: 4.7,
            reviews: 145000,
            timeLeft: "Ends in 1:15:00"
        },
        {
            id: 6,
            title: "Fitbit Charge 6 Fitness Tracker",
            image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            discount: "25% off",
            price: 119.95,
            originalOriginalPrice: 159.95,
            rating: 4.4,
            reviews: 2100,
            timeLeft: "Ends in 6:00:00"
        }
    ]

    return (
        <div className="min-h-screen bg-background pb-16 sm:pb-12">
            <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
                <Breadcrumb items={[{ label: t('title'), icon: <Percent className="size-4" /> }]} />
                
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-foreground">{t('title')}</h1>

                {/* Categories - Horizontal scroll on mobile with proper touch targets */}
                <div className="flex gap-2 overflow-x-auto pb-3 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible mb-6 sm:mb-8 no-scrollbar snap-x snap-mandatory sm:snap-none">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`min-h-11 px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 snap-start touch-action-manipulation active:scale-95 ${activeCategory === cat
                                ? "bg-brand-blue text-white"
                                : "bg-secondary text-foreground hover:bg-muted border border-border"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Deals Grid - 2 cols on mobile, responsive up */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                    {deals.map((deal) => (
                        <Card key={deal.id} className="h-full hover:border-ring transition-colors cursor-pointer border-border rounded-lg overflow-hidden group">
                            <CardContent className="p-2 sm:p-3 md:p-4">
                                <div className="aspect-square relative mb-2 sm:mb-3 md:mb-4 bg-secondary rounded-lg overflow-hidden">
                                    <img
                                        src={deal.image}
                                        alt={deal.title}
                                        className="object-contain w-full h-full mix-blend-multiply"
                                    />
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                                    <Badge className="bg-brand-deal hover:bg-brand-deal text-white rounded-md px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold">
                                        {deal.discount}
                                    </Badge>
                                    <span className="text-brand-deal font-bold text-[10px] sm:text-xs hidden sm:inline">{t('limitedTime')}</span>
                                </div>

                                <div className="mb-1.5 sm:mb-2">
                                    <span className="text-base sm:text-xl font-medium align-top">$</span>
                                    <span className="text-xl sm:text-3xl font-bold text-foreground">{Math.floor(deal.price)}</span>
                                    <span className="text-xs sm:text-sm align-top">{deal.price.toFixed(2).split('.')[1]}</span>
                                    <span className="text-muted-foreground text-xs sm:text-sm line-through ml-1 sm:ml-2">
                                        ${deal.originalPrice}
                                    </span>
                                </div>

                                <h3 className="text-xs sm:text-sm font-medium line-clamp-2 mb-1.5 sm:mb-2 text-foreground group-hover:text-brand-blue transition-colors min-h-8 sm:min-h-10">
                                    {deal.title}
                                </h3>

                                <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                                    <div className="flex text-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`size-3 sm:size-4 ${i < Math.floor(deal.rating) ? "fill-current" : "text-rating-empty fill-current"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-brand-blue font-medium hover:underline cursor-pointer">
                                        {deal.reviews.toLocaleString()}
                                    </span>
                                </div>

                                <p className="text-[10px] sm:text-xs text-muted-foreground">{deal.timeLeft}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
