"use client";

import { 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  Truck, 
  MapPin, 
  Users,
  Package,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/ui/MotionWrapper";

const supportCategories = [
  {
    icon: ShoppingBag,
    title: "Orders",
    description: "Track, modify, or cancel your orders",
    href: "/support/orders",
    color: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Billing, refunds, and payment methods",
    href: "/support/payments",
    color: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "Delivery times, fees, and tracking",
    href: "/support/delivery",
    color: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: MapPin,
    title: "Reservations",
    description: "Book, modify, or cancel table reservations",
    href: "/support/reservations",
    color: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    icon: Package,
    title: "Catering",
    description: "Event catering and bulk orders",
    href: "/support/catering",
    color: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  {
    icon: Clock,
    title: "Hours & Location",
    description: "Operating hours and directions",
    href: "/support/hours",
    color: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
  },
  {
    icon: Users,
    title: "Account",
    description: "Profile, preferences, and settings",
    href: "/support/account",
    color: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
  },
  {
    icon: HelpCircle,
    title: "General FAQ",
    description: "Common questions and answers",
    href: "/support/faq",
    color: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
  },
];

export function SupportCategories() {
  return (
    <section className="py-16 md:py-20 px-6 md:px-16 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-3">
            Browse Support Topics
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Select a category to find answers to your questions quickly
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <MotionWrapper key={index} variant="fade-up" delay={index * 50}>
                <Link href={category.href}>
                  <div className="group p-6 rounded-2xl border border-gray-100 hover:border-yellow-200 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-yellow-600 transition">
                      {category.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}