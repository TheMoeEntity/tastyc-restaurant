import { AboutHero } from "@/components/sections/About/AboutHero";
import { AboutMission } from "@/components/sections/About/AboutMissions";
import { AboutValues } from "@/components/sections/About/AboutValues";
import { AboutTeam } from "@/components/sections/About/AboutTeam";
import { AboutJourney } from "@/components/sections/About/AboutJourney";
import { AboutVisit } from "@/components/sections/About/AboutVisit";

export default function AboutPage() {
  return (
    <main className="bg-white overflow-hidden">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutTeam />
      <AboutJourney />
      <AboutVisit />
    </main>
  );
}