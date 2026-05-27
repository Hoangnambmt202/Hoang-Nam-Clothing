"use client";

import { useState, useEffect, use } from "react";
import { orderApi } from "@/lib/api/order";
import { useAuth } from "@/hooks/useAuth";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  MapPin,
  CreditCard,
  Ban,
  Loader2,
  Calendar,
  Hash,
  ShoppingBag,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { showToast } from "nextjs-toast-notify";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface StatusStep {
  key: OrderStatus;
  label: string;
  icon: React.ElementType;
  activeColor: string;
  activeBg: string;
}

const STATUS_FLOW: StatusStep[] = [
  { key: "PENDING", label: "Chờ xác nhận", icon: Clock, activeColor: "text-amber-600", activeBg: "bg-amber-500" },
  { key: "CONFIRMED", label: "Đã xác nhận", icon: CheckCircle, activeColor: "text-blue-600", activeBg: "bg-blue-500" },
  { key: "PROCESSING", label: "Đang xử lý", icon: Package, activeColor: "text-indigo-600", activeBg: "bg-indigo-500" },
  { key: "SHIPPED", label: "Đang giao", icon: Truck, activeColor: "text-purple-600", activeBg: "bg-purple-500" },
  { key: "DELIVERED", label: "Đã giao hàng", icon: CheckCircle, activeColor: "text-emerald-600", activeBg: "bg-emerald-500" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING: { label: "Chờ xác nhận", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: CheckCircle },
  PROCESSING: { label: "Đang xử lý", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: Package },
  SHIPPED: { label: "Đang giao", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Truck },
  DELIVERED: { label: "Hoàn thành", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertCircle },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
  VNPAY: "VNPay",
  MOMO: "Ví MoMo",
};

const formatCurrency = (amount: number | string) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));

const formatDateTime = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function UserOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { accessToken } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    if (!id || !accessToken) return;
    try {
      setLoading(true);
      const data = await orderApi.getById(id, accessToken);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, accessToken]);

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.")) return;
    setCancelling(true);
    try {
      await orderApi.cancel(id, accessToken || "");
      showToast.success("Đã hủy đơn hàng thành công!", { duration: 2000 });
      fetchOrder();
    } catch (error: any) {
      showToast.error(error?.message || "Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy đơn hàng</h2>
        <Link href="/profile/orders" className="text-blue-600 hover:underline">
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const status: string = order.status || "PENDING";
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const isCancelled = status === "CANCELLED";
  const canCancel = status === "PENDING" || status === "CONFIRMED";

  const currentStepIndex = STATUS_FLOW.findIndex((s) => s.key === status);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/profile/orders"
            className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-sm group"
          >
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-slate-900 transition-colors" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Chi tiết đơn hàng
              <span className="font-mono text-base font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                #{order.id.substring(0, 8).toUpperCase()}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <Calendar size={14} />
              Ngày đặt: {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-5 py-2.5 bg-white border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {cancelling ? <Loader2 size={18} className="animate-spin" /> : <Ban size={18} />}
            Hủy đơn hàng
          </button>
        )}
      </div>

      {/* Progress Bar (Timeline) */}
      {!isCancelled && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6 overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-10 right-10 h-1 bg-slate-100 rounded-full z-0"></div>
              <div
                className="absolute top-5 left-10 h-1 bg-blue-500 rounded-full z-0 transition-all duration-1000"
                style={{
                  width: `${currentStepIndex >= 0 ? (currentStepIndex / (STATUS_FLOW.length - 1)) * (100 - 15) : 0}%`,
                }}
              ></div>

              {STATUS_FLOW.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCurrent = step.key === status;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center gap-3 z-10 relative">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        isCurrent
                          ? `${step.activeBg} border-white text-white shadow-xl ring-4 ring-blue-500/20 scale-110`
                          : isActive
                          ? `${step.activeBg} border-white text-white shadow-md`
                          : "bg-white border-slate-200 text-slate-300"
                      }`}
                    >
                      <StepIcon size={18} />
                    </div>
                    <span
                      className={`text-xs font-bold text-center ${
                        isCurrent ? step.activeColor : isActive ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-red-500" size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-1">Đơn hàng đã bị hủy</h3>
            <p className="text-red-600 text-sm">
              Đơn hàng này đã bị hủy. Nếu bạn đã thanh toán, tiền sẽ được hoàn lại theo quy định của cửa hàng.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Sản phẩm đã đặt</h3>
              <span className="ml-auto text-sm font-semibold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
                {order.items?.length || 0} sản phẩm
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item: any) => {
                const product = item.product || {};
                const variant = item.productVariant || {};
                const image =
                  variant.images?.[0]?.url ||
                  product.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&auto=format&fit=crop&q=60";
                const total = Number(item.price) * item.quantity;

                return (
                  <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 hover:bg-slate-50/50 transition-colors">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      <Image src={image} alt={product.name || "Sản phẩm"} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-2 mb-1.5">
                            {product.name || "Sản phẩm không xác định"}
                          </h4>
                          <p className="text-sm text-slate-500 flex flex-wrap gap-2">
                            {variant.color && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">Màu: {variant.color}</span>
                            )}
                            {variant.size && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">Size: {variant.size}</span>
                            )}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900 whitespace-nowrap">
                          {formatCurrency(total)}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">
                          {formatCurrency(item.price)} x {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Price Summary */}
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3 rounded-b-3xl">
              <div className="flex justify-between text-sm text-slate-600 font-medium">
                <span>Tạm tính</span>
                <span>{formatCurrency(order.subTotal || order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 font-medium">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(order.shippingFee || 0)}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 font-medium">
                  <span>Giảm giá</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="pt-4 mt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900 text-lg">Tổng cộng</span>
                <span className="text-2xl font-black text-blue-600">
                  {formatCurrency(order.finalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md">
                <MapPin size={18} />
              </div>
              Địa chỉ nhận hàng
            </h3>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="font-bold text-slate-900 mb-1">
                {order.shippingAddress?.recipientName}
              </p>
              <p className="text-slate-600 text-sm mb-2 font-medium flex items-center gap-1.5">
                <Phone size={14} className="text-slate-400" />
                {order.shippingAddress?.phone}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                {order.shippingAddress?.addressLine}
                <br />
                {order.shippingAddress?.ward}, {order.shippingAddress?.district}
                <br />
                {order.shippingAddress?.province}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md">
                <CreditCard size={18} />
              </div>
              Thanh toán
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                  Phương thức
                </p>
                <p className="font-semibold text-slate-900 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod || "COD"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                  Trạng thái
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                    order.paymentStatus === "success" || order.paymentStatus === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {order.paymentStatus === "success" || order.paymentStatus === "COMPLETED" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                  {order.paymentStatus === "success" || order.paymentStatus === "COMPLETED"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          {order.shippingMethod && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
                  <Truck size={18} />
                </div>
                Đơn vị vận chuyển
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-900 text-sm mb-1">
                  {order.shippingMethod.name || "Giao hàng tiêu chuẩn"}
                </p>
                {order.shippingMethod.estimatedDays && (
                  <p className="text-slate-500 text-sm">
                    Thời gian dự kiến: {order.shippingMethod.estimatedDays} ngày
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md">
                  <FileText size={18} />
                </div>
                Ghi chú đơn hàng
              </h3>
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                <p className="text-slate-700 text-sm italic">
                  "{order.notes}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
