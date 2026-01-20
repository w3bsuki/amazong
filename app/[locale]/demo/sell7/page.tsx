import { getSellCategories } from "@/app/[locale]/(sell)/sell/_lib/categories";
import { SellForm } from "./_components/sell-form";

export default async function SellDemoPage() {
  const categories = await getSellCategories();

  return (
    <div className="min-h-screen bg-background pb-20">
      <SellForm categories={categories} />
    </div>
  );
}
