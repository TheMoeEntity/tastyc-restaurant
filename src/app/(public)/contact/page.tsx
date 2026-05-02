import { ContactHero } from "@/components/sections/Contact/ContactHero";
import { ContactInfoGrid } from "@/components/sections/Contact/ContactInfoGrid";
import { ContactFormSocial } from "@/components/sections/Contact/ContactFormSocial";
import { ContactFAQ } from "@/components/sections/Contact/ContactFAQ";

export default function ContactPage() {
  return (
    <main className="bg-white overflow-hidden">
      <ContactHero />
      <ContactInfoGrid />
      <ContactFormSocial />
      <ContactFAQ />
    </main>
  );
}