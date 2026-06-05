import MotionWrapper from "@/components/ui/MotionWrapper";
import { allProducts } from "@/lib/data/shopData";
import {
  addToCart,
  addToWishlist,
  getWishlist,
  isInWishlist,
  removeFromWishlist,
} from "@/lib/utils/shopUtils";
import { Deal, Product, WishlistItem } from "@/types/shop.types";
import {
  AlertCircle,
  Check,
  Eye,
  Flame,
  Heart,
  Leaf,
  Percent,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function ProductCard({
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isWishlisted
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

export function DealsSection({
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

export function WishlistSidebar({
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
                      <p className="text-yellow-600 font-bold">
                        ₦{item.price.toLocaleString()}
                      </p>
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
