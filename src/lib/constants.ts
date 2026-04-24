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
}
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
