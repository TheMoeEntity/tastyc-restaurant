import { DealsHero } from "@/components/sections/Shop/deals/DealsHero";
import { DealsContent } from "@/components/sections/Shop/deals/DealsContent";

export default function ShopDealsPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <DealsHero />
      <DealsContent />
    </main>
  );
}