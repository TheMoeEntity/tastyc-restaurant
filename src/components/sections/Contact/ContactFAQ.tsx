"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { faqs } from "@/lib/utils/contactUtils";

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <MotionWrapper variant="fade-up" className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-0.5 w-6 bg-yellow-500" />
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
          {label}
        </p>
        <div className="h-0.5 w-6 bg-yellow-500" />
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-4 text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-gray-500">
          {subtitle}
        </p>
      )}
    </MotionWrapper>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
      >
        <span className="font-semibold text-gray-800 text-base md:text-lg">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-yellow-500 shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-5 h-5 text-yellow-500 shrink-0 ml-2" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-4 pt-0">
          <p className="text-gray-600 text-base leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function ContactFAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 px-6 md:px-16 lg:px-20 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before visiting Tastyc."
        />
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <MotionWrapper key={index} variant="fade-up" delay={index * 80} duration={500}>
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === index}
                onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}