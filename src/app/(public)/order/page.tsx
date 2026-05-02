import { OrdersHeader } from "@/components/sections/Order/OrdersHeader";
import { OrdersContent } from "@/components/sections/Order/OrdersContent";

export default function OrdersPage() {
  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <OrdersHeader />
      <OrdersContent />
    </main>
  );
}