// app/orders/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag, Clock, CheckCircle, Truck, XCircle,
  Package, MapPin, Calendar, CreditCard, Receipt,
  ChevronRight, Search, Filter, User,
  ArrowLeft, Star,
} from "lucide-react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { getOrders, cancelOrder, type Order } from "@/app/utils/orderUtils";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", step: 0 },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", step: 1 },
  preparing: { label: "Preparing", icon: Package, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", step: 2 },
  ready: { label: "Ready", icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", step: 3 },
  delivered: { label: "Delivered", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", step: 4 },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", step: -1 },
};

const orderTypeConfig = {
  "dine-in": { label: "Dine In", icon: MapPin, color: "text-purple-600", bg: "bg-purple-50" },
  "takeout": { label: "Takeout", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  "delivery": { label: "Delivery", icon: Truck, color: "text-green-600", bg: "bg-green-50" },
};

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}

function OrderTrackingSteps({ status }: { status: Order["status"] }) {
  const steps = [
    { label: "Order Placed", icon: Receipt, key: "pending" },
    { label: "Confirmed", icon: CheckCircle, key: "confirmed" },
    { label: "Preparing", icon: Package, key: "preparing" },
    { label: "Ready", icon: ShoppingBag, key: "ready" },
    { label: "Delivered", icon: Truck, key: "delivered" },
  ];

  const currentStep = statusConfig[status].step;
  if (currentStep === -1) return null;

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
        </div>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={step.key} className="relative flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isCompleted ? "bg-yellow-500 text-black" : "bg-gray-200 text-gray-400"} ${isCurrent ? "ring-4 ring-yellow-200 scale-110" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block ${isCompleted ? "text-gray-700" : "text-gray-400"}`}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const typeConf = orderTypeConfig[order.orderType];
  const TypeIcon = typeConf.icon;
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MotionWrapper variant="fade-up" className="w-full">
      <div onClick={onClick} className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:border-yellow-300 group">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition text-sm sm:text-base">{order.orderNumber}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{order.date}</span>
                <Clock className="w-3 h-3 ml-1" />
                <span>{order.time}</span>
              </div>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1"><TypeIcon className="w-4 h-4" /><span className="capitalize">{order.orderType === "dine-in" ? "Dine In" : order.orderType === "takeout" ? "Takeout" : "Delivery"}</span></div>
          <div className="flex items-center gap-1"><ShoppingBag className="w-4 h-4" /><span>{totalItems} {totalItems === 1 ? "item" : "items"}</span></div>
          <div className="flex items-center gap-1 ml-auto"><span className="text-gray-400 text-xs">Total:</span><span className="font-bold text-yellow-600">${order.total.toFixed(2)}</span></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                <img src={item.image || "/assets/homeImg1.jpg"} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ))}
            {order.items.length > 3 && <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">+{order.items.length - 3}</div>}
          </div>
          <button className="text-yellow-500 hover:text-yellow-600 font-medium flex items-center gap-1 text-xs sm:text-sm">View Details <ChevronRight className="w-3 h-3" /></button>
        </div>
      </div>
    </MotionWrapper>
  );
}

