import { LocationsHero } from "@/components/sections/Contact/LocationHero";
import { LocationsContent } from "@/components/sections/Contact/LocationContent";

export default function LocationsPage() {
  return (
    <main className="bg-white overflow-hidden">
      <LocationsHero />
      <LocationsContent />
    </main>
  );
}