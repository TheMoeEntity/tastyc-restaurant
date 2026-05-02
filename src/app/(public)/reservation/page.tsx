import { ReservationHero } from "@/components/sections/Reservation/ReservationHero";
import { ReservationBooking } from "@/components/sections/Reservation/ReservationBooking";
import { ReservationCTA } from "@/components/sections/Reservation/ReservationCTA";

export default function ReservationPage() {
  return (
    <main className="bg-white overflow-hidden">
      <ReservationHero />
      <ReservationBooking />
      <ReservationCTA />
    </main>
  );
}