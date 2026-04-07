"use client"

import Header from "@/components/layout/Header"
import { useState } from "react"

export default function ReservationPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [guests, setGuests] = useState("2")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: hook up to real backend later
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* reuse the same header */}
      <Header />

      {/* page hero banner */}
      <div className="w-full bg-black py-16 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-10 h-0.5 bg-orange-500 inline-block"></span>
          <p className="text-orange-500 uppercase tracking-widest text-sm font-mono">Book a Seat</p>
          <span className="w-10 h-0.5 bg-orange-500 inline-block"></span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-white leading-tight">
          Make a
        </h1>
        <h2 className="text-5xl md:text-7xl font-serif font-extrabold text-yellow-500 leading-tight">
          Reservation
        </h2>
      </div>

      {/* form section */}
      <div className="max-w-3xl mx-auto px-5 py-14">

        {submitted ? (
          // success message
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-serif font-bold text-gray-800 mb-2">You're booked!</h3>
            <p className="text-gray-500 font-mono">We'll send a confirmation to <span className="text-orange-500">{email}</span> shortly.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-8 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition font-mono"
            >
              Make another reservation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-1">Reserve your table</h3>
            <p className="text-gray-400 font-mono text-sm mb-8">Fill in the details below and we'll confirm your booking.</p>

            {/* name + email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 font-mono mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 font-mono mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@email.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
            </div>

            {/* phone + guests row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 font-mono mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 font-mono mb-1.5">
                  Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-yellow-500 transition bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                  ))}
                  <option value="9+">9+ Guests (large group)</option>
                </select>
              </div>
            </div>

            {/* date + time row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 font-mono mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 font-mono mb-1.5">
                  Preferred Time
                </label>
                <select
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-yellow-500 transition bg-white"
                >
                  <option value="">Select a time</option>
                  <option>12:00 PM</option>
                  <option>12:30 PM</option>
                  <option>1:00 PM</option>
                  <option>1:30 PM</option>
                  <option>2:00 PM</option>
                  <option>6:00 PM</option>
                  <option>6:30 PM</option>
                  <option>7:00 PM</option>
                  <option>7:30 PM</option>
                  <option>8:00 PM</option>
                  <option>8:30 PM</option>
                  <option>9:00 PM</option>
                </select>
              </div>
            </div>

            {/* special requests */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 font-mono mb-1.5">
                Special Requests <span className="normal-case text-gray-300">(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Allergies, seating preferences, celebrations..."
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-yellow-500 transition resize-none"
              />
            </div>

            {/* submit button - orange to match the reservation button in nav */}
            <button
              type="submit"
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold font-mono text-base rounded-lg transition"
            >
              Confirm Reservation
            </button>

            <p className="text-center text-xs text-gray-400 font-mono mt-4">
              We'll send a confirmation email within 24 hours.
            </p>

          </form>
        )}
      </div>
    </div>
  )
}