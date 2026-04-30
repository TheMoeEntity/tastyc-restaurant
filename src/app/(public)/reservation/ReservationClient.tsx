"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Users,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  MapPin,
  Coffee,
  Utensils,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { fadeUp, stagger } from "@/lib/data/aboutData";

// const fadeUp = {
//   hidden: { opacity: 0, y: 40 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// const stagger = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.1 } },
// };

export default function ReservationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
    requests: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save reservation to localStorage
    const reservations = JSON.parse(
      localStorage.getItem("reservations") || "[]",
    );
    reservations.push({
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("reservations", JSON.stringify(reservations));
    setSubmitted(true);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="bg-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative py-32 px-6 md:px-16 lg:px-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url(/assets/homeImg1.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 text-sm font-bold uppercase tracking-wider">
                Limited Spots Available
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif text-white mb-6 leading-tight">
              Reserve Your{" "}
              <span className="text-yellow-500 relative inline-block">
                Experience
                <div className="absolute bottom-2 left-0 right-0 h-3 bg-yellow-500/30 -z-10" />
              </span>
            </h1>

            <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto">
              Every great meal begins with a seat at the table. Let us prepare
              something unforgettable for you and your guests.
            </p>
          </motion.div>
        </div>
      </section>

      {/* QUICK INFO BANNER */}
      <section className="relative -mt-10 px-6 md:px-16 lg:px-20 z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            {[
              {
                icon: Clock,
                label: "Opening Hours",
                value: "10 AM - 10 PM",
                color: "text-yellow-500",
              },
              {
                icon: MapPin,
                label: "Location",
                value: "123 Food Street, NY",
                color: "text-orange-500",
              },
              {
                icon: Users,
                label: "Private Events",
                value: "Available",
                color: "text-red-500",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="flex items-center gap-4 p-3"
              >
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-gray-900 font-bold text-base">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FORM + INFO SECTION */}
      <section className="relative py-24 px-6 md:px-16 lg:px-20 bg-white overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-400/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                  Why Book With Us?
                </h3>
                <div className="space-y-4">
                  {[
                    "✓ Best table guaranteed for your party",
                    "✓ Special occasion arrangements available",
                    "✓ Priority seating for large groups",
                    "✓ Flexible cancellation policy",
                  ].map((item, idx) => (
                    <p
                      key={idx}
                      className="text-gray-600 flex items-start gap-2 text-base"
                    >
                      <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Opening Hours
                </h4>
                <div className="space-y-2 text-gray-600 text-base">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">9:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">11:00 AM - 9:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500 rounded-2xl p-6 text-white">
                <h4 className="font-bold text-lg mb-2">Need Help?</h4>
                <p className="text-white/90 text-base mb-4">
                  Call us directly for immediate assistance with your
                  reservation
                </p>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="font-bold text-lg">+1 (555) 123-4567</span>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center"
                  >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                      Reservation Confirmed! 🎉
                    </h3>
                    <p className="text-gray-600 text-base mb-4">
                      Thank you for choosing Tastyc! We&#39;ve sent a
                      confirmation to your email.
                    </p>
                    <div className="bg-white rounded-lg p-4 mb-6 text-left">
                      <p className="text-sm text-gray-500">
                        Reservation Details:
                      </p>
                      <p className="text-gray-900 font-semibold text-base">
                        {formData.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formData.date} at {formData.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formData.guests} guests
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          guests: "2",
                          date: "",
                          time: "",
                          requests: "",
                        });
                      }}
                      className="text-yellow-600 hover:text-yellow-700 font-semibold text-base"
                    >
                      Make Another Reservation →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8"
                  >
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                      Book Your Table
                    </h3>
                    <p className="text-gray-500 text-base mb-6">
                      Fill in your details and we&#39;ll reserve your perfect
                      spot
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-base"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nwigberichukwudiangella@example.com"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-base"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-base"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-semibold text-gray-700 mb-2">
                            Number of Guests *
                          </label>
                          <select
                            name="guests"
                            value={formData.guests}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-base"
                            required
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? "Guest" : "Guests"}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-base font-semibold text-gray-700 mb-2">
                            Date *
                          </label>
                          <input
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={today}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-base"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                          Preferred Time *
                        </label>
                        <input
                          name="time"
                          type="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          name="requests"
                          value={formData.requests}
                          onChange={handleChange}
                          placeholder="Dietary restrictions, special occasion, seating preferences..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition resize-none text-base"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-yellow-500 hover:to-yellow-800 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-base"
                      >
                        Confirm Reservation
                      </button>

                      <p className="text-sm text-gray-400 text-center">
                        By confirming, you agree to our reservation policy.
                        You&#39;ll receive a confirmation email shortly.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Private Events */}
      <section className="relative py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.88)), url(/assets/homeImg3.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Utensils className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 text-sm font-bold uppercase tracking-wider">
                Private Events
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
              Host Your Special Event With Us
            </h3>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Whether it&#39;s a birthday, anniversary, or corporate gathering,
              our team will create an unforgettable experience for you and your
              guests.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg hover:shadow-xl text-base"
              >
                Contact Our Events Team
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition text-base"
              >
                View Catering Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .input {
          @apply w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition;
        }
      `}</style>
    </main>
  );
}
