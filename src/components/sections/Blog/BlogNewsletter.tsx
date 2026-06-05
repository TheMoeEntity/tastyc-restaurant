"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import MotionWrapper from "@/components/ui/MotionWrapper";

export function BlogNewsletter() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <section className="relative py-16 px-6 md:px-16 lg:px-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,31,34,0.88), rgba(8,31,34,0.92)), url(/assets/homeImg3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <MotionWrapper variant="fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-3">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-6">
            Get the latest recipes, chef tips, and exclusive offers delivered to your inbox.
          </p>

          {isSubmitted ? (
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white">Thanks for subscribing! Check your email for confirmation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition whitespace-nowrap disabled:opacity-50"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          <p className="text-gray-400 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </MotionWrapper>
      </div>
    </section>
  );
}