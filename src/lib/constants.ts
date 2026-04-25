import { Link } from "@/types";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
export const navItems = [
  {
    name: "Home",
    href: "/",
    dropdown: null,
  },
  {
    name: "About",
    href: "/about",
    dropdown: null,
  },
  {
    name: "Menu",
    href: "/menu",
    dropdown: null,
  },
  {
    name: "Order",
    href: "/order",
    dropdown: [
      { label: "Online Order", href: "/order" },
      { label: "Track Order", href: "/order/track" },
      { label: "Offers", href: "/order/offers" },
      { label: "Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
    ],
  },

  {
    name: "Blog",
    href: "/blog",
    dropdown: [
      { label: "Latest Posts", href: "/blog" },
      { label: "Recipes", href: "/blog/recipes" },
      { label: "Chef's Corner", href: "/blog/chef-corner" },
      { label: "Events", href: "/blog/events" },
      { label: "Popular", href: "/blog/popular" },
    ],
  },
  {
    name: "Contact",
    href: "/contact",
    dropdown: [
      { label: "Contact Us", href: "/contact" },
      { label: "Support", href: "/contact/support" },
      { label: "Locations", href: "/contact/locations" },
      { label: "Email", href: "/contact/email" },
      { label: "Call", href: "/contact/call" },
    ],
  },
  {
    name: "Shop",
    href: "/shop",
    dropdown: [
      { label: "All Products", href: "/shop" },
      { label: "Categories", href: "/shop/categories" },
      { label: "Deals & Offers", href: "/shop/deals" },
      { label: "Wishlist", href: "/shop/wishlist" },
      { label: "Cart", href: "/cart" },
    ],
  },
];
export const links: Link[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Buy",
    href: "/buy",
  },
  {
    name: "Sell",
    href: "/sell",
  },
  {
    name: "Services",
    href: "/services",
  },
  {
    name: "About Us",
    href: "/about",
  },
  // {
  //     name:"Contact Us",
  //     href:"#contact"
  // }
];
export const testimonials = [
  {
    quote: "I'm delighted!",
    review:
      "Everything about this place is amazing. The food came out hot, the portions were generous, and the staff made us feel right at home. We'll definitely be back soon.",
    name: "Viktoria Freeman",
    date: "02.02.21",
    image: "/assets/homeImg1.jpg",
  },
  {
    quote: "I will visit again.",
    review:
      "Honestly one of the best dining experiences I've had in a long time. The grilled chicken was perfectly seasoned and the atmosphere was so warm and cozy.",
    name: "Paul Trueman",
    date: "02.02.21",
    image: "/assets/homeImg2.jpg",
  },
  {
    quote: "The best restaurant!",
    review:
      "From the moment we walked in, we were treated like family. The pasta was rich, creamy, and absolutely to die for. This place sets the bar high.",
    name: "Oscar Oldman",
    date: "02.02.21",
    image: "/assets/homeImg3.jpg",
  },
  {
    quote: "It was very delicious!",
    review:
      "The flavors were bold and the presentation was beautiful. You can tell the chef puts real passion into every dish. A must-visit for any food lover.",
    name: "Emma Newman",
    date: "02.02.21",
    image: "/assets/homeImg1.jpg",
  },
  {
    quote: "Absolutely wonderful!",
    review:
      "We celebrated our anniversary here and it was perfect. The candle-lit setting, the wine, the dessert — everything was just right. Thank you for the memories.",
    name: "James Carter",
    date: "02.02.21",
    image: "/assets/homeImg2.jpg",
  },
  {
    quote: "Highly recommended!",
    review:
      "I brought my whole family and everyone left happy. The kids loved the burgers and I couldn't stop raving about the seafood platter. Great value for the quality.",
    name: "Sofia Martins",
    date: "02.02.21",
    image: "/assets/homeImg3.jpg",
  },
];
export const features = [
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
export const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Foodie Street, Lekki Phase 1", "Lagos, Nigeria"],
    delay: 0,
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 801 234 5678", "+234 802 345 6789"],
    delay: 100,
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@tastyc.com", "reservations@tastyc.com"],
    delay: 200,
  },
  {
    icon: Clock,
    title: "Opening Hours",
    details: ["Mon-Fri: 10am - 10pm", "Sat: 9am - 11pm", "Sun: 11am - 9pm"],
    delay: 300,
  },
];

export const faqs = [
  {
    question: "Do I need a reservation?",
    answer:
      "While walk-ins are always welcome, we highly recommend making a reservation — especially on weekends and public holidays. You can book a table through our reservation page or by calling us directly.",
  },
  {
    question: "Do you offer catering services?",
    answer:
      "Yes! Tastyc provides catering for private events, corporate gatherings, and parties. Contact our events team at events@tastyc.com for a custom quote.",
  },
  {
    question: "Is there parking available?",
    answer:
      "Yes, we have a dedicated parking lot for our guests with 24/7 security. Valet parking is also available on weekends.",
  },
  {
    question: "Do you accommodate dietary restrictions?",
    answer:
      "Absolutely. We offer vegetarian, vegan, and gluten-free options. Please inform your server or mention it when booking your reservation.",
  },
  {
    question: "Can I host a private event at Tastyc?",
    answer:
      "We have a private dining room that seats up to 30 guests, and the entire restaurant can be booked for larger events. Contact us for more details.",
  },
  {
    question: "Do you offer takeout and delivery?",
    answer:
      "Yes! You can order takeout directly from our website or through our delivery partners. We also offer contactless pickup.",
  },
];

export const socialLinks = [
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];
