import { Star, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ReviewsSection({ rating, reviewCount }: { rating: number, reviewCount: number }) {
    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12">
            {/* Left Column: Customer Reviews Summary */}
            <div>
                <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Customer reviews</h2>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-[#f08804]">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-current" : "text-transparent stroke-current stroke-1 text-[#f08804]"}`}
                            />
                        ))}
                    </div>
                    <span className="text-lg font-medium text-[#0F1111]">{rating} out of 5</span>
                </div>
                <div className="text-[#565959] text-sm mb-6">{reviewCount} global ratings</div>

                <div className="space-y-3 mb-8">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3 text-sm text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer group">
                            <span className="w-12 text-[#0F1111] group-hover:text-[#c7511f] group-hover:underline">{star} star</span>
                            <Progress value={star === 5 ? 70 : star === 4 ? 20 : 5} className="h-5 rounded-[4px] bg-[#f0f2f2] [&>div]:bg-[#f08804] border border-[#e3e6e6] shadow-inner" />
                            <span className="w-8 text-right">{star === 5 ? "70%" : star === 4 ? "20%" : "5%"}</span>
                        </div>
                    ))}
                </div>

                <Separator className="my-6" />

                <h3 className="font-bold text-lg mb-2">Review this product</h3>
                <p className="text-sm text-[#0F1111] mb-4">Share your thoughts with other customers</p>
                <Button variant="outline" className="w-full rounded-[8px] border-[#d5d9d9] hover:bg-[#f7fafa]">
                    Write a customer review
                </Button>
            </div>

            {/* Right Column: Individual Reviews */}
            <div>
                <h3 className="font-bold text-lg mb-4">Top reviews from the United States</h3>

                <div className="space-y-6">
                    {/* Review 1 */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-[#0F1111]">John Doe</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex text-[#f08804]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-[#0F1111]">Great product, highly recommend!</span>
                        </div>
                        <div className="text-sm text-[#565959]">Reviewed in the United States on August 10, 2023</div>
                        <div className="text-sm text-[#c45500] font-bold">Verified Purchase</div>
                        <p className="text-sm text-[#0F1111] leading-relaxed">
                            I've been using this for a week now and I'm absolutely loving it. The quality is top-notch and it works exactly as described.
                            Shipping was fast and packaging was secure. Definitely worth the price.
                        </p>
                        <div className="text-sm text-[#565959] pt-2">45 people found this helpful</div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-8 px-4 rounded-[8px] border-[#d5d9d9] text-sm hover:bg-[#f7fafa]">
                                Helpful
                            </Button>
                            <Button variant="ghost" className="h-8 px-2 text-sm text-[#565959] hover:bg-transparent hover:underline">
                                Report
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Review 2 */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user-2.jpg" />
                                <AvatarFallback>AS</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-[#0F1111]">Alice Smith</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex text-[#f08804]">
                                {[...Array(4)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                                <Star className="h-4 w-4 text-transparent stroke-current stroke-1 text-[#f08804]" />
                            </div>
                            <span className="text-sm font-bold text-[#0F1111]">Good value for money</span>
                        </div>
                        <div className="text-sm text-[#565959]">Reviewed in the United States on July 22, 2023</div>
                        <div className="text-sm text-[#c45500] font-bold">Verified Purchase</div>
                        <p className="text-sm text-[#0F1111] leading-relaxed">
                            Overall a solid purchase. It does what it says, though I wish the battery life was a bit longer.
                            Still, for the price point, you can't go wrong.
                        </p>
                        <div className="text-sm text-[#565959] pt-2">12 people found this helpful</div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-8 px-4 rounded-[8px] border-[#d5d9d9] text-sm hover:bg-[#f7fafa]">
                                Helpful
                            </Button>
                            <Button variant="ghost" className="h-8 px-2 text-sm text-[#565959] hover:bg-transparent hover:underline">
                                Report
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Link href="#" className="text-[#007185] hover:text-[#c7511f] hover:underline font-medium text-sm">
                        See all reviews {">"}
                    </Link>
                </div>
            </div>
        </div>
    )
}

import Link from "next/link"
