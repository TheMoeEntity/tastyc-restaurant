import { CategoriesHero } from "@/components/sections/Shop/categories/CategoriesHero";
import { CategoriesGrid } from "@/components/sections/Shop/categories/CategoriesGrid";
import { PopularProducts } from "@/components/sections/Shop/categories/PopularProducts";

export default function ShopCategoriesPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <CategoriesHero />
      <CategoriesGrid />
      <PopularProducts />
    </main>
  );
}