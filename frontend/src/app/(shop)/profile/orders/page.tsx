"use client";

import { useState, useEffect } from "react";
import { orderApi } from "@/lib/api/order";
import { useAuth } from "@/hooks/useAuth";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  Eye,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  Loader2,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  PENDING: { label: "Chờ xác nhận", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: CheckCircle },
  PROCESSING: { label: "Đang xử lý", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: Package },
  SHIPPED: { label: "Đang giao", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Truck },
  DELIVERED: { label: "Hoàn thành", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertCircle },
};

const formatCurrency = (amount: number | string) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function UserOrdersPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, currentPage: 1, totalPages: 1 });
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const fetchOrders = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const data = await orderApi.getMyOrders({ page: pagination.currentPage, limit: 10 }, accessToken);
      if (data && data.orders) {
        setOrders(data.orders);
        setPagination({
          total: data.total,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, accessToken]);

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === "ALL") return true;
    return order.status === selectedFilter;
  });

  const FILTERS = [
    { key: "ALL", label: "Tất cả đơn" },
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "PROCESSING", label: "Đang xử lý" },
    { key: "SHIPPED", label: "Đang giao" },
    { key: "DELIVERED", label: "Hoàn thành" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <ShoppingBag className="text-blue-600" size={32} />
          Đơn hàng của tôi
        </h1>
        <p className="mt-2 text-slate-500">Quản lý và theo dõi trạng thái các đơn hàng bạn đã đặt.</p>
      </div>

      {/* Filters (Horizontal Scrollable) */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setSelectedFilter(filter.key)}
            className={`px-5 py-2.5 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm border ${
              selectedFilter === filter.key
                ? "bg-slate-900 text-white border-slate-900 shadow-slate-900/20 hover:bg-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-500 font-medium">Đang tải danh sách đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 shadow-sm rounded-3xl">
          <Package className="w-20 h-20 text-slate-200 mx-auto mb-5" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có đơn hàng</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Bạn chưa có đơn hàng nào {selectedFilter !== "ALL" && "trong trạng thái này"}. Hãy khám phá các sản phẩm mới của chúng tôi nhé!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20"
          >
            Tiếp tục mua sắm
            <ChevronRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const status: string = order.status || "PENDING";
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
            const Icon = config.icon;

            const totalQuantity = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

            return (
              <div
                key={order.id}
                className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200"
              >
                {/* Card Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between transition-colors group-hover:bg-blue-50/30">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">
                        Mã đơn hàng
                      </p>
                      <p className="font-bold text-slate-900 font-mono text-sm">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">
                        Ngày đặt
                      </p>
                      <p className="font-medium text-slate-900 text-sm flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-0.5">
                        Tổng tiền
                      </p>
                      <p className="font-bold text-blue-600 text-sm">
                        {formatCurrency(order.finalAmount)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold border ${config.bg} ${config.color}`}
                  >
                    <Icon size={14} />
                    {config.label}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6">
                  {order.items && order.items.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200">
                        {(() => {
                          const image =
                            order.items[0].productVariant?.images?.[0]?.url ||
                            order.items[0].product?.images?.[0]?.url;
                          return image ? (
                            <Image
                              src={image}
                              alt={order.items[0].product?.name || "Product"}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              No Image
                            </div>
                          );
                        })()}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-slate-900 text-base line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                          {order.items[0].product?.name || "Sản phẩm không xác định"}
                        </h4>
                        <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                            {order.items[0].productVariant?.color || "Mặc định"}
                          </span>
                          {order.items[0].productVariant?.size && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                              Size: {order.items[0].productVariant.size}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <p className="text-sm font-medium text-slate-600">
                            Số lượng: <span className="font-bold text-slate-900">{order.items[0].quantity}</span>
                          </p>
                          <p className="font-semibold text-slate-900">
                            {formatCurrency(order.items[0].price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Summary Bar */}
                  <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-500">
                      {order.items && order.items.length > 1 ? (
                        <span>
                          Và <strong className="text-slate-900">{totalQuantity - order.items[0].quantity}</strong> sản phẩm khác...
                        </span>
                      ) : (
                        <span>Tổng 1 sản phẩm</span>
                      )}
                    </div>
                    <Link
                      href={`/profile/orders/${order.id}`}
                      className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Eye size={18} />
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            className="px-5 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all"
          >
            Trang trước
          </button>
          <span className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg">
            {pagination.currentPage} / {pagination.totalPages}
          </span>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            className="px-5 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}
