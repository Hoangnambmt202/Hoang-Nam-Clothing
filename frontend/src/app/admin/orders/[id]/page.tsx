"use client";

import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  Printer,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { orderApi } from "@/lib/api/order";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, use } from "react";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id, accessToken]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getById(id, accessToken || "");
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateStatus = async () => {
    // Implement status update logic here or open a modal
    alert("Chức năng cập nhật trạng thái đang phát triển");
  };

  const statusConfig = {
    pending: {
      label: "Chờ xác nhận",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      icon: Clock,
    },
    confirmed: {
      label: "Đã xác nhận",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: CheckCircle,
    },
    processing: {
      label: "Đang xử lý",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: Package,
    },
    shipping: {
      label: "Đang giao",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      icon: Truck,
    },
    completed: {
      label: "Hoàn thành",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Đã hủy",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      icon: Clock,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Không tìm thấy đơn hàng</div>;
  }

  const statusKey = order.status?.toLowerCase() || 'pending';
  const config = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  const orderDate = new Date(order.createdAt).toLocaleDateString("vi-VN");
  const orderTime = new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
  const customerName = order.user?.fullName || order.shippingAddress?.recipientName || "Khách Vãng Lai";
  const customerPhone = order.shippingAddress?.phone || "N/A";
  const customerEmail = order.user?.email || "N/A";
  const avatar = customerName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="p-3 bg-white border-2 border-slate-100 hover:border-slate-300 rounded-xl text-slate-500 hover:text-slate-700 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  Đơn hàng #{order.id}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${config.bg} ${config.color}`}
                >
                  <StatusIcon size={14} />
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <Calendar size={14} />
                {orderDate} - {orderTime}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm">
              <Printer size={18} />
              In hóa đơn
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25">
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Danh sách sản phẩm</h3>
                <span className="text-sm text-slate-500">
                  {order.items.length} sản phẩm
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {order.items?.map((item: any) => {
                  const product = item.product || {};
                  const variant = item.productVariant || {};
                  const image = product.images?.[0]?.url || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&auto=format&fit=crop&q=60";
                  const total = item.price * item.quantity;
                  
                  return (
                    <div key={item.id} className="p-6 flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <Image
                          src={image}
                          alt={product.name || "Sản phẩm"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">
                              {product.name || "Sản phẩm không xác định"}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1">
                              Phân loại: {variant.color} / {variant.size} | SKU: {variant.sku}
                            </p>
                          </div>
                          <p className="font-bold text-slate-900">
                            {formatCurrency(total)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            {formatCurrency(item.price)} x {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-6 bg-slate-50 border-t-2 border-slate-100 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {formatCurrency(order.finalAmount || order.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    {formatCurrency(order.shippingMethod?.price || 0)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(order.finalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">
                Lịch sử đơn hàng
              </h3>
              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {[
                  {
                    status: "Đơn hàng đã được đặt",
                    time: "14:30 04/02",
                    active: true,
                  },
                  {
                    status: "Đã xác nhận thanh toán",
                    time: "14:35 04/02",
                    active: true,
                  },
                  {
                    status: "Đang đóng gói",
                    time: "15:00 04/02",
                    active: true,
                  },
                  { status: "Đang vận chuyển", time: "---", active: false },
                  {
                    status: "Giao hàng thành công",
                    time: "---",
                    active: false,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-[29px] w-6 h-6 rounded-full border-4 border-white ${step.active ? "bg-blue-600 shadow-md shadow-blue-200" : "bg-slate-300"}`}
                    ></div>
                    <div>
                      <p
                        className={`font-semibold ${step.active ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {step.status}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-slate-500" />
                Thông tin khách hàng
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {customerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Khách hàng thân thiết
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  {customerEmail}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  {customerPhone}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-slate-500" />
                Địa chỉ giao hàng
              </h3>
              <p className="text-slate-700 font-medium mb-1">
                {order.shippingAddress?.addressLine}
              </p>
              <p className="text-sm text-slate-500">
                {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-slate-500" />
                Thanh toán
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Phương thức
                  </p>
                  <p className="font-medium text-slate-900">
                    {order.paymentTransactions?.[0]?.paymentMethod || "COD"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Trạng thái
                  </p>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm mt-1">
                    <CheckCircle size={14} />
                    {order.paymentTransactions?.[0]?.status === "COMPLETED" ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Mã giao dịch
                  </p>
                  <p className="font-mono text-xs text-slate-600 bg-slate-100 p-1.5 rounded mt-1">
                    {order.paymentTransactions?.[0]?.providerTransactionId || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
