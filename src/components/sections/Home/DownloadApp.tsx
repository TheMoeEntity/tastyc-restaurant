"use client";

import React from "react";
import { Smartphone, ChevronRight, Star, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";

const DownloadAppSection = () => {
  return (
    <section className="relative py-20 px-6 md:px-16 lg:px-20 overflow-hidden -mt-16">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image src="/assets/homeImg3.jpg" alt="background" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E2225]/70 to-[#1E2225]/90"></div>
      </div>

      {/* BURGER IMAGE */}
      <div className="absolute -bottom-16 sm:-bottom-20 md:bottom-0 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 md:right-10 z-10 pointer-events-none">
        <Image src="/assets/burger.png" alt="burger" width={260} height={260} className="object-contain w-40 md:w-64 lg:w-72" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 max-w-5xl mx-auto text-center space-y-8">

        {/* BADGE */}
        <MotionWrapper variant="fade-down" delay={0}>
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-5 py-2 rounded-full">
            <Smartphone className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 text-sm font-semibold uppercase tracking-wider">Mobile App</span>
          </div>
        </MotionWrapper>

        {/* TITLE */}
        <MotionWrapper variant="fade-up" delay={100}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight">
            Get Our App &
            <span className="text-yellow-500 block mt-2">Order Faster</span>
          </h2>
        </MotionWrapper>

        {/* TEXT */}
        <MotionWrapper variant="fade-up" delay={200}>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Download the Tastyc app and enjoy exclusive deals, faster checkout,
            and real-time order tracking. Get{" "}
            <span className="text-yellow-500 font-bold">$5 off</span> your first order.
          </p>
        </MotionWrapper>

        {/* BUTTONS */}
        <MotionWrapper variant="fade-up" delay={300}>
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
            <Link href="https://play.google.com/store" target="_blank" className="group bg-white rounded-xl p-3 px-6 hover:scale-105 transition w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <Image src="/assets/playstoreIcon.webp" alt="play store" width={45} height={45} />
                <div className="text-left">
                  <p className="text-xs text-gray-500">GET IT ON</p>
                  <p className="text-xl font-bold text-gray-900">Google Play</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-500" />
              </div>
            </Link>
            <Link href="https://www.apple.com/app-store/" target="_blank" className="group bg-black border border-gray-700 rounded-xl p-3 px-6 hover:scale-105 transition w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <Image src="/assets/appleIcon.png" alt="app store" width={45} height={45} />
                <div className="text-left">
                  <p className="text-xs text-gray-400">DOWNLOAD ON</p>
                  <p className="text-xl font-bold text-white">App Store</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-500" />
              </div>
            </Link>
          </div>
        </MotionWrapper>

        {/* STATS */}
        <MotionWrapper variant="fade-up" delay={400}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
              <span className="text-gray-300 ml-2">4.8 (50k+ reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-yellow-500" />
              <span className="text-white">100k+ Downloads</span>
            </div>
          </div>
        </MotionWrapper>

      </div>
    </section>
  );
};

export default DownloadAppSection;