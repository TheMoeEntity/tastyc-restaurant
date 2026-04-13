"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, ChevronRight, Star, Download, Wifi, Zap, Shield, Coffee, Gift, Clock, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DownloadAppSection = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } }
  };

  const features = [
    { icon: Zap, text: "Fast & Easy Ordering" },
    { icon: Shield, text: "Secure Payments" },
    { icon: Clock, text: "Real-time Tracking" },
    { icon: Gift, text: "Exclusive Offers" },
    { icon: Truck, text: "Express Delivery" },
    { icon: Coffee, text: "Loyalty Rewards" }
  ];

  return (
    <section className="relative py-20 px-6 md:px-16 lg:px-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-5 py-2 rounded-full">
              <Smartphone className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 text-sm font-semibold uppercase tracking-wider">
                Mobile App
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight"
          >
            Get Our App & 
            <span className="text-yellow-500 block mt-2"> Order Faster</span>
          </motion.h2>

          {/* Description */}
          <motion.p 
            variants={fadeUp}
            className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
          >
            Download the Tastyc app and enjoy exclusive deals, faster checkout, 
            and real-time order tracking. Get <span className="text-yellow-500 font-bold">$5 off</span> your first order when you 
            order through the app!
          </motion.p>

          {/* Features Grid */}
          <motion.div 
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-3 gap-5 py-6 max-w-3xl mx-auto"
          >
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2">
                <feature.icon className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-200 text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Download Buttons */}
          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-5 justify-center pt-4"
          >
            {/* Play Store Button */}
            <Link 
              href="https://play.google.com/store" 
              target="_blank"
              className="group relative bg-white rounded-xl p-3 px-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
            >
              <div className="flex items-center gap-3">
                <Image 
                  src="/assets/playstoreIcon.webp" 
                  alt="Google Play Store" 
                  width={45} 
                  height={45}
                  className="object-contain"
                />
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">GET IT ON</p>
                  <p className="text-xl font-bold text-gray-900">Google Play</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all ml-2" />
              </div>
            </Link>

            {/* App Store Button */}
            <Link 
              href="https://www.apple.com/app-store/" 
              target="_blank"
              className="group relative bg-black rounded-xl p-3 px-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700 w-full sm:w-auto"
            >
              <div className="flex items-center gap-3">
                <Image 
                  src="/assets/appleIcon.png" 
                  alt="Apple App Store" 
                  width={45} 
                  height={45}
                  className="object-contain"
                />
                <div className="text-left">
                  <p className="text-xs text-gray-400 font-medium">DOWNLOAD ON THE</p>
                  <p className="text-xl font-bold text-white">App Store</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all ml-2" />
              </div>
            </Link>
          </motion.div>

          {/* Rating & Download Stats */}
          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <span className="text-gray-300 font-medium">4.8 (50k+ reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-300 font-medium">100k+ Downloads</span>
            </div>
          </motion.div>

          {/* Small Print */}
          <motion.p 
            variants={fadeUp}
            className="text-gray-500 text-xs pt-4"
          >
            Available for iOS and Android devices. Minimum requirements apply.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadAppSection;