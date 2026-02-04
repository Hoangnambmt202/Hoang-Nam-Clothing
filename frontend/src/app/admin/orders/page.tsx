"use client";

import { useState } from "react";
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

export default function OrdersPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const MOCK_ORDERS = [
    {
      id: "ORD-001",
      customer: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0901234567",
      address: "123 Lê Lợi, Q1, HCM",
      date: "2024-02-04",
      time: "14:30",
      total: 1250000,
      status: "pending",
      items: 3,
      paymentMethod: "COD",
    },
    {
      id: "ORD-002",
      customer: "Trần Thị Bình",
      email: "binh.tran@email.com",
      phone: "0912345678",
      address: "456 Nguyễn Huệ, Q1, HCM",
      date: "2024-02-03",
      time: "10:15",
      total: 550000,
      status: "completed",
      items: 2,
      paymentMethod: "Banking",
    },
    {
      id: "ORD-003",
      customer: "Lê Văn Cường",
      email: "cuong.le@email.com",
      phone: "0923456789",
      address: "789 Trần Hưng Đạo, Q5, HCM",
      date: "2024-02-01",
      time: "16:45",
      total: 2100000,
      status: "shipping",
      items: 5,
      paymentMethod: "Momo",
    },
    {
      id: "ORD-004",
      customer: "Phạm Thị Dung",
      email: "dung.pham@email.com",
      phone: "0934567890",
      address: "321 Võ Văn Tần, Q3, HCM",
      date: "2024-01-28",
      time: "09:20",
      total: 890000,
      status: "cancelled",
      items: 1,
      paymentMethod: "COD",
    },
    {
      id: "ORD-005",
      customer: "Hoàng Minh Đức",
      email: "duc.hoang@email.com",
      phone: "0945678901",
      address: "654 Phan Xích Long, Phú Nhuận, HCM",
      date: "2024-02-04",
      time: "11:00",
      total: 1750000,
      status: "processing",
      items: 4,
      paymentMethod: "Banking",
    },
    {
      id: "ORD-006",
      customer: "Võ Thị Em",
      email: "em.vo@email.com",
      phone: "0956789012",
      address: "987 Cách Mạng Tháng 8, Q10, HCM",
      date: "2024-02-02",
      time: "15:30",
      total: 675000,
      status: "completed",
      items: 2,
      paymentMethod: "Momo",
    },
  ];

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
      value: MOCK_ORDERS.length,
      gradient: "from-blue-500 to-indigo-600",
      icon: Package,
    },
    {
      label: "Chờ xử lý",
      value: MOCK_ORDERS.filter((o) => o.status === "pending").length,
      gradient: "from-amber-500 to-orange-600",
      icon: Clock,
    },
    {
      label: "Đang giao",
      value: MOCK_ORDERS.filter((o) => o.status === "shipping").length,
      gradient: "from-purple-500 to-violet-600",
      icon: Truck,
    },
    {
      label: "Hoàn thành",
      value: MOCK_ORDERS.filter((o) => o.status === "completed").length,
      gradient: "from-emerald-500 to-teal-600",
      icon: CheckCircle,
    },
  ];

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesFilter =
      selectedFilter === "all" || order.status === selectedFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => {
            const config =
              statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

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
                                {order.id}
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
                                {order.customer}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Phone size={14} />
                                {order.phone}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {order.date} - {order.time}
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
                        <span className="line-clamp-1">{order.address}</span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="lg:border-l border-slate-100 lg:pl-6 flex lg:flex-col justify-between lg:justify-start gap-4 lg:gap-3 lg:min-w-[200px]">
                      <div className="text-center lg:text-left">
                        <p className="text-sm text-slate-500 mb-1">Tổng tiền</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-sm text-slate-500 mb-1">
                            Sản phẩm
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {order.items}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-500 mb-1">
                            Thanh toán
                          </p>
                          <p className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                            {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <button className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                        <Eye size={18} />
                        <span>Chi tiết</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
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
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị{" "}
              <span className="font-bold text-slate-900">
                {filteredOrders.length}
              </span>{" "}
              đơn hàng
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors">
                Trước
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30">
                1
              </button>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
