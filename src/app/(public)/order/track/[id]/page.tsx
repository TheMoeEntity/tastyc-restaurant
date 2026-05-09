import OrderTrackingClient from "./OrderTrackingClient";

export const metadata = {
  title: "Track Order | Tastyc",
};

export default async function OrderTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="bg-gray-50 min-h-screen">
      <OrderTrackingClient id={id} />
    </main>
  );
}
