"use client";

import { Clock, Truck, ShieldCheck, Gift } from "lucide-react";

export function ShopFeatures() {
  const features = [
    { icon: Truck, text: "Free Delivery", subtext: "On orders over $50" },
    { icon: Clock, text: "30 Min Delivery", subtext: "Fast & Fresh" },
    { icon: ShieldCheck, text: "Secure Payment", subtext: "100% Safe" },
    { icon: Gift, text: "Rewards Program", subtext: "Earn points" },
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, text, subtext }, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="font-semibold text-gray-800 text-sm">{text}</p>
              <p className="text-xs text-gray-400">{subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}