"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Star } from "lucide-react"
import { Label } from "@/components/ui/label"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category")
  const currentMinPrice = searchParams.get("minPrice")
  const currentMaxPrice = searchParams.get("maxPrice")
  const currentRating = searchParams.get("minRating")

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/search?${params.toString()}`)
  }

  const handlePriceClick = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) params.set("minPrice", min)
    else params.delete("minPrice")

    if (max) params.set("maxPrice", max)
    else params.delete("maxPrice")

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6 text-[#0F1111]">
      {/* Prime Filter */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="prime" className="border-[#888] data-[state=checked]:bg-[#007185] data-[state=checked]:border-[#007185]" />
          <Label htmlFor="prime" className="text-sm font-medium flex items-center gap-1 cursor-pointer">
            <img src="https://m.media-amazon.com/images/G/01/prime/marketing/slashPrime/amazon-prime-delivery-checkmark._CB611051915_.png" alt="Prime" className="h-[14px]" />
          </Label>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">Department</h3>
        <div className="space-y-1">
          {["Electronics", "Books", "Fashion", "Home & Kitchen", "Toys & Games"].map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <span
                className={`text-sm cursor-pointer hover:text-[#c7511f] ${currentCategory === cat ? "font-bold text-[#c45500]" : "text-[#0F1111]"}`}
                onClick={() => updateParams("category", currentCategory === cat ? null : cat)}
              >
                {cat}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">Customer Reviews</h3>
        {[4, 3, 2, 1].map((stars) => (
          <div
            key={stars}
            className="flex items-center gap-1 mb-1 cursor-pointer hover:opacity-80 group"
            onClick={() => updateParams("minRating", stars.toString())}
          >
            <div className="flex text-[#f08804]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < stars ? "fill-current" : "text-transparent stroke-current stroke-1 text-[#f08804]"}`}
                />
              ))}
            </div>
            <span className="text-sm text-[#007185] group-hover:text-[#c7511f] group-hover:underline">& Up</span>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">Price</h3>
        <div className="space-y-1 text-sm text-[#0F1111]">
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick(null, "25")}>
            Under $25
          </div>
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick("25", "50")}>
            $25 to $50
          </div>
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick("50", "100")}>
            $50 to $100
          </div>
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick("100", "200")}>
            $100 to $200
          </div>
          <div className="cursor-pointer hover:text-[#c7511f] hover:underline" onClick={() => handlePriceClick("200", null)}>
            $200 & Above
          </div>
          {(currentMinPrice || currentMaxPrice) && (
            <div
              className="pt-2 text-[#007185] cursor-pointer text-xs hover:underline"
              onClick={() => handlePriceClick(null, null)}
            >
              Clear Price Filter
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
