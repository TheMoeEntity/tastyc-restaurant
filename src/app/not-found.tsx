"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] border border-(--db-primary)/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] border border-(--db-secondary)/10 rounded-full" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6 sm:mb-8"
        >
          {/* Subtle Glow Behind the 404 */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-(--db-primary)/20 blur-[80px] h-32 w-1/2 mx-auto rounded-full opacity-60" />

          <h1 className="relative text-[7rem] sm:text-[10rem] md:text-[12rem] font-bold leading-none text-transparent bg-clip-text bg-linear-to-b from-[var(--db-secondary)] to-[var(--db-primary)] tracking-tighter mix-blend-multiply">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Property Off the Market
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
            Oops! It seems we {`can't`} find the page {`you're`} looking for. It
            might have been removed, had its name changed, or is temporarily
            unavailable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <button
              onClick={() => router.back()}
              className="group flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold px-6 py-3.5 w-full sm:w-auto transition-all duration-300 hover:bg-gray-50 hover:text-black hover:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Go Back
            </button>

            <Link
              href="/"
              className="group flex items-center justify-center gap-2 rounded-xl bg-(--db-secondary) text-white font-semibold px-6 py-3.5 w-full sm:w-auto transition-all duration-300 hover:bg-(--db-primary) hover:shadow-lg focus:ring-4 focus:ring-(--db-primary)/30 outline-none hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
