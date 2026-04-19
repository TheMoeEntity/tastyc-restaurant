"use client";

import React from "react";

function AboutSection() {
  return (
    <section className="w-full px-6 md:px-16 lg:px-20">
      {/* OVERLAP CONTAINER */}
      <div
        className="
        relative 
        mt-1 md:-mt-2 lg:-mt-4
        bg-white 
        rounded-t-2xl 
  
        p-6 md:p-10 lg:p-14
      "
      >
        {/*  SCROLL INDICATOR */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-end justify-center">
          {/* SEMI-CIRCLE (BLENDED) */}
          <div
            className="
            w-24 h-12 md:w-28 md:h-14 lg:w-36 lg:h-18
            bg-white 
            rounded-t-full 
            flex items-center justify-center
          "
          >
            {/* INNER CIRCLE */}
            <div className="w-8 h-12 md:w-9 md:h-9 lg:w-10 lg:h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-1">
              {/* FAST BOUNCING DOT */}
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-[bounce_0.6s_infinite]"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* IMAGE */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <img
              src="/assets/aboutImg.webp"
              alt="aboutImg"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* TEXT CONTENT */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 order-1 lg:order-2">
            {/* TOP TITLE */}
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-yellow-500"></div>
              <h1 className="text-lg md:text-xl font-bold text-yellow-500">
                About Us
              </h1>
            </div>

            {/* MAIN HEADING */}
            <h1 className="text-3xl text-[#1A2F33] sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight">
              We invite you to <br />
              visit our restaurant
            </h1>

            {/* PARAGRAPH */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Assumenda possimus eaque illo iste, autem. Porro eveniet, autem
              ipsam vitae amet repellat repudiandae tenetur, quod corrupti
              consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore
              aspernatur quae repudiandae dolorem, beatae dolorum, praesentium
              itaque et quam quaerat. Cumque, consequatur!
            </p>

            {/* BUTTON */}
            <div className="mt-4">
              <button className="bg-yellow-500 px-6 py-3 text-black font-semibold rounded-md hover:bg-yellow-600 transition">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
