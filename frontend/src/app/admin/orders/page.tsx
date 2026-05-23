"use client";

import { useState, useEffect } from "react";
import { orderApi } from "@/lib/api/order";
import { useAuth } from "@/hooks/useAuth";
import {
  Eye,
  Search,
  Filter,
  Download,
  MoreVertical,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  DollarSign,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { user, accessToken } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderApi.getAll({ page: pagination.currentPage, limit: 10 }, accessToken || "");
        if (data && data.orders) {
          setOrders(data.orders);
          setPagination({
            total: data.total,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
          });
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchOrders();
  }, [pagination.currentPage, accessToken]);

  // MOCK_ORDERS is replaced by state `orders`

  const statusConfig = {
    pending: {
      label: "Chờ xử lý",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-100",
      text: "text-amber-700",
      ring: "ring-amber-600/20",
      icon: Clock,
    },
    processing: {
      label: "Đang xử lý",
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-100",
      text: "text-blue-700",
      ring: "ring-blue-600/20",
      icon: Package,
    },
    shipping: {
      label: "Đang giao",
      color: "from-purple-500 to-violet-600",
      bg: "bg-purple-100",
      text: "text-purple-700",
      ring: "ring-purple-600/20",
      icon: Truck,
    },
    completed: {
      label: "Hoàn thành",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      ring: "ring-emerald-600/20",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Đã hủy",
      color: "from-red-500 to-rose-600",
      bg: "bg-red-100",
      text: "text-red-700",
      ring: "ring-red-600/20",
      icon: XCircle,
    },
  };

  const stats = [
    {
      label: "Tổng đơn hàng",
      value: pagination.total,
      gradient: "from-blue-500 to-indigo-600",
      icon: Package,
    },
    {
      label: "Chờ xử lý",
      value: orders.filter((o) => o.status === "PENDING").length,
      gradient: "from-amber-500 to-orange-600",
      icon: Clock,
    },
    {
      label: "Đang giao",
      value: orders.filter((o) => o.status === "SHIPPED").length,
      gradient: "from-purple-500 to-violet-600",
      icon: Truck,
    },
    {
      label: "Hoàn thành",
      value: orders.filter((o) => o.status === "DELIVERED").length,
      gradient: "from-emerald-500 to-teal-600",
      icon: CheckCircle,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.status?.toLowerCase() || "";
    const matchesFilter =
      selectedFilter === "all" || orderStatus === selectedFilter.toLowerCase();
    const customerName = order.shippingAddress?.recipientName || "Khách Vãng Lai";
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Quản lý đơn hàng
            </h1>
            <p className="text-slate-600 mt-2 flex items-center gap-2">
              <Calendar size={16} />
              Theo dõi và xử lý đơn hàng
            </p>
          </div>
          <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2">
            <Download size={20} />
            <span>Xuất báo cáo</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                "all",
                "pending",
                "processing",
                "shipping",
                "completed",
                "cancelled",
              ].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedFilter === filter
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter === "all"
                    ? "Tất cả"
                    : statusConfig[filter as keyof typeof statusConfig].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => {
            const statusKey = order.status?.toLowerCase() === 'shipped' ? 'shipping' : 
                              order.status?.toLowerCase() === 'delivered' ? 'completed' : 
                              order.status?.toLowerCase() || 'pending';
            const config =
              statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = config.icon;
            
            const totalQuantity = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
            const orderDate = new Date(order.createdAt).toLocaleDateString("vi-VN");
            const orderTime = new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
            const customerName = order.shippingAddress?.recipientName || "Khách Vãng Lai";
            const customerPhone = order.shippingAddress?.phone || "N/A";
            const address = `${order.shippingAddress?.addressLine || ''}, ${order.shippingAddress?.ward || ''}, ${order.shippingAddress?.district || ''}, ${order.shippingAddress?.province || ''}`;

            return (
              <div
                key={order.id}
                className="group bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Order Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 bg-gradient-to-br ${config.color} rounded-xl shadow-lg`}
                          >
                            <StatusIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {order.id.substring(0, 8).toUpperCase()}...
                              </h3>
                              <span
                                className={`px-3 py-1.5 ${config.bg} ${config.text} rounded-full text-xs font-bold ring-1 ${config.ring}`}
                              >
                                {config.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <User size={14} />
                                {customerName}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Phone size={14} />
                                {customerPhone}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {orderDate} - {orderTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreVertical size={20} className="text-slate-400" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <MapPin
                          size={16}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <span className="line-clamp-1">{address}</span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="lg:border-l border-slate-100 lg:pl-6 flex lg:flex-col justify-between lg:justify-start gap-4 lg:gap-3 lg:min-w-[200px]">
                        <div className="text-center lg:text-left">
                        <p className="text-sm text-slate-500 mb-1">Tổng tiền</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatCurrency(Number(order.finalAmount))}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-sm text-slate-500 mb-1">
                            Sản phẩm
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {totalQuantity}
                          </p>
                        </div>
                        {order.paymentTransactions?.[0] && (
                          <div className="text-center">
                            <p className="text-sm text-slate-500 mb-1">
                              Thanh toán
                            </p>
                            <p className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                              {order.paymentTransactions[0].paymentMethod || "COD"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                      >
                        <Eye size={18} />
                        <span>Chi tiết</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/60">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-slate-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị{" "}
              <span className="font-bold text-slate-900">
                {filteredOrders.length}
              </span>{" "}
              đơn hàng (Trang {pagination.currentPage}/{pagination.totalPages})
            </div>
            <div className="flex gap-2">
              <button 
                disabled={pagination.currentPage === 1}
                onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50">
                Trước
              </button>
              <button 
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
