import { Link } from "@/i18n/routing"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PromoCardProps {
  bgImage: string
  dealText: string       // "Save up to" | "Up to" | "BOGO"
  highlight: string      // "$200" | "50% off" | "Free"
  subtitle: string       // "Apple devices*" | "select toys*"
  href: string
  badge?: string         // "Deal of the Day" | "Hot Deal"
  variant?: "default" | "wide"
  loading?: "eager" | "lazy"
}

export function PromoCard({ 
  bgImage, 
  dealText, 
  highlight, 
  subtitle, 
  href, 
  badge,
  variant = "default",
  loading
}: PromoCardProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "group relative block rounded-md overflow-hidden active:opacity-95 transition-opacity",
        variant === "default" && "aspect-4/3",
        variant === "wide" && "aspect-video col-span-2"
      )}
    >
      {/* Background Image */}
      <Image 
        src={bgImage} 
        alt={subtitle} 
        fill
        className="absolute inset-0 size-full object-cover" 
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        loading={loading}
      />
      
      {/* Simple dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Badge - Treido: bg-gray-900 text-white uppercase */}
      {badge && (
        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-gray-900 text-white text-[10px] font-bold uppercase rounded-sm">
          {badge}
        </span>
      )}
      
      {/* Deal Content - Treido typography */}
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/80">{dealText}</p>
        <p className="text-[22px] font-extrabold tracking-tight leading-none">
          {highlight}
        </p>
        <p className="mt-0.5 text-[13px] font-medium text-white/90 line-clamp-1">{subtitle}</p>
      </div>
      
    </Link>
  )
}
