"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Phone,
  Loader2,
} from "lucide-react";
import { fadeUp, stagger } from "@/lib/data/aboutData";
import apiFetch from "@/lib/api";

// ── Slot type from API ────────────────────────────────────────
interface SlotData {
  time: string;
  available: boolean;
  blocked: boolean;
  seatsRemaining: number;
  bookedGuests: number;
}

// ── Visual slot picker ────────────────────────────────────────
function SlotPicker({
  slots,
  selected,
  onSelect,
  loading,
}: {
  slots: SlotData[];
  selected: string;
  onSelect: (time: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
        <span className="ml-2 text-gray-500 text-sm">
          Checking availability...
        </span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-4 text-center">
        Select a date to see available times
      </p>
    );
  }

  const allUnavailable = slots.every((s) => !s.available);

  if (allUnavailable) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">
        <p className="text-red-600 text-sm font-semibold">
          No availability on this date
        </p>
        <p className="text-red-400 text-xs mt-1">
          Please select a different date
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected = selected === slot.time;
        const unavailable = !slot.available;

        return (
          <button
            key={slot.time}
            type="button"
            disabled={unavailable}
            onClick={() => onSelect(slot.time)}
            title={
              slot.blocked
                ? "This slot is unavailable"
                : unavailable
                  ? `Only ${slot.seatsRemaining} seats remaining`
                  : `${slot.seatsRemaining} seats available`
            }
            className={`
              relative py-2.5 px-2 rounded-xl border text-sm font-semibold transition-all
              ${
                isSelected
                  ? "bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-200"
                  : unavailable
                    ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                    : "bg-white border-gray-200 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50"
              }
            `}
          >
            {slot.time}
            {!unavailable && !isSelected && slot.seatsRemaining <= 10 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-400 text-white text-[9px] font-bold px-1 rounded-full">
                {slot.seatsRemaining}
              </span>
            )}
            {slot.blocked && (
              <span className="block text-[9px] font-normal text-gray-400 mt-0.5">
                Unavailable
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function ReservationBooking() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
    requests: "",
  });

  // Availability state
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Fetch availability when date or guests change
  useEffect(() => {
    if (!formData.date) {
      setSlots([]);
      return;
    }

    // Reset selected time when date changes
    setFormData((prev) => ({ ...prev, time: "" }));
    setSlotsLoading(true);

    apiFetch<any>(
      `/api/availability?date=${formData.date}&partySize=${formData.guests}`,
    )
      .then((r) => {
        if (r.success) setSlots(r.data.slots);
      })
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [formData.date, formData.guests]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSubmitting(true);

    try {
      const res = await apiFetch<any>("/api/reservations", {
        method: "POST",
        data: {
          date: formData.date,
          time: formData.time,
          partySize: parseInt(formData.guests),
          notes: formData.requests.trim() || undefined,
        },
      });

      if (!res.success) throw new Error(res.message ?? "Booking failed");
      setSubmitted(true);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const quickInfo = [
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
  ];

  const benefits = [
    "✓ Best table guaranteed for your party",
    "✓ Special occasion arrangements available",
    "✓ Priority seating for large groups",
    "✓ Flexible cancellation policy",
  ];

  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 bg-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-400/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Quick Info Banner */}
        <div className="mb-12">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            {quickInfo.map((item, idx) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — info panel unchanged */}
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
                {benefits.map((item, idx) => (
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
                Call us directly for immediate assistance
              </p>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span className="font-bold text-lg">+1 (555) 123-4567</span>
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
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
                    Thank you for choosing Tastyc! Check your email for the
                    calendar invite.
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
                      setSlots([]);
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
                    Fill in your details and we'll reserve your perfect spot
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
                          placeholder="hello@example.com"
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
                          placeholder="+234 801 234 5678"
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

                    {/* Visual slot picker — replaces time select */}
                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-2">
                        Preferred Time *
                        {formData.date && !slotsLoading && slots.length > 0 && (
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            {slots.filter((s) => s.available).length} slots
                            available
                          </span>
                        )}
                      </label>
                      <SlotPicker
                        slots={slots}
                        selected={formData.time}
                        onSelect={(time) =>
                          setFormData((p) => ({ ...p, time }))
                        }
                        loading={slotsLoading}
                      />
                      {/* Hidden input for form validation */}
                      <input
                        type="hidden"
                        name="time"
                        value={formData.time}
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

                    {apiError && (
                      <p className="text-red-500 text-sm flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        {apiError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || !formData.time}
                      className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {submitting ? "Booking..." : "Confirm Reservation"}
                    </button>

                    <p className="text-sm text-gray-400 text-center">
                      By confirming, you agree to our reservation policy. You'll
                      receive a calendar invite by email.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
