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
      <div className="absolute inset-0 bg-overlay-dark" />
      
      {/* Badge - Treido: inverted surface, uppercase */}
      {badge && (
        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-foreground text-background text-2xs font-bold uppercase rounded-sm">
          {badge}
        </span>
      )}
      
      {/* Deal Content - Treido typography */}
      <div className="absolute bottom-3 left-3 right-3 text-overlay-light">
        <p className="text-tiny font-bold uppercase tracking-wide">{dealText}</p>
        <p className="text-xl font-extrabold tracking-tight leading-none text-overlay-foreground">
          {highlight}
        </p>
        <p className="mt-0.5 text-sm font-medium line-clamp-1">{subtitle}</p>
      </div>
      
    </Link>
  )
}
