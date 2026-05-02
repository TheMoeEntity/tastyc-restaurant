import { WishlistHero } from "@/components/sections/Shop/wishlist/WishlistHero";
import { WishlistContent } from "@/components/sections/Shop/wishlist/WishlistContent";

export default function ShopWishlistPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <WishlistHero />
      <WishlistContent />
    </main>
  );
}