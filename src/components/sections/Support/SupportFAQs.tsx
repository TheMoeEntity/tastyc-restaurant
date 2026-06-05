"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/ui/MotionWrapper";

const popularFAQs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by visiting the Orders page in your account dashboard. You'll receive real-time updates via email and SMS notifications.",
    category: "Orders",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and cash on delivery for eligible orders.",
    category: "Payments",
  },
  {
    question: "Can I modify or cancel my order?",
    answer: "Yes, you can modify or cancel your order within 5 minutes of placing it. After that, please contact our support team immediately for assistance.",
    category: "Orders",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery typically takes 30-45 minutes depending on your location and traffic conditions. You'll receive a real-time tracking link once your order is confirmed.",
    category: "Delivery",
  },
  {
    question: "Do you offer vegetarian options?",
    answer: "Yes, we have a wide range of vegetarian and vegan options clearly marked on our menu with a 'Veg' tag. You can filter by vegetarian items in the menu.",
    category: "Menu",
  },
  {
    question: "How do I make a reservation?",
    answer: "You can make a reservation directly through our website or mobile app. Choose your date, time, and party size, and you'll receive a confirmation instantly.",
    category: "Reservations",
  },
];

export function SupportFAQs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...new Set(popularFAQs.map(faq => faq.category))];

  const filteredFAQs = popularFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 md:py-20 px-6 md:px-16 lg:px-20 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Find quick answers to commonly asked questions
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition bg-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
                selectedCategory === category
                  ? "bg-yellow-500 text-black"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found. Try a different search term.</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <MotionWrapper key={index} variant="fade-up" delay={index * 50}>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex-1 pr-4">
                      <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded mb-2 inline-block">
                        {faq.category}
                      </span>
                      <h3 className="font-semibold text-gray-800 text-base md:text-lg mt-1">
                        {faq.question}
                      </h3>
                    </div>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-yellow-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-yellow-500 shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </MotionWrapper>
            ))
          )}
        </div>

        {/* View All FAQs Link */}
        <div className="text-center mt-8">
          <Link 
            href="/support/faq"
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold transition"
          >
            View all FAQs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}