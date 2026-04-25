import { Variant, Variants } from "framer-motion";
import { Award, Heart, Star, Users } from "lucide-react";

export const stats = [
  { value: "12+", label: "Years Serving" },
  { value: "80+", label: "Menu Items" },
  { value: "98%", label: "Happy Guests" },
  { value: "15k+", label: "Orders Served" },
];

export const team = [
  {
    name: "Chef Emmanuel Obi",
    role: "Executive Chef",
    bio: "18 years across Lagos, Accra, and London. Emmanuel leads with fearless creativity and deep respect for every ingredient.",
    image: "/assets/homeImg1.jpg",
  },
  {
    name: "Adaeze Nwosu",
    role: "Pastry Chef",
    bio: "Trained in Paris, Adaeze brings a delicate touch to every dessert. Her molten chocolate cake has been on the menu since day one.",
    image: "/assets/homeImg2.jpg",
  },
  {
    name: "Kingsley Eze",
    role: "Head of Operations",
    bio: "Kingsley's obsession with guest experience means every visit feels personal, warm, and perfectly timed.",
    image: "/assets/homeImg3.jpg",
  },
];

export const milestones = [
  {
    year: "2012",
    title: "We Opened Our Doors",
    description:
      "Tastyc started as a small 20-seat kitchen driven by one idea — make people feel at home through food.",
  },
  {
    year: "2015",
    title: "First Expansion",
    description:
      "Growing demand pushed us to double our space and introduce our now-famous intercontinental menu.",
  },
  {
    year: "2018",
    title: "Best Restaurant Award",
    description:
      "We were honored with the Regional Culinary Excellence Award for our commitment to quality.",
  },
  {
    year: "2021",
    title: "Online Shop Launched",
    description:
      "We brought Tastyc to your doorstep — meal kits and signature sauces shipped nationwide.",
  },
  {
    year: "2024",
    title: "Community Kitchen Program",
    description:
      "Every weekend we open our kitchen to train young aspiring chefs for free.",
  },
];

export const values = [
  {
    icon: Heart,
    title: "Cooked with Love",
    description:
      "Every dish that leaves our kitchen carries the warmth and care of the people who made it. We cook like we're feeding family — because in many ways, we are. That emotional investment is something you can taste.",
  },
  {
    icon: Star,
    title: "Uncompromising Quality",
    description:
      "We never cut corners. If an ingredient isn't right, it doesn't go on your plate — full stop. From the oil we fry in to the garnish we finish with, every detail is held to the same standard every single day.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We believe restaurants exist to bring people together. Every table is a gathering place — for families, old friends, first dates, and everything in between. Tastyc was built for the community and belongs to it.",
  },
  {
    icon: Award,
    title: "Honest Recognition",
    description:
      "Awards and good reviews are gratifying, but they're not why we show up. Our real reward is a guest who comes back — who brings their friend, who tells their colleague. That quiet loyalty is the only metric that truly matters to us.",
  },
];

export const openingHours = [
  { day: "Monday – Friday", time: "10:00 AM – 10:00 PM" },
  { day: "Saturday", time: "9:00 AM – 11:00 PM" },
  { day: "Sunday", time: "11:00 AM – 9:00 PM" },
  { day: "Public Holidays", time: "12:00 PM – 8:00 PM" },
];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
