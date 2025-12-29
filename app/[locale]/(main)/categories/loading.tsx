import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner (match /categories) */}
      <div className="bg-primary text-primary-foreground py-6 sm:py-10">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 sm:size-14 bg-primary-foreground/10 rounded-full flex items-center justify-center" />
            <div className="space-y-2">
              <Skeleton className="h-8 sm:h-10 w-56 bg-primary-foreground/15" />
              <Skeleton className="h-4 w-72 bg-primary-foreground/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="container -mt-4 sm:-mt-6 space-y-2">
        {/* Category Circles card (match /categories) */}
        <section className="bg-background rounded-xl border border-border p-2 shadow-sm">
          <div className="px-2 py-1">
            <Skeleton className="h-6 w-52" />
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2 px-2 py-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                <Skeleton className="size-14 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA placeholder (match page structure) */}
        <div className="px-0">
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
