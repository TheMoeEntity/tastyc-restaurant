/* eslint-disable react-hooks/set-state-in-effect */
// src/app/shop/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Eye,
  Star,
  Flame,
  Leaf,
  Search,
  Filter,
  Grid3x3,
  List,
  ChevronRight,
  Tag,
  Clock,
  Truck,
  ShieldCheck,
  Gift,
  Sparkles,
  X,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Percent,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { allProducts, categories } from "@/lib/data/shopData";
import { Product, Deal, WishlistItem } from "@/types/shop.types";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  addToCart,
  saveAppliedPromo,
  getActiveDeals,
  defaultDeals,
} from "@/lib/utils/shopUtils";
import Image from "next/image";

// Storage keys (keep in component for component-specific state)
const WISHLIST_STORAGE_KEY = "restaurant_wishlist";
const ACTIVE_PROMO_KEY = "active_promo_code";

// Deal interface (using imported type)
type DealType = Deal;

function ProductCard({
  product,
  viewMode,
}: {
  product: Product;
  viewMode: "grid" | "list";
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
    const handleWishlistUpdate = () =>
      setIsWishlisted(isInWishlist(product.id));
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [product.id]);

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  if (viewMode === "list") {
    return (
      <MotionWrapper
        variant="fade-up"
        className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="w-full h-full object-cover"
            />
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
                <h3 className="font-bold text-lg text-gray-900">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="font-black text-yellow-600 text-xl">
                    ${product.price}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-2">
                {product.description}
              </p>
              <div className="flex items-center gap-3 text-sm mb-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="font-semibold text-gray-700">
                    {product.rating}
                  </span>
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
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isAdded ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {isAdded ? "Added!" : "Add to Cart"}
              </button>
              <button
                onClick={handleWishlist}
                className={`px-3 py-2 rounded-lg border transition ${isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "border-gray-300 hover:border-red-300 text-gray-500 hover:text-red-500"}`}
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-red-500" : ""}`}
                />
              </button>
              <button
                onClick={() => setShowQuickView(true)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:border-yellow-500 transition text-gray-500 hover:text-yellow-500"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper variant="fade-up">
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Percent className="w-3 h-3" /> {product.discount}% OFF
            </div>
          )}
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>
          )}
          {product.popular && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-black" /> Popular
            </div>
          )}
          <button
            onClick={handleWishlist}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
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
              <span className="text-xs font-semibold text-gray-700">
                {product.rating}
              </span>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mb-3">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                ${product.originalPrice}
              </span>
            )}
            <span className="font-black text-yellow-600 text-lg">
              ${product.price}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isAdded ? "bg-green-500 text-white" : "bg-yellow-500 hover:bg-yellow-400 text-black"}`}
          >
            {isAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            {isAdded ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowQuickView(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold font-serif text-gray-900">
                Quick View
              </h2>
              <button
                onClick={() => setShowQuickView(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="w-full h-80 object-cover rounded-xl"
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <Star className="w-4 h-4 fill-gray-300" />
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-lg">
                        ${product.originalPrice}
                      </span>
                    )}
                    <span className="font-black text-yellow-600 text-3xl">
                      ${product.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.spicy && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        🌶️ Spicy
                      </span>
                    )}
                    {product.veg && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                        🥬 Vegetarian
                      </span>
                    )}
                    {product.glutenFree && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                        🌾 Gluten Free
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                    <button
                      onClick={handleWishlist}
                      className={`px-4 py-3 rounded-xl border transition ${isWishlisted ? "bg-red-50 border-red-200 text-red-500" : "border-gray-300 hover:border-red-300"}`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`}
                      />
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

