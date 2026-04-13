"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";


const newsletters = [
  {
    image: "/assets/homeImg1.jpg",
    category: "Breakfast",
    title: "Busy Breakfast: 5 Morning Meals Under 15 Minutes",
    date: "Jan 12, 2025",
    preview:
      "Mornings are chaotic — but that doesn't mean breakfast has to be boring or skipped entirely.",
    body: `Chef Emmanuel shares his go-to morning playbook for days when time is not on your side. The secret, he says, is prep — not complexity.

Start with overnight oats loaded with banana slices, a spoon of peanut butter, and a drizzle of honey. No cooking, no stress. Prep it the night before and it's ready the moment you open the fridge.

For something warm, his two-egg scramble with cherry tomatoes and feta takes exactly four minutes on medium heat. The trick is low and slow — don't rush the eggs or they go rubbery.

His third favourite? Avocado toast on thick sourdough with a sprinkle of chili flakes and a squeeze of lemon. Looks fancy, takes three minutes, costs almost nothing.

The fourth option is a smoothie bowl — blend frozen mango, a frozen banana, and a splash of coconut milk until thick. Pour into a bowl, top with granola and fresh fruit. Done in two minutes.

Finally, his weekend favourite that works on weekdays too: a warm flour tortilla spread with cream cheese, rolled with smoked salmon and capers. No heat required. High protein, high flavour.

"Breakfast doesn't have to be an event," Chef Emmanuel says. "It just has to happen."`,
  },
  {
    image: "/assets/homeImg2.jpg",
    category: "Dinner",
    title: "The Perfect Dinner Party: What Our Chefs Actually Cook at Home",
    date: "Feb 3, 2025",
    preview:
      "You'd think chefs go all out at home. The truth? They keep it simple — and that's exactly why it works.",
    body: `Adaeze Nwosu, our head pastry chef, admits she rarely makes anything complicated when hosting friends. "I make a big pot of jollof rice, a proper pepper soup, and let the food do the talking," she laughs.

Her dinner party formula is built on three rules: one pot dish, one side, one dessert. No more.

For the main, she starts her jollof rice base with a blended mix of tomatoes, red bell peppers, and scotch bonnet — fried down in vegetable oil for at least twenty minutes until the raw smell disappears and the oil floats to the top. This step, she says, is where most people cut corners and ruin the whole pot.

The pepper soup is even simpler. Goat meat, a blend of uziza leaves, scent leaves, and her own pepper soup spice mix simmered for forty-five minutes. "The longer it goes, the better it gets. Never rush pepper soup."

For dessert, she makes a no-bake chocolate tart — crushed digestive biscuits pressed into a tin, filled with warm ganache made from dark chocolate and heavy cream, then refrigerated for two hours. It slices cleanly, looks stunning, and she can make it the day before.

"People think dinner parties are about showing off," she says. "They're not. They're about making people feel taken care of."`,
  },
  {
    image: "/assets/homeImg3.jpg",
    category: "Desserts",
    title: "Sweet Secrets: The Desserts We Almost Kept to Ourselves",
    date: "Mar 19, 2025",
    preview:
      "Our pastry team finally agreed to share three recipes they've been hoarding for years.",
    body: `It took some convincing, but Adaeze finally agreed to release three of her most-requested recipes from our dessert menu.

First up: the molten chocolate cake that's been on our menu since 2012. The key is underbaking — eight minutes at 200°C in a well-buttered ramekin. The outside sets, the inside stays liquid. Pull it too early and it collapses. Pull it too late and you lose the flow. Eight minutes. No more, no less.

Second: her mango panna cotta. Warm 500ml of heavy cream with 60g of sugar and two teaspoons of vanilla extract. Dissolve two sheets of bloomed gelatine in the warm cream, pour into glasses, and refrigerate for four hours. Before serving, blend fresh mango with a squeeze of lime and a pinch of salt — pour this over the set cream. The salt in the mango sauce is the detail most people miss, but it makes the sweetness pop.

Third — and this one she debated sharing — is her chin chin bread pudding. Day-old bread cubed and soaked overnight in a custard of eggs, sugar, warm milk, nutmeg, and vanilla. Baked at 180°C for 35 minutes until golden and puffed. Served warm with a scoop of vanilla ice cream and a drizzle of caramel sauce.

"Dessert should feel like a reward," she says. "Like the meal gave you something to look forward to."`,
  },
  {
    image: "/assets/aboutImg.webp",
    category: "Drinks",
    title: "Beyond Cocktails: The Drinks Our Bar Team Swears By",
    date: "Apr 7, 2025",
    preview:
      "Not everything great in a glass needs alcohol. Our bar team builds flavour from the ground up.",
    body: `Kingsley, our head of operations and the quiet architect of our drinks menu, believes the most underrated skill in any restaurant is building a great non-alcoholic drink.

"Anybody can pour a Coke," he says. "But making something that feels as considered as a cocktail without the alcohol — that's craft."

His first recipe is a hibiscus ginger cooler. Steep dried hibiscus flowers in boiling water for ten minutes, sweeten with simple syrup, and chill. Serve over ice with freshly grated ginger, a slice of orange, and a sprig of mint. Deep red, tangy, and refreshing.

His second is a tamarind lemonade — tamarind paste dissolved in warm water, strained, mixed with fresh lemon juice and simple syrup, topped with sparkling water. The sourness is layered and complex in a way regular lemonade never is.

For something warm, he recommends a spiced zobo tea — zobo (hibiscus) steeped with cloves, cinnamon, and fresh ginger, served hot with a small square of dark chocolate on the side. The combination, he insists, is better than it sounds.

For guests who want something with alcohol, his house favourite is a palm wine spritz — fresh palm wine, elderflower liqueur, sparkling water, and a squeeze of lime served in a chilled glass with a salted rim.

"The best drink is one that makes people pause," Kingsley says. "That first sip should always surprise them a little."`,
  },
];

