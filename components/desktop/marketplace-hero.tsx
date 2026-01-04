import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Storefront, 
  ShoppingBag, 
  ArrowRight, 
  Users, 
  User, 
  Heart, 
  Bell
} from "@phosphor-icons/react/dist/ssr"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

interface MarketplaceHeroProps {
  locale: string
  categories: Category[]
}

export function MarketplaceHero({ locale, categories }: MarketplaceHeroProps) {
  const isBg = locale === "bg"

  return (
    <div className="w-full">
      {/* Main Hero Banner - Full Width */}
      <div className="relative w-full overflow-hidden rounded-md bg-cta-trust-blue shadow-sm">
        {/* Background Solid Color */}
        <div className="absolute inset-0 bg-cta-trust-blue z-0" />
        <div
          className="absolute right-0 top-0 h-full w-1/2 bg-cover bg-center opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop')",
          }}
        />
        
        <div className="relative z-10 px-6 py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left Content */}
            <div className="text-center lg:text-left max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white mb-3 border border-white/20 mx-auto lg:mx-0">
                <Users weight="fill" className="size-3.5" />
                <span>{isBg ? "10,000+ потребители" : "10,000+ users"}</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-2 text-balance leading-tight">
                {isBg 
                  ? "Твоят нов онлайн пазар в България" 
                  : "Your New Marketplace in Bulgaria"}
              </h1>

              <p className="text-sm lg:text-base text-blue-50 font-normal mb-0 text-pretty leading-relaxed">
                {isBg 
                  ? "Купувай и продавай лесно. Безплатно публикуване, без такси за купувача." 
                  : "Buy and sell easily. Free listings, no buyer fees."}
              </p>
            </div>

            {/* Right Content - Buttons */}
            <div className="flex flex-wrap justify-center gap-3 shrink-0">
              <Button
                asChild
                size="lg"
                className="bg-white text-cta-trust-blue hover:bg-blue-50 shadow-sm border-0 font-bold h-10 px-6 text-sm"
              >
                <Link href="/sell">
                  <Storefront weight="fill" className="size-4 mr-2" />
                  {isBg ? "Започни да продаваш" : "Start Selling"}
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-blue-600/30 text-white border-white/20 hover:bg-blue-600/50 hover:text-white backdrop-blur-sm h-10 px-6 text-sm font-medium"
              >
                <Link href="/search">
                  <ShoppingBag weight="fill" className="size-4 mr-2" />
                  {isBg ? "Разгледай обяви" : "Browse Listings"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
