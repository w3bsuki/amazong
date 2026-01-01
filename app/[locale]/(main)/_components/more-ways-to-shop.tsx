import Image from "next/image"
import { Link } from "@/i18n/routing"

export function MoreWaysToShop({ locale }: { locale: string }) {
  const cards = [
    {
      href: "/search?sort=newest",
      image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80",
      title: locale === "bg" ? "Нови продукти" : "New Arrivals",
      badge: locale === "bg" ? "Ново" : "New",
    },
    {
      href: "/search?category=fashion",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
      title: locale === "bg" ? "Мода" : "Fashion",
    },
    {
      href: "/gift-cards",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80",
      title: locale === "bg" ? "Подаръци" : "Gifts",
    },
    {
      href: "/search?category=home",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80",
      title: locale === "bg" ? "За дома" : "Home",
    },
  ]

  return (
    <div className="mt-1.5 px-3 sm:mt-0 sm:px-0">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground/90">
          {locale === "bg" ? "Още начини за пазаруване" : "More ways to shop"}
        </h2>
        <div className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden sm:block" />
      </div>

      {/* Mobile: 2x2 grid | Desktop: 4-col grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative aspect-4/3 rounded-md overflow-hidden"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/35" />
            {card.badge && (
              <span className="absolute top-2.5 left-2.5 bg-black/40 text-white text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                {card.badge}
              </span>
            )}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-sm font-bold text-white tracking-tight group-hover:underline underline-offset-4">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
