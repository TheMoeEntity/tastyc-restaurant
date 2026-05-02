
import { SupportHero } from "@/components/sections/Support/SupportHero";
import { SupportCategories } from "@/components/sections/Support/SupportCategories";
import { SupportFAQs } from "@/components/sections/Support/SupportFAQs";
import { SupportContact } from "@/components/sections/Support/SupportContact";

export default function SupportPage() {
  return (
    <main className="bg-white overflow-hidden">
      <SupportHero />
      <SupportCategories />
      <SupportFAQs />
      <SupportContact />
    </main>
  );
}