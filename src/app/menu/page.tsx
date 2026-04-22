"use client";

import React, { useState, useEffect } from "react";
import {
  Coffee, UtensilsCrossed, Cake, Wine, ChefHat,
  Search, Star, Flame, Leaf, Globe, Filter,
  ChevronRight, ShoppingCart, Eye,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  tags: string[];
  spicy?: boolean;
  popular?: boolean;
  veg?: boolean;
  glutenFree?: boolean;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}


const menuItems: MenuItem[] = [
  {
    id: "app-1", name: "Crispy Calamari",
    description: "Lightly fried squid rings served with spicy marinara sauce and lemon aioli",
    price: 14.99, category: "Appetizers", subCategory: "Seafood",
    tags: ["seafood", "fried"], popular: true, image: "/assets/homeImg1.jpg",
  },
  {
    id: "app-2", name: "Bruschetta Classica",
    description: "Toasted artisan bread topped with fresh tomatoes, garlic, basil, and balsamic glaze",
    price: 9.99, category: "Appetizers", subCategory: "Vegetarian",
    tags: ["vegetarian", "italian"], veg: true, image: "/assets/homeImg2.jpg",
  },
  {
    id: "app-3", name: "Spicy Chicken Wings",
    description: "Jumbo wings tossed in house-made buffalo sauce, served with blue cheese dip",
    price: 13.99, category: "Appetizers", subCategory: "Chicken",
    tags: ["chicken", "spicy"], spicy: true, popular: true, image: "/assets/homeImg3.jpg",
  },
  {
    id: "app-4", name: "Spring Rolls",
    description: "Crispy rolls filled with glass noodles, vegetables, and choice of chicken or tofu",
    price: 8.99, category: "Appetizers", subCategory: "Asian",
    tags: ["asian", "crispy"], veg: true, image: "/assets/homeImg1.jpg",
  },
  {
    id: "afr-1", name: "Jollof Rice with Chicken",
    description: "West African spiced tomato rice with grilled chicken, plantains, and coleslaw",
    price: 18.99, category: "African Specialties", subCategory: "West African",
    tags: ["west african", "rice", "popular"], popular: true, spicy: true, image: "/assets/homeImg2.jpg",
  },
  {
    id: "afr-2", name: "Egusi Soup with Pounded Yam",
    description: "Rich melon seed soup with assorted meat, fish, and leafy vegetables",
    price: 19.99, category: "African Specialties", subCategory: "West African",
    tags: ["soup", "traditional", "nigeria"], spicy: true, image: "/assets/homeImg3.jpg",
  },
  {
    id: "afr-3", name: "Suya Platter",
    description: "Spicy grilled beef skewers with onions, tomatoes, and extra yaji spice",
    price: 16.99, category: "African Specialties", subCategory: "Street Food",
    tags: ["grilled", "spicy", "street food"], spicy: true, popular: true, image: "/assets/homeImg1.jpg",
  },
  {
    id: "afr-4", name: "Doro Wat",
    description: "Ethiopian spicy chicken stew with berbere spice and hard-boiled eggs, served with injera",
    price: 21.99, category: "African Specialties", subCategory: "East African",
    tags: ["ethiopian", "stew", "spicy"], spicy: true, image: "/assets/homeImg2.jpg",
  },
  {
    id: "int-1", name: "Grilled Ribeye Steak",
    description: "14oz prime ribeye grilled to perfection, served with garlic mash and seasonal vegetables",
    price: 34.99, category: "Intercontinental", subCategory: "Steakhouse",
    tags: ["steak", "premium"], popular: true, image: "/assets/homeImg3.jpg",
  },
  {
    id: "int-2", name: "Miso Glazed Salmon",
    description: "Norwegian salmon with sweet miso glaze, jasmine rice, and bok choy",
    price: 27.99, category: "Intercontinental", subCategory: "Seafood",
    tags: ["seafood", "japanese", "healthy"], image: "/assets/homeImg1.jpg",
  },
  {
    id: "int-3", name: "Chicken Alfredo Pasta",
    description: "Fettuccine in creamy parmesan sauce with grilled chicken and fresh parsley",
    price: 19.99, category: "Intercontinental", subCategory: "Italian",
    tags: ["pasta", "italian", "creamy"], popular: true, image: "/assets/homeImg2.jpg",
  },
  {
    id: "int-4", name: "Vegetable Pad Thai",
    description: "Rice noodles stir-fried with tofu, bean sprouts, peanuts, and tamarind sauce",
    price: 16.99, category: "Intercontinental", subCategory: "Asian",
    tags: ["thai", "noodles", "vegetarian"], veg: true, image: "/assets/homeImg3.jpg",
  },
  {
    id: "int-5", name: "Beef Burger Deluxe",
    description: "Angus beef patty, aged cheddar, caramelized onions, lettuce, tomato, and house sauce",
    price: 17.99, category: "Intercontinental", subCategory: "American",
    tags: ["burger", "american", "classic"], popular: true, image: "/assets/homeImg1.jpg",
  },
  {
    id: "des-1", name: "Molten Chocolate Cake",
    description: "Warm chocolate cake with liquid center, served with vanilla ice cream",
    price: 9.99, category: "Desserts", subCategory: "Cakes",
    tags: ["chocolate", "warm", "ice cream"], popular: true, image: "/assets/homeImg2.jpg",
  },
  {
    id: "des-2", name: "Cheesecake New York Style",
    description: "Creamy cheesecake with graham cracker crust and berry coulis",
    price: 8.99, category: "Desserts", subCategory: "Cakes",
    tags: ["cheesecake", "creamy"], image: "/assets/homeImg3.jpg",
  },
  {
    id: "des-3", name: "Puff-Puff",
    description: "Nigerian fried dough balls dusted with powdered sugar and cinnamon",
    price: 6.99, category: "Desserts", subCategory: "African",
    tags: ["african", "fried", "sweet"], popular: true, image: "/assets/homeImg1.jpg",
  },
  {
    id: "des-4", name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    price: 8.99, category: "Desserts", subCategory: "Italian",
    tags: ["italian", "coffee", "creamy"], image: "/assets/homeImg2.jpg",
  },
  {
    id: "drk-1", name: "Fresh Lemonade",
    description: "House-made with fresh lemons, mint, and a touch of honey",
    price: 4.99, category: "Drinks", subCategory: "Non-Alcoholic",
    tags: ["refreshing", "non-alcoholic"], image: "/assets/homeImg3.jpg",
  },
  {
    id: "drk-2", name: "Zobo Drink",
    description: "Traditional Nigerian hibiscus tea with ginger and pineapple",
    price: 4.99, category: "Drinks", subCategory: "Non-Alcoholic",
    tags: ["african", "hibiscus", "traditional"], popular: true, image: "/assets/homeImg1.jpg",
  },
  {
    id: "drk-3", name: "Chapman Cocktail",
    description: "Nigerian classic cocktail with grenadine, sprite, and fresh fruits",
    price: 7.99, category: "Drinks", subCategory: "Cocktails",
    tags: ["cocktail", "african", "fruity"], popular: true, image: "/assets/homeImg2.jpg",
  },
  {
    id: "drk-4", name: "House Red Wine",
    description: "Full-bodied cabernet sauvignon from South Africa",
    price: 8.99, category: "Drinks", subCategory: "Wine",
    tags: ["wine", "red"], image: "/assets/homeImg3.jpg",
  },
  {
    id: "drk-5", name: "Espresso Martini",
    description: "Vodka, fresh espresso, coffee liqueur, and simple syrup",
    price: 11.99, category: "Drinks", subCategory: "Cocktails",
    tags: ["cocktail", "coffee"], image: "/assets/homeImg1.jpg",
  },
  {
    id: "drk-6", name: "Smoothie Bowl",
    description: "Acai berry blend topped with granola, banana, and coconut flakes",
    price: 8.99, category: "Drinks", subCategory: "Smoothies",
    tags: ["healthy", "breakfast", "vegan"], veg: true, image: "/assets/homeImg2.jpg",
  },
];

