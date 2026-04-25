"use client";

import MotionWrapper from "@/components/MotionWrapper";
import Image from "next/image";

export default function FeaturesAdvisoryStyle() {
  const features = [
    {
      img: "/assets/featuresImg.png",
      title: "Menu for every taste",
      desc: "Experience meals crafted with precision, passion, and a touch of culinary artistry.",
    },
    {
      img: "/assets/featuresImg1.png",
      title: "Always fresh ingredients",
      desc: "We source only the freshest ingredients to ensure every dish delivers quality and flavor.",
    },
    {
      img: "/assets/featureImg2.png",
      title: "Experienced Chef",
      desc: "Explore a variety of international dishes prepared with authentic techniques.",
    },
  ];

  return (
    <section className="py-24 -mt-2.5 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <MotionWrapper
          variant="fade-up"
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-1 w-8 bg-yellow-500"></div>
            <h3 className="text-lg md:text-xl font-bold text-yellow-500">
              Features
            </h3>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6">
            Why Choose Our Restaurant
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            We combine quality ingredients, expert chefs, and diverse menus to
            deliver a dining experience that stands out every time.
          </p>
        </MotionWrapper>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((item, index) => (
            <MotionWrapper key={index} variant="fade-up" delay={index * 200}>
              <div className="group bg-white border border-gray-100 rounded-2xl p-8 hover:-translate-y-2 transition duration-300">
                <div className="flex justify-center mb-8">
                  <div className="w-28 relative h-28 md:w-32 md:h-32 flex items-center justify-center">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg md:text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
