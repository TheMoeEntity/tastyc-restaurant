"use client";

import Link from "next/link";
import Image from "next/image";
import { MoveLeft, MoveRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { useRestaurantConfig } from "@/hooks/useRestaurantConfig";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const { config } = useRestaurantConfig();
  return (
    <footer className="w-full text-white pt-24 pb-12 px-4 md:px-8 max-w-screen-xl mx-auto">
      {/* Top Section: Logo & Socials */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <Link
          href="/"
          className="flex flex-col leading-tight font-mono mb-6 md:mb-0"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white">{config.name}</h1>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="w-4 md:w-6 h-0.5 bg-[#f2a830]"></span>
              <span className="w-4 md:w-6 h-0.5 bg-[#f2a830]"></span>
            </div>
            <p className="text-[8px] md:text-xs text-gray-400 uppercase tracking-widest font-mono">
              Food & Drinks
            </p>
            <div className="flex flex-col gap-0.5">
              <span className="w-4 md:w-6 h-0.5 bg-[#f2a830]"></span>
              <span className="w-4 md:w-6 h-0.5 bg-[#f2a830]"></span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-white hover:text-[#f2a830] transition-colors"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f2a830] transition-colors"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f2a830] transition-colors"
          >
            <FaXTwitter size={18} />
          </a>
          <a
            href="#"
            className="text-white hover:text-[#f2a830] transition-colors"
          >
            <FaYoutube size={18} />
          </a>
        </div>
      </div>

      <div className="w-full border-t border-dotted border-gray-600/50 mb-12"></div>

      {/* Middle Section: Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
        {/* About Us */}
        <div>
          <h3 className="text-2xl font-bold mb-8 font-serif">About us</h3>
          <p className="text-gray-400 leading-loose mb-8 text-sm">
            {config.tagline}
          </p>
          <Link
            href="/about"
            className="text-[#f2a830] font-bold uppercase tracking-widest text-xs hover:text-yellow-400 transition-colors"
          >
            Read More
          </Link>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-bold mb-8 font-serif">Contact info</h3>
          <ul className="space-y-4 mb-8 text-gray-400 font-mono text-sm leading-loose">
            <li className="flex md:flex-row flex-col md:justify-between border-b border-gray-800/50 pb-4">
              <span className="font-bold tracking-widest text-white uppercase text-xs mb-1 md:mb-0">
                Call :
              </span>
              <span>{config.phone}</span>
            </li>
            <li className="flex md:flex-row flex-col md:justify-between border-b border-gray-800/50 pb-4">
              <span className="font-bold tracking-widest text-white uppercase text-xs mb-1 md:mb-0">
                Write :
              </span>
              <span>{config.email}</span>
            </li>
            <li className="flex md:flex-row flex-col md:justify-between pb-2">
              <span className="font-bold tracking-widest text-white uppercase text-xs mb-1 md:mb-0">
                Find us :
              </span>
              <span className="md:text-right">
                {config.address}
              </span>
            </li>
          </ul>
          <Link
            href="/contact"
            className="text-[#f2a830] font-bold uppercase tracking-widest text-xs hover:text-yellow-400 transition-colors"
          >
            Read More
          </Link>
        </div>

        {/* Gallery */}
        <div>
          <h3 className="text-2xl font-bold mb-8 font-serif">Gallery</h3>
          <div className="grid grid-cols-4 gap-3 mb-8">
            <div className="aspect-square relative rounded-md overflow-hidden">
              <Image
                src="/assets/homeImg1.jpg"
                alt="Gallery 1"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square relative rounded-md overflow-hidden">
              <Image
                src="/assets/homeImg2.jpg"
                alt="Gallery 2"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square relative rounded-md overflow-hidden">
              <Image
                src="/assets/homeImg3.jpg"
                alt="Gallery 3"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square relative rounded-md overflow-hidden">
              <Image
                src="/assets/aboutImg.webp"
                alt="Gallery 4"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* <Link
              href="/gallery"
              className="text-[#f2a830] font-bold uppercase tracking-widest text-xs hover:text-yellow-400 transition-colors"
            >
              See More
            </Link> */}
            <div className="flex gap-4">
              <button className="text-white hover:text-[#f2a830] transition-colors">
                <MoveLeft size={16} />
              </button>
              <button className="text-white hover:text-[#f2a830] transition-colors">
                <MoveRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-dotted border-gray-600/50 mb-8"></div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 tracking-wider">
        <p>
          © Tastyc {new Date().getFullYear()}. All rights reserved. Design by{" "}
          <span className="text-[#96825c]">bslthemes Team</span>
        </p>
        <button
          onClick={() => scrollToTop()}
          className="mt-4 md:mt-0 text-[#f2a830] font-bold tracking-widest uppercase hover:text-yellow-400 transition-colors"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
