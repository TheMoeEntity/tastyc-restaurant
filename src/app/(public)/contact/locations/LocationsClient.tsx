// src/app/contact/locations/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, Navigation, Star, Users, Coffee, ChevronRight } from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import { SectionHeader } from "@/components/sections/Contact/SectionHeader";
import { locations, locationStats } from "@/lib/utils/contactUtils";
import { Location, StatItem } from "@/types/contact.types";

export default function LocationsPage() {
  const [selectedCity, setSelectedCity] = useState<string>("All");
  
  // Get unique cities for filter
  const cities = ["All", ...new Set(locations.map(loc => loc.city))];
  
  // Filter locations by city
  const filteredLocations = selectedCity === "All" 
    ? locations 
    : locations.filter(loc => loc.city === selectedCity);

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
                Find Us
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-gray-900 leading-tight mb-6">
              Our <span className="text-yellow-500">Locations</span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Visit us at any of our convenient locations across Nigeria. 
              We're always ready to serve you with warmth and great food.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 px-6 md:px-16 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {locationStats.map((stat: StatItem, index: number) => (
              <MotionWrapper key={index} variant="fade-up" delay={index * 100} duration={500}>
                <div className="text-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-7 h-7 text-yellow-600" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CITY FILTER */}
      <section className="py-8 px-6 md:px-16 lg:px-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCity === city
                    ? "bg-yellow-500 text-black shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS GRID */}
      <section className="py-16 md:py-24 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Visit Us"
            title="Our Restaurant Locations"
            subtitle={`${filteredLocations.length} location${filteredLocations.length !== 1 ? "s" : ""} found in ${selectedCity === "All" ? "all cities" : selectedCity}`}
          />
          
          {filteredLocations.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No locations found</h3>
              <p className="text-gray-400">Try selecting a different city</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {filteredLocations.map((location: Location, index: number) => (
                <MotionWrapper key={location.id} variant="fade-up" delay={index * 100} duration={500}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-200">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={location.image}
                        alt={location.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {location.isMain && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
                          Main Location
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold font-serif text-gray-900 mb-3">
                        {location.name}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm md:text-base">
                            {location.address}, {location.city}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <a href={`tel:${location.phone}`} className="text-gray-600 text-sm md:text-base hover:text-yellow-600 transition">
                            {location.phone}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <p className="text-gray-600 text-sm md:text-base">
                            {location.hours}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`https://maps.google.com/?q=${location.address}, ${location.city}`}
                          target="_blank"
                          className="inline-flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-xl transition text-sm"
                        >
                          <Navigation className="w-4 h-4" />
                          Get Directions
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center gap-2 flex-1 px-4 py-2.5 border border-gray-200 hover:border-yellow-400 text-gray-600 hover:text-yellow-600 font-semibold rounded-xl transition text-sm"
                        >
                          Contact This Location
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-16 md:py-24 px-6 md:px-16 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Find Your Way"
            title="Location Map"
            subtitle="Use the map below to find the nearest Tastyc restaurant to you"
          />
          
          <div className="mt-8 bg-gray-200 rounded-2xl overflow-hidden h-[400px] md:h-[500px] relative">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="text-gray-500">Interactive Map Loading...</p>
                <p className="text-sm text-gray-400 mt-2">
                  For directions, please use the "Get Directions" button on any location
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 px-6 md:px-16 lg:px-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.88)), url(/assets/homeImg3.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <MotionWrapper variant="fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white mb-4">
              Can't Visit Us Today?
            </h2>
            <p className="text-gray-300 text-base md:text-lg mb-6">
              No worries! We offer delivery and takeout at all our locations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
              >
                Browse Menu <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition"
              >
                Order Online
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>
    </main>
  );
}