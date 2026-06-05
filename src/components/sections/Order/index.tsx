/* eslint-disable react-hooks/set-state-in-effect */
import MotionWrapper from "@/components/ui/MotionWrapper";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { orderTypeConfig, statusConfig } from "@/lib/utils/orderUtils";
import { Order } from "@/types";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Package,
  Receipt,
  ShoppingBag,
  Truck,
  User,
  XCircle,
  MapPin as TrackIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}

export function OrderTrackingSteps({ status }: { status: Order["status"] }) {
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
          <div
            className="h-full bg-yellow-500 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={step.key} className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  isCompleted
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-200 text-gray-400"
                } ${isCurrent ? "ring-4 ring-yellow-200 scale-110" : ""}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs mt-2 font-medium hidden sm:block ${
                  isCompleted ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OrderCard({
  order,
  onClick,
}: {
  order: Order;
  onClick: () => void;
}) {
  const typeConf = orderTypeConfig[order.orderType];
  const TypeIcon = typeConf.icon;
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MotionWrapper variant="fade-up" className="w-full">
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:border-yellow-300 group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition text-sm sm:text-base">
                {order.orderNumber}
              </h3>
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
          <div className="flex items-center gap-1">
            <TypeIcon className="w-4 h-4" />
            <span className="capitalize">
              {order.orderType === "dine-in"
                ? "Dine In"
                : order.orderType === "takeout"
                  ? "Takeout"
                  : "Delivery"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" />
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-gray-400 text-xs">Total:</span>
            <span className="font-bold text-yellow-600">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden relative"
              >
                <Image
                  src={item.image || "/assets/homeImg1.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <button className="text-yellow-500 hover:text-yellow-600 font-medium flex items-center gap-1 text-xs sm:text-sm">
            View Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </MotionWrapper>
  );
}

export function OrderDetailModal({
  order,
  onClose,
  onCancelOrder,
}: {
  order: Order | null;
  onClose: () => void;
  onCancelOrder?: (orderId: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { confirm, modal } = useConfirmModal();
  useEffect(() => {
    if (order) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [order]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCancel = async () => {
    const ok = await confirm({
      title: "Cancel order?",
      message: "Are you sure you want to cancel this order?",
      confirmLabel: "Cancel",
      cancelLabel: "No",
      danger: true,
    });
    if (!ok) return;
    if (order && onCancelOrder) {
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
  const isCancellable =
    order.status === "pending" || order.status === "confirmed";

  return (
    <>
      {modal}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isVisible
            ? "bg-black/60 backdrop-blur-sm"
            : "bg-black/0 pointer-events-none"
        }`}
        onClick={handleClose}
      >
        <div
          className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-gray-900">
                  {order.orderNumber}
                </h2>
                <p className="text-xs text-gray-400">
                  {order.date} at {order.time}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="p-4 sm:p-5 space-y-5 sm:space-y-6">
            <div className="flex flex-wrap gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConf.bg} ${statusConf.color} border ${statusConf.border}`}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {statusConf.label}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${typeConf.bg} text-gray-700`}
              >
                <TypeIcon className="w-4 h-4" />
                <span className="text-sm font-semibold capitalize">
                  {order.orderType === "dine-in"
                    ? "Dine In"
                    : order.orderType === "takeout"
                      ? "Takeout"
                      : "Delivery"}
                </span>
              </div>
            </div>
            {order.status !== "cancelled" && (
              <OrderTrackingSteps status={order.status} />
            )}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-yellow-500" />
                Order Items ({totalItems})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                      <Image
                        src={item.image || "/assets/homeImg1.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-yellow-600 text-sm sm:text-base shrink-0">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-yellow-500" />
                Customer Information
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                  <span className="font-medium text-gray-700 sm:w-24">
                    Name:
                  </span>
                  <span className="text-gray-600 break-all">
                    {order.customerName}
                  </span>
                </p>
                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                  <span className="font-medium text-gray-700 sm:w-24">
                    Email:
                  </span>
                  <span className="text-gray-600 break-all">
                    {order.customerEmail}
                  </span>
                </p>
                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                  <span className="font-medium text-gray-700 sm:w-24">
                    Phone:
                  </span>
                  <span className="text-gray-600">{order.customerPhone}</span>
                </p>
                {order.tableNumber && (
                  <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                    <span className="font-medium text-gray-700 sm:w-24">
                      Table Number:
                    </span>
                    <span className="text-gray-600">{order.tableNumber}</span>
                  </p>
                )}
                {order.deliveryAddress && (
                  <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-sm">
                    <span className="font-medium text-gray-700 sm:w-24">
                      Delivery Address:
                    </span>
                    <span className="text-gray-600 flex-1 break-all">
                      {order.deliveryAddress}
                    </span>
                  </p>
                )}
                {order.specialInstructions && (
                  <p className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-sm">
                    <span className="font-medium text-gray-700 sm:w-24">
                      Special Instructions:
                    </span>
                    <span className="text-gray-600 flex-1 italic break-all">
                      &#39;{order.specialInstructions}&#39;
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-yellow-500" />
                Price Summary
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({order.promoCode || "10%"})</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="text-gray-700">
                      ${order.deliveryFee.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (7.5%)</span>
                  <span className="text-gray-700">${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-yellow-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/order/track/${order.id}`}
                onClick={handleClose}
                className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <TrackIcon className="w-4 h-4" />
                Track Order
              </Link>
              {isCancellable && (
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button
                onClick={() => (window.location.href = "/menu")}
                className="flex-1 py-2.5 border border-gray-300 hover:border-yellow-400 rounded-xl transition flex items-center justify-center gap-2 text-gray-700 hover:text-yellow-600"
              >
                <ShoppingBag className="w-4 h-4" />
                Order Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
