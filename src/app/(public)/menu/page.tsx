import { MenuHero } from "@/components/sections/Menu/MenuHero";
import { FeaturedSection } from "@/components/sections/Menu/FeaturedSection";
import { MenuExplorer } from "@/components/sections/Menu/MenuExplorer";
import { MenuCTA } from "@/components/sections/Menu/MenuCTA";

export default function MenuPage() {
  return (
    <main className="bg-gray-50 overflow-hidden">
      <MenuHero />
      <FeaturedSection />
      <MenuExplorer />
      <MenuCTA />
    </main>
  );
}