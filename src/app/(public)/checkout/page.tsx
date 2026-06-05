import { CheckoutContent } from "@/components/sections/Checkout/CheckoutContent";
import { getRestaurantConfig } from "@/lib/api/config";

export const metadata = {
  title: "Checkout | Tastyc",
  description: "Complete your order",
};

export default async function CheckoutPage() {
  const config = await getRestaurantConfig();
  return (
    <main className="bg-gray-50 min-h-screen">
      <CheckoutContent deliveryFee={config?.deliveryFee || 1000} />
    </main>
  );
}
