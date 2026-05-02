"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Eye,
  ShoppingCart,
  Star,
  Flame,
  Leaf,
  Percent,
  Check,
} from "lucide-react";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import { Product } from "@/types/shop.types";
import { useCartStore } from "@/store/useCartStore";
import { useShopStore } from "@/store/useShopStore";

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const { addProduct, items } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useShopStore();

  const inCart = items.some((item) => item.id === product.id);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
    
    const handleWishlistUpdate = () => {
      setIsWishlisted(isInWishlist(product.id));
    };
    
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [product.id, isInWishlist]);

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleAddToCart = () => {
    addProduct(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // List View
  if (viewMode === "list") {
    return (
      <MotionWrapper variant="fade-up" className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
            {product.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{product.discount}%
              </div>
            )}
            {product.popular && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-black" /> Popular
              </div>
            )}
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                  )}
                  <span className="font-black text-yellow-600 text-xl">${product.price}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-2">{product.description}</p>
              <div className="flex items-center gap-3 text-sm mb-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="font-semibold text-gray-700">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount})</span>
                </div>
                <div className="flex gap-2">
                  {product.spicy && (
                    <span className="flex items-center gap-1 text-red-500 text-xs">
                      <Flame className="w-3 h-3" /> Spicy
                    </span>
                  )}
                  {product.veg && (
                    <span className="flex items-center gap-1 text-green-600 text-xs">
                      <Leaf className="w-3 h-3" /> Veg
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddToCart} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2">
                {isAdded || inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                {isAdded ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
              </button>
              <button onClick={handleWishlist} className={`px-3 py-2 rounded-lg border transition ${isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "border-gray-300 hover:border-red-300 text-gray-500 hover:text-red-500"}`}>
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500" : ""}`} />
              </button>
              <button onClick={() => setShowQuickView(true)} className="px-3 py-2 border border-gray-300 rounded-lg hover:border-yellow-500 transition text-gray-500 hover:text-yellow-500">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick View Modal */}
        {showQuickView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowQuickView(false)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold font-serif text-gray-900">Quick View</h2>
                <button onClick={() => setShowQuickView(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">✕</button>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2 relative h-80">
                    <Image src={product.image} alt={product.name} fill className="object-cover rounded-xl" />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <Star className="w-4 h-4 fill-gray-300" />
                      </div>
                      <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      {product.originalPrice && <span className="text-gray-400 line-through text-lg">${product.originalPrice}</span>}
                      <span className="font-black text-yellow-600 text-3xl">${product.price}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.spicy && <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">🌶️ Spicy</span>}
                      {product.veg && <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">🥬 Vegetarian</span>}
                      {product.glutenFree && <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">🌾 Gluten Free</span>}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleAddToCart} className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                      </button>
                      <button onClick={handleWishlist} className={`px-4 py-3 rounded-xl border transition ${isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "border-gray-300 hover:border-red-300"}`}>
                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </MotionWrapper>
    );
  }

  // Grid View
  return (
    <MotionWrapper variant="fade-up">
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Percent className="w-3 h-3" /> {product.discount}% OFF
            </div>
          )}
          {product.isNew && !product.discount && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
          )}
          {product.popular && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-black" /> Popular
            </div>
          )}
          <button
            onClick={handleWishlist}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">{product.category}</span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-3 h-3 fill-yellow-500" />
              <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-2 mb-3">
            {product.originalPrice && <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>}
            <span className="font-black text-yellow-600 text-lg">${product.price}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              isAdded || inCart ? "bg-green-500 text-white" : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }`}
          >
            {isAdded || inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {isAdded ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </MotionWrapper>
  );
}