"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import { MenuCard } from "./MenuCard";
import { getFeaturedItems } from "@/lib/api/menu";
import type { MenuItem } from "@/types/menu.types";
import { Loader2 } from "lucide-react";

export function FeaturedSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedItems()
      .then((res) => {
        if (res.success) setItems(res.data.items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-6 md:px-16 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Chef's Selection"
          title="Our Signature Dishes"
          subtitle="These are the plates our guests come back for again and again."
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <MenuCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No featured items yet.
          </p>
        )}
      </div>
    </section>
  );
}