// FADE UP ANIMATION 

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// NEWSLETTER CARD 
// each card shows an image, category badge, title, date, preview text,
// and a collapsible body section toggled by the Read More button

function NewsletterCard({
  item,
  index,
}: {
  item: (typeof newsletters)[0];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      className="group flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      {/* card image */}
      <div className="overflow-hidden h-52 relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* category badge sits on top of the image */}
        <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {item.category}
        </div>
      </div>

      {/* card body */}
      <div className="flex flex-col flex-1 p-6">

        {/* date */}
        <p className="text-xs text-gray-400 mb-2">{item.date}</p>

        {/* title */}
        <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3">
          {item.title}
        </h3>

        {/* preview — always visible */}
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          {item.preview}
        </p>

        {/* yellow divider */}
        <div className="w-8 h-0.5 bg-yellow-500 mb-4" />

        {/* collapsible full article body */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              {/* split by double newline to render paragraphs */}
              <div className="space-y-3 mb-4">
                {item.body.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm text-gray-500 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* read more / read less toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="mt-auto flex items-center gap-1.5 text-sm font-bold text-yellow-500 hover:text-yellow-600 transition self-start"
        >
          {open ? (
            <>
              Read Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Read More <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>

      {/* yellow bottom bar that grows on hover */}
      <div className="h-0.5 w-0 bg-yellow-500 group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
}

// SUBSCRIBE FORM 
// email input + subscribe button with a success state

function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative mt-20 rounded-3xl overflow-hidden"
    >
      {/* background image with dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,31,34,0.75), rgba(8,31,34,0.85)), url(/assets/homeImg3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* yellow glow in the middle */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="w-[500px] h-[300px] bg-yellow-400/15 blur-[120px] rounded-full" />
      </div>

      {/* content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-20">

        <div className="flex items-center gap-3 mb-4">
          <div className="h-0.5 w-6 bg-yellow-500" />
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
            Stay in the Loop
          </p>
          <div className="h-0.5 w-6 bg-yellow-500" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white leading-tight mb-4">
          Get Fresh Tips Straight <br /> to Your Inbox
        </h2>

        <p className="text-gray-300 text-base sm:text-lg max-w-lg leading-relaxed mb-10">
          No spam. No filler. Just recipes, chef tips, and the occasional
          secret from our kitchen — delivered once a week.
        </p>

        {/* success state after submit */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                <Mail className="w-7 h-7 text-black" />
              </div>
              <p className="text-white font-bold text-lg">You're in!</p>
              <p className="text-gray-300 text-sm">
                Welcome to the Tastyc newsletter. Check your inbox.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="w-full max-w-xl flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-yellow-500 transition"
              />
              <button
                type="submit"
                className="px-7 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm shrink-0"
              >
                Subscribe Now
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* small trust note below the form */}
        {!submitted && (
          <p className="text-gray-500 text-xs mt-4">
            Join 4,000+ food lovers. Unsubscribe anytime.
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────

export default function Newsletter() {
  return (
    <section className="relative py-24 px-6 md:px-16 lg:px-20 bg-white overflow-hidden">

      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-yellow-400/15 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* yellow label with lines */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-0.5 w-6 bg-yellow-500" />
            <p className="text-xl font-bold uppercase tracking-widest text-yellow-500">
              Newsletter
            </p>
            <div className="h-0.5 w-6 bg-yellow-500" />
          </div>

          {/* main heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-gray-900 leading-tight mb-4">
            Tips & Recipes from Our Chefs
          </h1>

          {/* short description */}
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Our chefs don't keep secrets — well, not all of them. Each edition
            of the Tastyc newsletter is packed with real recipes, honest tips,
            and stories from the kitchen. Pick a card and dig in.
          </p>
        </motion.div>

        {/* 4 newsletter cards in a responsive grid */}
        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {newsletters.map((item, i) => (
            <NewsletterCard key={i} item={item} index={i} />
          ))}
        </motion.div>

        {/* subscribe form at the bottom */}
        <SubscribeForm />
      </div>
    </section>
  );
}