"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import { SectionHeader } from "@/components/sections/Contact/SectionHeader";
import { ContactInfoCard } from "@/components/sections/Contact/ContactInfoCard";
import { FAQItem } from "@/components/sections/Contact/FAQItem";
import { contactInfo, faqs, socialLinks } from "@/lib/utils/contactUtils";
import homeImg3 from "@/../public/assets/homeImg3.jpg";
import homeImg2 from "@/../public/assets/homeImg2.jpg";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <main className="bg-white overflow-hidden">

      {/* HERO */}
      <section className="relative py-16 md:py-20 lg:py-24 px-6 md:px-16 lg:px-20 bg-white">
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center opacity-40">
          <div className="w-80 h-80 md:w-96 md:h-96 bg-yellow-400/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <MotionWrapper variant="fade-up" duration={700}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Get in Touch
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-6">
              Let&apos;s Talk <br />
              <span className="text-yellow-500">Over Good Food</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Whether you have a question, want to make a reservation, or just
              want to say hello — we&apos;d love to hear from you.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="py-12 md:py-16 px-6 md:px-16 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <ContactInfoCard
                key={index}
                icon={info.icon}
                title={info.title}
                details={info.details}
                delay={info.delay}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM + LOCATION CARD */}
      <section className="py-16 md:py-24 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Contact Form */}
            <MotionWrapper variant="fade-up" delay={0} duration={600}>
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600 text-base">
                    Fill out the form below and we&apos;ll get back to you within 24 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We&apos;ll respond as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition text-base"
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition text-base"
                          placeholder="hello@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition text-base"
                          placeholder="+234 801 234 5678"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition text-base bg-white"
                        >
                          <option value="">Select a subject</option>
                          <option value="Reservation">Reservation Inquiry</option>
                          <option value="Catering">Catering Request</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Complaint">Complaint</option>
                          <option value="General">General Inquiry</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition text-base resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </MotionWrapper>

            {/* Location Card — next/image instead of background-image string */}
            <MotionWrapper variant="fade-up" delay={200} duration={600}>
              <div className="relative rounded-3xl overflow-hidden h-full min-h-[480px]">
                <Image
                  src={homeImg3}
                  alt="Our restaurant location"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 to-gray-800/90" />
                <div className="relative z-10 p-8 flex flex-col items-center text-center h-full justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-5">
                    <Navigation className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-white mb-3">
                    Visit Our Location
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
                    123 Foodie Street, Lekki Phase 1
                    <br />
                    Lagos, Nigeria
                  </p>
                  <div className="w-12 h-0.5 bg-yellow-500/50 mx-auto my-4" />
                  <p className="text-gray-300 text-base">
                    <strong className="text-yellow-400">Call us:</strong> +234 801 234 5678
                    <br />
                    <strong className="text-yellow-400">Email:</strong> hello@tastyc.com
                  </p>
                  <Link
                    href="https://maps.google.com/?q=123+Foodie+Street+Lekki+Lagos+Nigeria"
                    target="_blank"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-xl transition"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </Link>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* SOCIAL + NEWSLETTER */}
      <section className="relative py-16 md:py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={homeImg2}
            alt="Newsletter background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(8,31,34,0.88)] to-[rgba(8,31,34,0.92)]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Social Media */}
            <MotionWrapper variant="fade-up" delay={0} duration={600}>
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="h-0.5 w-6 bg-yellow-500" />
                  <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                    Follow Us
                  </p>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                  Join Our <span className="text-yellow-500">Community</span>
                </h2>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                  Follow us on social media for daily updates, behind-the-scenes content, and special offers.
                </p>
                <div className="flex gap-4 justify-center lg:justify-start">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      className="w-12 h-12 rounded-full bg-white/10 hover:bg-yellow-500 flex items-center justify-center transition group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-white group-hover:text-gray-900 transition" />
                    </Link>
                  ))}
                </div>
              </div>
            </MotionWrapper>

            {/* Newsletter */}
            <MotionWrapper variant="fade-up" delay={200} duration={600}>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-500/20 rounded-2xl mb-4">
                    <Mail className="w-7 h-7 text-yellow-400" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Get 10% Off Your First Order
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base mb-6">
                    Subscribe to our newsletter and receive exclusive offers, new menu alerts, and more.
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition text-base"
                    />
                    <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl transition whitespace-nowrap">
                      Subscribe
                    </button>
                  </form>
                  <p className="text-gray-400 text-xs mt-4">No spam. Unsubscribe anytime.</p>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>
    </main>
  );
}