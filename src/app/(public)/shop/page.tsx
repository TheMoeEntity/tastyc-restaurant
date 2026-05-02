import { ShopHero } from "@/components/sections/Shop/ShopHero";
import { ShopProducts } from "@/components/sections/Shop/ShopProducts";
import { ShopFeatures } from "@/components/sections/Shop/ShopFeatures";
import { ShopCTA } from "@/components/sections/Shop/ShopCTA";

export default function ShopPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <ShopHero />
      <ShopProducts />
      <ShopFeatures />
      <ShopCTA />
    </main>
  );
}