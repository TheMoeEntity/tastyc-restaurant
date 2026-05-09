import { CheckoutContent } from "@/components/sections/Checkout/CheckoutContent";

export const metadata = {
  title: "Checkout | Tastyc",
  description: "Complete your order",
};

export default function CheckoutPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <CheckoutContent />
    </main>
  );
}
