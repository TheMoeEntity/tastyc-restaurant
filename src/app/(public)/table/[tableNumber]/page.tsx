import TableClient from "./TableClient";

export const metadata = {
  title: "Scan & Order | Tastyc",
};

export default async function TablePage({
  params,
}: {
  params: Promise<{ tableNumber: string }>;
}) {
  // params resolved server-side so the client component gets a clean prop
  const { tableNumber } = await params;
  return <TableClient key={tableNumber} />;
}
