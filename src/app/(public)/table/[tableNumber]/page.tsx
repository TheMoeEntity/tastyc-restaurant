import { Suspense } from "react";
import TableClient from "./TableClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Scan & Order | Tastyc",
};

export default async function TablePage({
  params,
}: {
  params: Promise<{ tableNumber: string }>;
}) {
  const { tableNumber } = await params;
  return (
    <Suspense fallback={null}>
      <TableClient key={tableNumber} />
    </Suspense>
  );
}