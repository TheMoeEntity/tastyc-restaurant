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
    name: "Pages",
    href: "/gallery",
    dropdown: [
      { label: "Gallery", href: "/gallery" },
      { label: "Pricing", href: "/pricing" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "404", href: "/404" },
      { label: "Coming Soon", href: "/coming-soon" },
    ],
  },
  {
    name: "Blog",
    href: "/blog",
    dropdown: [
      { label: "Blog Grid", href: "/blog" },
      { label: "Blog List", href: "/blog/list" },
      { label: "Single Post", href: "/blog/post" },
      { label: "Categories", href: "/blog/categories" },
      { label: "Authors", href: "/blog/authors" },
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
      { label: "Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Wishlist", href: "/shop/wishlist" },
      { label: "Deals", href: "/shop/deals" },
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