function OrderDetailModal({ order, onClose, onCancelOrder }: { order: Order | null; onClose: () => void; onCancelOrder?: (orderId: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (order) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [order]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCancel = () => {
    if (order && onCancelOrder && confirm("Are you sure you want to cancel this order?")) {
      onCancelOrder(order.id);
      handleClose();
    }
  };

  if (!order) return null;

  const statusConf = statusConfig[order.status];
  const typeConf = orderTypeConfig[order.orderType];
  const TypeIcon = typeConf.icon;
  const StatusIcon = statusConf.icon;
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const isCancellable = order.status === "pending" || order.status === "confirmed";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0 pointer-events-none"}`} onClick={handleClose}>
      <div className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0"><Receipt className="w-5 h-5 text-yellow-600" /></div>
            <div><h2 className="font-bold text-base sm:text-lg text-gray-900">{order.orderNumber}</h2><p className="text-xs text-gray-400">{order.date} at {order.time}</p></div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition shrink-0">✕</button>
        </div>
        <div className="p-4 sm:p-5 space-y-5 sm:space-y-6">
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConf.bg} ${statusConf.color} border ${statusConf.border}`}><StatusIcon className="w-4 h-4" /><span className="text-sm font-semibold">{statusConf.label}</span></div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${typeConf.bg} text-gray-700`}><TypeIcon className="w-4 h-4" /><span className="text-sm font-semibold capitalize">{order.orderType === "dine-in" ? "Dine In" : order.orderType === "takeout" ? "Takeout" : "Delivery"}</span></div>
          </div>
          {order.status !== "cancelled" && <OrderTrackingSteps status={order.status} />}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-yellow-500" />Order Items ({totalItems})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0"><img src={item.image || "/assets/homeImg1.jpg"} alt={item.name} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</p><p className="text-xs text-gray-400">Quantity: {item.quantity}</p></div>
                  <p className="font-bold text-yellow-600 text-sm sm:text-base shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-yellow-500" />Customer Information</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm"><span className="font-medium text-gray-700 sm:w-24">Name:</span><span className="text-gray-600 break-all">{order.customerName}</span></p>
              <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm"><span className="font-medium text-gray-700 sm:w-24">Email:</span><span className="text-gray-600 break-all">{order.customerEmail}</span></p>
              <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm"><span className="font-medium text-gray-700 sm:w-24">Phone:</span><span className="text-gray-600">{order.customerPhone}</span></p>
              {order.tableNumber && <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm"><span className="font-medium text-gray-700 sm:w-24">Table Number:</span><span className="text-gray-600">{order.tableNumber}</span></p>}
              {order.deliveryAddress && <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-sm"><span className="font-medium text-gray-700 sm:w-24">Delivery Address:</span><span className="text-gray-600 flex-1 break-all">{order.deliveryAddress}</span></p>}
              {order.specialInstructions && <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-sm"><span className="font-medium text-gray-700 sm:w-24">Special Instructions:</span><span className="text-gray-600 flex-1 italic break-all">"{order.specialInstructions}"</span></p>}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-yellow-500" />Price Summary</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-700">${order.subtotal.toFixed(2)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount (10%)</span><span>-${order.discount.toFixed(2)}</span></div>}
              {order.deliveryFee > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery Fee</span><span className="text-gray-700">${order.deliveryFee.toFixed(2)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tax (7.5%)</span><span className="text-gray-700">${order.tax.toFixed(2)}</span></div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold"><span className="text-gray-900">Total</span><span className="text-yellow-600">${order.total.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {isCancellable && <button onClick={handleCancel} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"><XCircle className="w-4 h-4" />Cancel Order</button>}
            <button onClick={() => window.location.href = "/menu"} className="flex-1 py-2.5 border border-gray-300 hover:border-yellow-400 rounded-xl transition flex items-center justify-center gap-2 text-gray-700 hover:text-yellow-600"><ShoppingBag className="w-4 h-4" />Order Again</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = () => {
    setIsLoading(true);
    const loadedOrders = getOrders();
    setOrders(loadedOrders);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
    
    const handleOrderPlaced = () => {
      loadOrders();
    };
    
    const handleOrdersUpdated = () => {
      loadOrders();
    };
    
    window.addEventListener("orderPlaced", handleOrderPlaced);
    window.addEventListener("ordersUpdated", handleOrdersUpdated);
    
    return () => {
      window.removeEventListener("orderPlaced", handleOrderPlaced);
      window.removeEventListener("ordersUpdated", handleOrdersUpdated);
    };
  }, []);

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
    loadOrders();
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesType = filterType === "all" || order.orderType === filterType;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <section className="relative min-h-[30vh] sm:min-h-[35vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.70), rgba(0,0,0,0.80)), url(/assets/homeImg1.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative z-10 text-center px-4 sm:px-6 py-12">
          <MotionWrapper variant="fade-up">
            <div className="flex justify-center mb-3"><div className="bg-yellow-500/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5"><p className="text-yellow-400 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2"><Receipt className="w-3 h-3 sm:w-4 sm:h-4" />Order Management</p></div></div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-serif text-white leading-tight">Your <span className="text-yellow-500">Orders</span></h1>
            <p className="text-white mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg max-w-md sm:max-w-none mx-auto px-4">Track and manage all your restaurant orders in one place.</p>
          </MotionWrapper>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-16 lg:px-20 -mt-8 sm:-mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-4 text-center"><p className="text-lg sm:text-2xl font-black text-yellow-500">{stats.total}</p><p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Total</p></div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-4 text-center"><p className="text-lg sm:text-2xl font-black text-yellow-500">{stats.pending}</p><p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Pending</p></div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-4 text-center"><p className="text-lg sm:text-2xl font-black text-orange-500">{stats.preparing}</p><p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Preparing</p></div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-4 text-center"><p className="text-lg sm:text-2xl font-black text-emerald-500">{stats.delivered}</p><p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Delivered</p></div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-4 text-center"><p className="text-lg sm:text-2xl font-black text-red-500">{stats.cancelled}</p><p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Cancelled</p></div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-12 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-6 sm:mb-8">
            <div className="relative w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /><input type="text" placeholder="Search by order #, name, or dish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition text-sm sm:text-base" /></div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-yellow-400 text-xs sm:text-sm"><option value="all">All Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="preparing">Preparing</option><option value="ready">Ready</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-yellow-400 text-xs sm:text-sm"><option value="all">All Types</option><option value="dine-in">Dine In</option><option value="takeout">Takeout</option><option value="delivery">Delivery</option></select>
              <button onClick={() => setShowFilters(!showFilters)} className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-xl hover:border-yellow-400 transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"><Filter className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Filters</span></button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-20 px-4 sm:px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : filteredOrders.length === 0 ? (
            <MotionWrapper variant="fade-up" className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"><ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" /></div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">No orders found</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6">{orders.length === 0 ? "You haven't placed any orders yet." : "Try adjusting your filters."}</p>
              <Link href="/menu" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition text-sm sm:text-base"><ArrowLeft className="w-4 h-4" />Browse Menu</Link>
            </MotionWrapper>
          ) : (
            <div className="space-y-8">
              {Object.entries(filteredOrders.reduce((acc, order) => { const date = order.date; if (!acc[date]) acc[date] = []; acc[date].push(order); return acc; }, {} as Record<string, Order[]>)).map(([date, dateOrders]) => (
                <div key={date}>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">{dateOrders.map((order) => (<OrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />))}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {!isLoading && orders.length === 0 && (
        <section className="relative py-12 sm:py-20 px-4 sm:px-6 md:px-16 lg:px-20 overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.88)), url(/assets/homeImg3.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <MotionWrapper variant="fade-up">
              <p className="text-yellow-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 sm:mb-3">Hungry?</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif text-white mb-3 sm:mb-5">Place Your First Order</h2>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-4">Explore our diverse menu featuring African specialties and global favorites.</p>
              <Link href="/menu" className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg text-sm sm:text-base">Explore Menu <ChevronRight className="w-4 h-4" /></Link>
            </MotionWrapper>
          </div>
        </section>
      )}

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onCancelOrder={handleCancelOrder} />

      {orders.length > 0 && (
        <Link href="/menu" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 hover:scale-110"><ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" /></Link>
      )}
    </main>
  );
}