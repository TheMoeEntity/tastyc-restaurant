import React from 'react'
import Link from 'next/link'

function Features() {
  const cards = [
    {
      title: "Menu for every taste",
      description: "Dolor sit amet, consectetur adipisicing elit et molestias possimus",
      image: "/assets/FeaturesImg.png",
      number: "01",
    },
    {
      title: "Always fresh Ingredients",
      description: "Dolor sit amet, consectetur adipisicing elit et molestias possimus",
      image: "/assets/FeatureImg2.png",
      number: "02",
    },
    {
      title: "Experienced Chefs",
      description: "Dolor sit amet, consectetur adipisicing elit et molestias possimus",
      image: "/assets/FeaturesImg1.png",
      number: "03",
    },
  ]

  return (
    <section className="py-24 px-10 bg-white">

      {/* header - centered */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="bg-yellow-500 h-0.5 w-6 mb-3"></div>
        <p className="font-bold text-xl text-yellow-500 uppercase tracking-widest mb-1">Features</p>
        <h1 className="text-5xl font-black text-gray-900 leading-tight">Why Choose Us</h1>
        <p className="text-gray-400 mt-4 text-base max-w-md">Porro eveniet, autem ipsam vitae consequatur!</p>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group relative flex flex-col bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            {/* 3D number badge */}
            <span
              className="absolute top-4 left-4 z-10 text-xs font-black text-yellow-700 bg-yellow-400 w-9 h-9 rounded-full flex items-center justify-center select-none"
              style={{
                boxShadow: '0 4px 0px #a16207, 0 6px 8px rgba(0,0,0,0.25)',
                textShadow: '0 1px 0 #fef08a',
              }}
            >
              {card.number}
            </span>

            {/* image area - no background color */}
            <div className="flex justify-center items-center py-10 px-12">
              <img
                src={card.image}
                alt={card.title}
                className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* content */}
            <div className="flex flex-col flex-1 px-8 py-8">
              <div className="w-8 h-0.5 bg-yellow-500 mb-4"></div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 leading-snug">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{card.description}</p>

              <Link
                href="/about"
                className="mt-8 flex items-center gap-2 text-yellow-500 font-bold text-sm group-hover:gap-4 transition-all duration-300 w-fit"
              >
                <span>Learn more</span>
                <span>→</span>
              </Link>
            </div>

            {/* bottom accent bar */}
            <div className="h-1 w-0 bg-yellow-500 group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default Features