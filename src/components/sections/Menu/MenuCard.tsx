"use client";

import { useState } from "react";
import { Star, Flame, Leaf, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import { MenuItem } from "@/types";
import { useCartStore } from "@/store/useCartStore";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export function MenuCard({ item, index }: MenuCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addMenuItem, removeItem, items } = useCartStore();

  const inCart = items.some((i) => i.id === item.id);

  const handleAddToCart = () => {
    addMenuItem(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleRemoveFromCart = () => {
    removeItem(item.id);
  };

  return (
    <MotionWrapper variant="fade-up" delay={index * 100}>
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}
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
          <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {tag}
              </span>
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