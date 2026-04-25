"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Navigation,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";

function SectionHeader({
  label,
  title,
  subtitle,
  light = false,
}: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <MotionWrapper variant="fade-up" duration={600}>
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-0.5 w-6 bg-yellow-500" />
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
            {label}
          </p>
          <div className="h-0.5 w-6 bg-yellow-500" />
        </div>
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-4 ${light ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`text-base md:text-lg leading-relaxed ${light ? "text-gray-300" : "text-gray-600"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </MotionWrapper>
  );
}

function ContactInfoCard({
  icon: Icon,
  title,
  details,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  details: string[];
  delay?: number;
}) {
  return (
    <MotionWrapper variant="fade-up" delay={delay} duration={500}>
      <div className="group bg-white rounded-3xl p-6 md:p-8 border border-gray-100 h-full shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5 group-hover:bg-yellow-500/20 transition">
          <Icon className="w-7 h-7 text-yellow-500" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold font-serif text-gray-900 mb-4">
          {title}
        </h3>
        <div className="space-y-2">
          {details.map((detail, i) => (
            <p
              key={i}
              className="text-gray-600 text-base md:text-lg leading-relaxed"
            >
              {detail}
            </p>
          ))}
        </div>
      </div>
    </MotionWrapper>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-yellow-400/60 shadow-yellow-100/60 shadow-md"
          : "border-gray-100 hover:shadow-md hover:border-gray-200"
      }`}
    >
      {/* Header / trigger */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <h3 className="text-lg md:text-xl font-bold font-serif text-gray-900">
          {question}
        </h3>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-yellow-500 rotate-180"
              : "bg-yellow-500/10 group-hover:bg-yellow-500/20"
          }`}
        >
          <svg
            className={`w-4 h-4 transition-colors duration-300 ${
              isOpen ? "text-white" : "text-yellow-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Animated body */}
      <div
        style={{
          maxHeight: isOpen ? 500 : 0,
          opacity: isOpen ? 1 : 0,
          transition:
            "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
          overflow: "hidden",
        }}
      >
        <div className="px-6 pb-5 pt-1 border-t border-gray-100">
          <p className="text-gray-600 text-base md:text-lg leading-relaxed pt-3">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Foodie Street, Lekki Phase 1", "Lagos, Nigeria"],
      delay: 0,
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+234 801 234 5678", "+234 802 345 6789"],
      delay: 100,
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["hello@tastyc.com", "reservations@tastyc.com"],
      delay: 200,
    },
    {
      icon: Clock,
      title: "Opening Hours",
      details: ["Mon-Fri: 10am - 10pm", "Sat: 9am - 11pm", "Sun: 11am - 9pm"],
      delay: 300,
    },
  ];

  const faqs = [
    {
      question: "Do I need a reservation?",
      answer:
        "While walk-ins are always welcome, we highly recommend making a reservation — especially on weekends and public holidays. You can book a table through our reservation page or by calling us directly.",
    },
    {
      question: "Do you offer catering services?",
      answer:
        "Yes! Tastyc provides catering for private events, corporate gatherings, and parties. Contact our events team at events@tastyc.com for a custom quote.",
    },
    {
      question: "Is there parking available?",
      answer:
        "Yes, we have a dedicated parking lot for our guests with 24/7 security. Valet parking is also available on weekends.",
    },
    {
      question: "Do you accommodate dietary restrictions?",
      answer:
        "Absolutely. We offer vegetarian, vegan, and gluten-free options. Please inform your server or mention it when booking your reservation.",
    },
    {
      question: "Can I host a private event at Tastyc?",
      answer:
        "We have a private dining room that seats up to 30 guests, and the entire restaurant can be booked for larger events. Contact us for more details.",
    },
    {
      question: "Do you offer takeout and delivery?",
      answer:
        "Yes! You can order takeout directly from our website or through our delivery partners. We also offer contactless pickup.",
    },
  ];

  const socialLinks = [
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
    { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  ];

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
                Get in Touch
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-6">
              Let&#39;s Talk <br />
              <span className="text-yellow-500">Over Good Food</span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Whether you have a question, want to make a reservation, or just
              want to say hello — we&#39;d love to hear from you.
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
                    Fill out the form below and we&#39;ll get back to you within
                    24 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We*&#39;ll respond to your
                      message as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
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
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
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
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
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
                        <label
                          htmlFor="subject"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
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
                          <option value="Reservation">
                            Reservation Inquiry
                          </option>
                          <option value="Catering">Catering Request</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Complaint">Complaint</option>
                          <option value="General">General Inquiry</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
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

            {/* Location Card with Image Background */}
            <MotionWrapper variant="fade-up" delay={200} duration={600}>
              <div className="relative rounded-3xl overflow-hidden h-full">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/assets/homeImg3.jpg')",
                  }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 to-gray-800/90" />

                {/* Content */}
                <div className="relative z-10 p-8 flex flex-col items-center text-center h-full">
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
                    <strong className="text-yellow-400">Call us:</strong> +234
                    801 234 5678
                    <br />
                    <strong className="text-yellow-400">Email:</strong>{" "}
                    hello@tastyc.com
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

      {/* FAQ SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-16 lg:px-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            label="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know before visiting Tastyc."
          />

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <MotionWrapper
                key={index}
                variant="fade-up"
                delay={index * 80}
                duration={500}
              >
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaqIndex === index}
                  onToggle={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                />
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL + NEWSLETTER SECTION */}
      <section className="relative py-16 md:py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(8,31,34,0.88), rgba(8,31,34,0.92)), url(/assets/homeImg2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
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
                  Follow us on social media for daily updates, behind-the-scenes
                  content, and special offers.
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
                    Subscribe to our newsletter and receive exclusive offers,
                    new menu alerts, and more.
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
                  <p className="text-gray-400 text-xs mt-4">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>
    </main>
  );
}
