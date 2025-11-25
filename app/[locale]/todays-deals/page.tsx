"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Percent } from "lucide-react"
import Link from "next/link"
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
        <div className="min-h-screen bg-background pb-12">
            <div className="container mx-auto max-w-7xl px-4 py-6">
                <Breadcrumb items={[{ label: t('title'), icon: <Percent className="h-3.5 w-3.5" /> }]} />
                
                <h1 className="text-3xl font-bold mb-6 text-slate-900">{t('title')}</h1>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeCategory === cat
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {deals.map((deal) => (
                        <Card key={deal.id} className="h-full hover:border-blue-400 transition-colors cursor-pointer border-slate-200 rounded overflow-hidden group">
                            <CardContent className="p-4">
                                <div className="aspect-square relative mb-4 bg-slate-50 rounded overflow-hidden">
                                    <img
                                        src={deal.image}
                                        alt={deal.title}
                                        className="object-contain w-full h-full mix-blend-multiply"
                                    />
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-rose-600 hover:bg-rose-600 text-white rounded-md px-2 py-0.5 text-xs font-bold">
                                        {deal.discount}
                                    </Badge>
                                    <span className="text-rose-600 font-bold text-sm">{t('limitedTime')}</span>
                                </div>

                                <div className="mb-2">
                                    <span className="text-xl font-medium align-top">$</span>
                                    <span className="text-3xl font-bold text-slate-900">{Math.floor(deal.price)}</span>
                                    <span className="text-sm align-top">{deal.price.toFixed(2).split('.')[1]}</span>
                                    <span className="text-slate-500 text-sm line-through ml-2">
                                        ${deal.originalPrice}
                                    </span>
                                </div>

                                <h3 className="text-sm font-medium line-clamp-2 mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                                    {deal.title}
                                </h3>

                                <div className="flex items-center gap-1 mb-2">
                                    <div className="flex text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(deal.rating) ? "fill-current" : "text-slate-200 fill-current"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">
                                        {deal.reviews.toLocaleString()}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500">{deal.timeLeft}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
