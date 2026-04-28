// src/app/contact/support/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle, Headphones, Clock, MessageCircle, HelpCircle } from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { SectionHeader } from "@/components/sections/Contact/SectionHeader";
import { FAQItem } from "@/components/sections/Contact/FAQItem";
import {
  supportTopics,
  supportFaqs,
  supportHours,
} from "@/lib/utils/contactUtils";
import { SupportTopic, FAQ, SupportHours as SupportHoursType } from "@/types/contact.types";

export default function SupportPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <main className="bg-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative py-16 md:py-20 lg:py-24 px-6 md:px-16 lg:px-20 bg-white">
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center opacity-40">
          <div className="w-80 h-80 md:w-96 md:h-96 bg-yellow-400/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <MotionWrapper variant="fade-up" duration={700}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Customer Support
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-6">
              How Can We <span className="text-yellow-500">Help You?</span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Our support team is here to assist you with any questions or issues you may have.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* SUPPORT TOPICS */}
      <section className="py-12 md:py-16 px-6 md:px-16 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Support Options"
            title="How Can We Assist You?"
            subtitle="Choose from the options below to get the help you need"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportTopics.map((topic: SupportTopic, index: number) => (
              <MotionWrapper key={index} variant="fade-up" delay={index * 80} duration={500}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-yellow-200">
                  <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500 transition">
                    <topic.icon className="w-7 h-7 text-yellow-600 group-hover:text-white transition" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{topic.description}</p>
                  <Link
                    href={topic.linkHref}
                    className="inline-flex items-center gap-1 text-yellow-600 font-semibold text-sm hover:gap-2 transition-all"
                  >
                    {topic.linkText} →
                  </Link>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT HOURS */}
      <section className="py-16 md:py-20 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Availability"
            title="Support Hours"
            subtitle="Our team is available during these hours to assist you"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportHours.map((hours: SupportHoursType, index: number) => (
              <MotionWrapper key={index} variant="fade-up" delay={index * 100} duration={500}>
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100 hover:border-yellow-200 transition-all">
                  <Clock className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                  <p className="font-semibold text-gray-800 text-lg">{hours.day}</p>
                  <p className="text-yellow-600 text-base mt-2 font-medium">{hours.hours}</p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-16 lg:px-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            label="Frequently Asked"
            title="Common Questions"
            subtitle="Find quick answers to the most frequently asked questions."
          />

          <div className="space-y-4 mt-8">
            {supportFaqs.map((faq: FAQ, index: number) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === index}
                onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-16 md:py-24 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 rounded-2xl mb-4">
              <MessageCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-2">
              Still Need Help?
            </h2>
            <p className="text-gray-600">
              Send us a message and we'll get back to you within 24 hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">
                Thank you for reaching out. Our support team will respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Delivery Problem">Delivery Problem</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Account Problem">Account Problem</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition resize-none"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Our support team typically responds within 24 hours
              </p>
            </form>
          )}
        </div>
      </section>

      {/* EMERGENCY CONTACT */}
      <section className="py-12 md:py-16 px-6 md:px-16 lg:px-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-red-100 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Urgent Issue?</h3>
            <p className="text-gray-600 mb-4">
              For urgent matters, please call our support hotline:
            </p>
            <Link
              href="tel:+2348012345678"
              className="inline-flex items-center gap-2 text-red-600 font-bold text-xl md:text-2xl hover:text-red-700 transition"
            >
              +234 801 234 5678
            </Link>
            <p className="text-xs text-gray-400 mt-4">Available 24/7 for emergencies</p>
          </div>
        </div>
      </section>
    </main>
  );
}