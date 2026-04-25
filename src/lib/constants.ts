import { Link } from "@/types";
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
