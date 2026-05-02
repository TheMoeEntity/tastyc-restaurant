import { CartHero } from "@/components/sections/Cart/CartHero";
import { CartContent } from "@/components/sections/Cart/CartContent";

export default function CartPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <CartHero />
      <CartContent />
    </main>
  );
}