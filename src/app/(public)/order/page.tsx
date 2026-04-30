"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Receipt,
  ChevronRight,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { Order, OrderStatus, OrderType } from "@/types";
import { OrderCard, OrderDetailModal } from "@/components/sections/Order";
import { useOrderStore } from "@/store/useOrderStore";

export default function OrdersPage() {
  const { orders, cancelOrder } = useOrderStore();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [filterType, setFilterType] = useState<OrderType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesType = filterType === "all" || order.orderType === filterType;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  // group filtered orders by date
  const groupedByDate = filteredOrders.reduce(
    (acc, order) => {
      if (!acc[order.date]) acc[order.date] = [];
      acc[order.date].push(order);
      return acc;
    },
    {} as Record<string, Order[]>
  );

  return (
    <main className="bg-gray-50 min-h-screen pb-16">

      {/* HERO */}
      <section className="relative min-h-[30vh] sm:min-h-[35vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.80)), url(/assets/homeImg1.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center px-4 sm:px-6 py-12">
          <MotionWrapper variant="fade-up">
            <div className="flex justify-center mb-3">
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
                <p className="text-yellow-400 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
                  Order Management
                </p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-serif text-white leading-tight">
              Your <span className="text-yellow-500">Orders</span>
            </h1>
            <p className="text-white mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg max-w-md sm:max-w-none mx-auto px-4">
              Track and manage all your restaurant orders in one place.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 sm:px-6 md:px-16 lg:px-20 -mt-8 sm:-mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
            {[
              { label: "Total", value: stats.total, color: "text-yellow-500" },
              { label: "Pending", value: stats.pending, color: "text-yellow-500" },
              { label: "Preparing", value: stats.preparing, color: "text-orange-500" },
              { label: "Delivered", value: stats.delivered, color: "text-emerald-500" },
              { label: "Cancelled", value: stats.cancelled, color: "text-red-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-4 text-center">
                <p className={`text-lg sm:text-2xl font-black ${color}`}>{value}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="py-6 sm:py-12 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-6 sm:mb-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order #, name, or dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "all")}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-yellow-400 text-xs sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as OrderType | "all")}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-yellow-400 text-xs sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="dine-in">Dine In</option>
                <option value="takeout">Takeout</option>
                <option value="delivery">Delivery</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl hover:border-yellow-400 transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ORDERS LIST */}
      <section className="pb-12 sm:pb-20 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {filteredOrders.length === 0 ? (
            <MotionWrapper variant="fade-up" className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">No orders found</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6">
                {orders.length === 0 ? "You haven't placed any orders yet." : "Try adjusting your filters."}
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse Menu
              </Link>
            </MotionWrapper>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedByDate).map(([date, dateOrders]) => (
                <div key={date}>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {dateOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onClick={() => setSelectedOrder(order)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EMPTY STATE CTA */}
      {orders.length === 0 && (
        <section className="relative py-12 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20 overflow-hidden">
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
              <p className="text-yellow-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 sm:mb-3">
                Hungry?
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif text-white mb-3 sm:mb-5">
                Place Your First Order
              </h2>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
                Explore our diverse menu featuring African specialties and global favorites.
              </p>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg text-sm sm:text-base"
              >
                Explore Menu <ChevronRight className="w-4 h-4" />
              </Link>
            </MotionWrapper>
          </div>
        </section>
      )}

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancelOrder={cancelOrder}
      />

      {orders.length > 0 && (
        <Link
          href="/menu"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
      )}
    </main>
  );
}