export default function GiftCardsFeaturedDesigns({ t }: { t: (key: string) => string }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">{t("popularGiftCards")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[1.6] bg-header-bg rounded-lg mb-2 relative overflow-hidden group-hover:opacity-90 transition-opacity">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-header-text font-bold text-xl">Amazon</span>
                <span className="text-brand ml-1">{t("smile")}</span>
              </div>
            </div>
            <p className="font-medium text-sm hover:text-link-hover hover:underline">{t("giftCard")}</p>
          </div>
        ))}
      </div>
    </>
  )
}
