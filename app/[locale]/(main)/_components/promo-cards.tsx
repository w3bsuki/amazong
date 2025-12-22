import { Link } from "@/i18n/routing"
import { PromoCard } from "@/components/promo/promo-card"

export function PromoCards({ locale }: { locale: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 px-3 mt-4 sm:mt-6 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3 sm:overflow-visible sm:pb-0 no-scrollbar scroll-pl-3">
      <div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80"
          dealText={locale === "bg" ? "Спести до" : "Save up to"}
          highlight="$200"
          subtitle={locale === "bg" ? "Apple устройства*" : "Apple devices*"}
          href="/search?category=electronics&brand=apple"
        />
      </div>
      <div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80"
          dealText={locale === "bg" ? "До" : "Up to"}
          highlight="50%"
          subtitle={locale === "bg" ? "избрани играчки*" : "select toys*"}
          href="/todays-deals?category=toys"
          badge={locale === "bg" ? "🔥 Гореща" : "🔥 Hot"}
        />
      </div>
      <div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
          dealText={locale === "bg" ? "До" : "Up to"}
          highlight="40%"
          subtitle={locale === "bg" ? "електроника*" : "electronics*"}
          href="/search?category=electronics"
        />
      </div>
      <div className="w-[65%] min-w-[65%] shrink-0 snap-start sm:w-auto sm:min-w-0 mr-1 sm:mr-0">
        <PromoCard
          bgImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
          dealText={locale === "bg" ? "До" : "Up to"}
          highlight="30%"
          subtitle={locale === "bg" ? "мода*" : "fashion*"}
          href="/search?category=fashion"
        />
      </div>
    </div>
  )
}
