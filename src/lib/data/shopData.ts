// src/lib/data/shopData.ts

import { Product } from "@/types/shop.types";

export const allProducts: Product[] = [
  {
    id: "shop-1", name: "Jollof Rice with Chicken", description: "West African spiced tomato rice with grilled chicken, plantains, and coleslaw",
    price: 18.99, originalPrice: 22.99, category: "African", subCategory: "West African",
    tags: ["west african", "rice", "popular"], popular: true, spicy: true,
    image: "/assets/homeImg1.jpg", rating: 4.8, reviewCount: 234, inStock: true, discount: 15,
    menuItemId: "menuItem-1"
  },
  {
    id: "shop-2", name: "Egusi Soup with Pounded Yam", description: "Rich melon seed soup with assorted meat, fish, and leafy vegetables",
    price: 19.99, category: "African", subCategory: "West African",
    tags: ["soup", "traditional", "nigeria"], spicy: true, popular: true,
    image: "/assets/homeImg2.jpg", rating: 4.9, reviewCount: 189, inStock: true,
    menuItemId: "menuItem-2"
  },
  {
    id: "shop-3", name: "Suya Platter", description: "Spicy grilled beef skewers with onions, tomatoes, and extra yaji spice",
    price: 16.99, category: "African", subCategory: "Street Food",
    tags: ["grilled", "spicy", "street food"], spicy: true, popular: true,
    image: "/assets/homeImg3.jpg", rating: 4.7, reviewCount: 312, inStock: true,
    menuItemId: "menuItem-3"
  },
  {
    id: "shop-4", name: "Grilled Ribeye Steak", description: "14oz prime ribeye grilled to perfection, served with garlic mash",
    price: 34.99, category: "Global", subCategory: "Steakhouse",
    tags: ["steak", "premium"], popular: true,
    image: "/assets/homeImg1.jpg", rating: 4.9, reviewCount: 156, inStock: true,
    menuItemId: "menuItem-4"
  },
  {
    id: "shop-5", name: "Miso Glazed Salmon", description: "Norwegian salmon with sweet miso glaze, jasmine rice, and bok choy",
    price: 27.99, originalPrice: 32.99, category: "Global", subCategory: "Seafood",
    tags: ["seafood", "japanese", "healthy"], discount: 15,
    image: "/assets/homeImg2.jpg", rating: 4.6, reviewCount: 98, inStock: true,
    menuItemId: "menuItem-5"
  },
  {
    id: "shop-6", name: "Chicken Alfredo Pasta", description: "Fettuccine in creamy parmesan sauce with grilled chicken",
    price: 19.99, category: "Global", subCategory: "Italian",
    tags: ["pasta", "italian", "creamy"], popular: true,
    menuItemId: "menuItem-6",
    image: "/assets/homeImg3.jpg", rating: 4.5, reviewCount: 267, inStock: true,
  },
  {
    id: "shop-7", name: "Vegetable Pad Thai", description: "Rice noodles stir-fried with tofu, bean sprouts, peanuts, and tamarind sauce",
    price: 16.99, category: "Global", subCategory: "Asian",
    tags: ["thai", "noodles", "vegetarian"], veg: true,
    menuItemId: "menuItem-7",
    image: "/assets/homeImg1.jpg", rating: 4.4, reviewCount: 145, inStock: true,
  },
  {
    id: "shop-8", name: "Molten Chocolate Cake", description: "Warm chocolate cake with liquid center, served with vanilla ice cream",
    price: 9.99, category: "Desserts", subCategory: "Cakes",
    tags: ["chocolate", "warm", "ice cream"], popular: true,
    menuItemId: "menuItem-8",
    image: "/assets/homeImg2.jpg", rating: 4.9, reviewCount: 423, inStock: true,
  },
  {
    id: "shop-9", name: "Puff-Puff", description: "Nigerian fried dough balls dusted with powdered sugar and cinnamon",
    price: 6.99, category: "Desserts", subCategory: "African",
    tags: ["african", "fried", "sweet"], popular: true,
    menuItemId: "menuItem-9",
    image: "/assets/homeImg3.jpg", rating: 4.8, reviewCount: 289, inStock: true,
  },
  {
    id: "shop-10", name: "Chapman Cocktail", description: "Nigerian classic cocktail with grenadine, sprite, and fresh fruits",
    price: 7.99, category: "Drinks", subCategory: "Cocktails",
    tags: ["cocktail", "african", "fruity"], popular: true,
    menuItemId: "menuItem-10",
    image: "/assets/homeImg1.jpg", rating: 4.6, reviewCount: 178, inStock: true,
  },
  {
    id: "shop-11", name: "Zobo Drink", description: "Traditional Nigerian hibiscus tea with ginger and pineapple",
    price: 4.99, category: "Drinks", subCategory: "Non-Alcoholic",
    tags: ["african", "hibiscus", "traditional"],
    menuItemId: "menuItem-11",
    image: "/assets/homeImg2.jpg", rating: 4.5, reviewCount: 234, inStock: true,
  },
  {
    id: "shop-12", name: "Bruschetta Classica", description: "Toasted artisan bread topped with fresh tomatoes, garlic, and basil",
    price: 9.99, category: "Appetizers", subCategory: "Vegetarian",
    tags: ["vegetarian", "italian"], veg: true,
    menuItemId: "menuItem-12",
    image: "/assets/homeImg3.jpg", rating: 4.3, reviewCount: 167, inStock: true,
  },
];

export const categories = ["All", "African", "Global", "Desserts", "Drinks", "Appetizers"];