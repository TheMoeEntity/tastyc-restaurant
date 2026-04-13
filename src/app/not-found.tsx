"use client";

import Link from "next/link";
import { motion, cubicBezier } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: cubicBezier(0.25, 0.8, 0.25, 1),
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 relative overflow-hidden">
      
      {/* soft background glow */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="text-center relative z-10 max-w-xl w-full">
        
        {/* 404 number */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-[7rem] sm:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 leading-none"
        >
          404
        </motion.h1>

        {/* title */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4"
        >
          Page Not Found
        </motion.h2>

        {/* description */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-gray-600 mt-4 mb-8"
        >
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </motion.p>

        {/* buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          
          {/* back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          {/* home button */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
          >
            <Home size={18} />
            Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}