function DealsSection({
  deals,
  onApplyDeal,
}: {
  deals: Deal[];
  onApplyDeal: (code: string, discount: number, minOrder?: number) => void;
}) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{
    message: string;
    type: string;
  } | null>(null);

  const copyCode = async (
    code: string,
    discount: number,
    minOrder?: number,
  ) => {
    let success = false;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        success = true;
      }
    } catch (err) {
      console.log("Clipboard API failed, trying fallback...");
    }

    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);
        success = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
    }

    if (success) {
      setCopiedCode(code);
      setShowToast({
        message: `${code} copied! Use it at checkout.`,
        type: "success",
      });
      setTimeout(() => {
        setCopiedCode(null);
        setShowToast(null);
      }, 3000);
      onApplyDeal(code, discount, minOrder);
    } else {
      setShowToast({
        message: `Please copy this code manually: ${code}`,
        type: "error",
      });
      setTimeout(() => setShowToast(null), 3000);
      onApplyDeal(code, discount, minOrder);
    }
  };

  return (
    <>
      {showToast && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce transition-all duration-300"
          style={{
            backgroundColor:
              showToast.type === "success" ? "#22c55e" : "#ef4444",
            color: "white",
          }}
        >
          {showToast.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {showToast.message}
        </div>
      )}

      <section className="py-16 bg-linear-to-r from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
          <MotionWrapper variant="fade-up" className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-0.5 w-6 bg-yellow-500" />
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
                Limited Time
              </p>
              <div className="h-0.5 w-6 bg-yellow-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 mb-4">
              Hot Deals & Offers
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Grab these exclusive discounts before they expire!
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <MotionWrapper key={deal.id} variant="fade-up" className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      fill
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-red-500 text-white text-2xl font-bold px-3 py-1 rounded-lg">
                        {deal.discount}%
                      </div>
                      <div className="text-white text-xs mt-1">OFF</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {deal.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {deal.description}
                    </p>
                    {deal.minOrder && (
                      <p className="text-xs text-gray-400 mb-2">
                        Min. order: ${deal.minOrder}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="bg-gray-100 rounded-lg px-3 py-1.5">
                        <code className="font-mono font-bold text-gray-800">
                          {deal.code}
                        </code>
                      </div>
                      <button
                        onClick={() =>
                          copyCode(deal.code, deal.discount, deal.minOrder)
                        }
                        className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold rounded-lg transition active:scale-95"
                      >
                        {copiedCode === deal.code ? "Copied!" : "Copy Code"}
                      </button>
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WishlistSidebar({
  isOpen,
  onClose,
  onAddToCart,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const loadWishlist = () => setWishlistItems(getWishlist());
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const getProductDetails = (productId: string): Product | undefined => {
    return allProducts.find((p) => p.id === productId);
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" /> Wishlist (
            {wishlistItems.length})
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 h-[calc(100%-80px)]">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500">Your wishlist is empty</p>
              <p className="text-sm text-gray-400 mt-1">
                Save your favorite items here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => {
                const product = getProductDetails(item.productId);
                if (!product) return null;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-yellow-600 font-bold">${item.price}</p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onClose();
                          }}
                          className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-lg"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-xs text-red-500 px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState("default");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setDeals(getActiveDeals());
    const updateCartCount = () => {
      const cart = localStorage.getItem("cart");
      const items = cart ? JSON.parse(cart) : [];
      setCartCount(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      );
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

    setProducts(filtered);
  }, [activeCategory, searchQuery, priceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleApplyDeal = (
    code: string,
    discount: number,
    minOrder?: number,
  ) => {
    saveAppliedPromo(code, discount, minOrder);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(/assets/homeImg2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <MotionWrapper variant="fade-up">
            <div className="flex justify-center mb-3">
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Shop Collection
                </p>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white leading-tight">
              Our <span className="text-yellow-500">Shop</span>
            </h1>
            <p className="text-white mt-3 text-base sm:text-lg">
              Discover our curated collection of delicious dishes, from African
              classics to global favorites.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Deals Section */}
      {deals.length > 0 && (
        <DealsSection deals={deals} onApplyDeal={handleApplyDeal} />
      )}

      {/* Search & Filter Bar */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? "bg-yellow-500 text-black shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowWishlist(true)}
                className="relative px-4 py-2 border border-gray-300 rounded-xl hover:border-red-400 transition flex items-center gap-2"
              >
                <Heart className="w-4 h-4" /> Wishlist
              </button>
              <Link
                href="/cart"
                className="relative px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="px-4 py-2 border border-gray-300 rounded-xl hover:border-yellow-400 transition"
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid3x3 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {showFilters && (
            <MotionWrapper
              variant="fade-up"
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="flex flex-wrap gap-6 items-end">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Price Range
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-24 px-2 py-1 border rounded-lg text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-24 px-2 py-1 border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-36 px-2 py-1 border rounded-lg text-sm mt-1"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setPriceRange([0, 50]);
                    setSortBy("default");
                  }}
                  className="px-4 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                >
                  Reset Filters
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {["Spicy", "Vegetarian", "Popular"].map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full hover:border-yellow-400 transition"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </MotionWrapper>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500">Showing {products.length} products</p>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                text: "Free Delivery",
                subtext: "On orders over $50",
              },
              { icon: Clock, text: "30 Min Delivery", subtext: "Fast & Fresh" },
              {
                icon: ShieldCheck,
                text: "Secure Payment",
                subtext: "100% Safe",
              },
              { icon: Gift, text: "Rewards Program", subtext: "Earn points" },
            ].map(({ icon: Icon, text, subtext }, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">{text}</p>
                <p className="text-xs text-gray-400">{subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.88)), url(/assets/homeImg3.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <MotionWrapper variant="fade-up">
            <Sparkles className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
              Ready to Order?
            </h2>
            <p className="text-gray-300 mb-8">
              Browse our menu and place your order for pickup or delivery.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/menu"
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
              >
                Full Menu
              </Link>
              <Link
                href="/cart"
                className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-xl transition"
              >
                View Cart
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Wishlist Sidebar */}
      <WishlistSidebar
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
