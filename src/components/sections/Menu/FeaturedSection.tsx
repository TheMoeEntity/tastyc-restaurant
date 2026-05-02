"use client";

import { featuredItems } from "@/lib/utils/menuUtils";
import { SectionHeader } from "./SectionHeader";
import { MenuCard } from "./MenuCard";

export function FeaturedSection() {
  return (
    <section className="py-20 px-6 md:px-16 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Chef's Selection"
          title="Our Signature Dishes"
          subtitle="These are the plates our guests come back for again and again. Each one tells a story."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item, idx) => (
            <MenuCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}