const categories = [
  { id: "all", name: "All", icon: UtensilsCrossed },
  { id: "Appetizers", name: "Appetizers", icon: Coffee },
  { id: "African Specialties", name: "African", icon: Globe },
  { id: "Intercontinental", name: "Global", icon: ChefHat },
  { id: "Desserts", name: "Desserts", icon: Cake },
  { id: "Drinks", name: "Drinks", icon: Wine },
];

const featuredItems = menuItems.filter(item => item.popular).slice(0, 6);

const addToCart = (item: MenuItem) => {
  const existingCart = localStorage.getItem("cart");
  let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

const removeFromCart = (itemId: string) => {
  const existingCart = localStorage.getItem("cart");
  if (!existingCart) return;
  const cart: CartItem[] = JSON.parse(existingCart);
  const updated = cart.filter(c => c.id !== itemId);
  localStorage.setItem("cart", JSON.stringify(updated));
  window.dispatchEvent(new Event("cartUpdated"));
};

function SectionHeader({ label, title, subtitle, light = false }: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <MotionWrapper variant="fade-up" className="text-center max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-0.5 w-6 bg-yellow-500" />
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">{label}</p>
        <div className="h-0.5 w-6 bg-yellow-500" />
      </div>
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-4 ${light ? "text-white" : "text-gray-900"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed ${light ? "text-gray-300" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </MotionWrapper>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const [isAdded, setIsAdded] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const checkCart = () => {
      const existing = localStorage.getItem("cart");
      if (!existing) { setInCart(false); return; }
      const cart: CartItem[] = JSON.parse(existing);
      setInCart(cart.some(c => c.id === item.id));
    };
    checkCart();
    window.addEventListener("cartUpdated", checkCart);
    return () => window.removeEventListener("cartUpdated", checkCart);
  }, [item.id]);

  const handleAddToCart = () => {
    addToCart(item);
    setIsAdded(true);
    setInCart(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(item.id);
    setInCart(false);
  };

  return (
    <MotionWrapper variant="fade-up" delay={index * 100}>
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full">

        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {item.popular && (
            <div className="absolute top-3 left-3 z-20 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-black" /> Popular
            </div>
          )}
          {item.spicy && (
            <div className="absolute top-3 right-3 z-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" /> Spicy
            </div>
          )}
          {item.veg && (
            <div className="absolute bottom-3 left-3 z-20 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Veg
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors">
              {item.name}
            </h3>
            <span className="font-black text-yellow-600 text-lg">${item.price}</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{item.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>

          <div className="flex gap-2">
            {inCart ? (
              <button
                onClick={handleRemoveFromCart}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold text-sm py-2 rounded-lg transition flex items-center justify-center gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                Remove
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-sm py-2 rounded-lg transition flex items-center justify-center gap-1"
              >
                <ShoppingCart className="w-4 h-4" />
                {isAdded ? "Added!" : "Add to Order"}
              </button>
            )}
            <button className="px-3 border border-gray-300 hover:border-yellow-500 rounded-lg transition text-gray-600 hover:text-yellow-600">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <main className="bg-gray-50 overflow-hidden">

      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(/assets/homeImg1.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <MotionWrapper variant="fade-up">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  Since 2012
                </p>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-serif text-white mb-6 leading-tight">
              Our <span className="text-yellow-500">Menu</span>
            </h1>
            <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto">
              A culinary journey across continents — from West African classics to global favorites, crafted with passion and served with love.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 px-6 md:px-16 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Chef's Selection"
            title="Our Signature Dishes"
            subtitle="These are the plates our guests come back for again and again. Each one tells a story."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item, idx) => (
              <MenuCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH + FILTER BAR */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-4 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes, ingredients, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-yellow-500 text-black shadow-md scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-3">
                {["Spicy", "Vegetarian", "Popular", "Gluten-Free"].map(filter => (
                  <button
                    key={filter}
                    className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full hover:border-yellow-400 transition"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MENU GRID */}
      <section className="py-16 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-16 last:mb-0">
              <MotionWrapper variant="fade-left" className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 inline-block border-l-4 border-yellow-500 pl-4">
                  {category}
                </h2>
                <p className="text-gray-500 mt-2 ml-4">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </MotionWrapper>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, idx) => (
                  <MenuCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No dishes found matching your criteria.</p>
              <button
                onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 md:px-16 lg:px-20 overflow-hidden">
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
            <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-3">Ready to Order?</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white mb-5">
              Dine In, Take Out, or Delivery
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8">
              Whether you're craving our famous Jollof, a perfectly grilled steak, or a quiet dinner for two — we're here to serve you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg hover:shadow-xl"
              >
                Book a Table <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition"
              >
                View Cart <ShoppingCart className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
              {[
                { value: "30+", label: "Countries Inspired" },
                { value: "80+", label: "Menu Items" },
                { value: "15min", label: "Avg. Prep Time" },
                { value: "100%", label: "Fresh Ingredients" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-black text-yellow-500">{stat.value}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </section>

    </main>
  );
}