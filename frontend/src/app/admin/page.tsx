"use client";

import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Calendar,
  Download,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "125.000.000 đ",
      change: "+12.5%",
      changeValue: "+13.5M so với tháng trước",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      isPositive: true,
    },
    {
      title: "Đơn hàng",
      value: "1,543",
      change: "+5.2%",
      changeValue: "+76 đơn hàng mới",
      icon: ShoppingBag,
      gradient: "from-blue-500 to-indigo-600",
      isPositive: true,
    },
    {
      title: "Sản phẩm",
      value: "2,345",
      change: "+2.1%",
      changeValue: "+48 sản phẩm",
      icon: Package,
      gradient: "from-orange-500 to-pink-600",
      isPositive: true,
    },
    {
      title: "Khách hàng mới",
      value: "854",
      change: "-3.2%",
      changeValue: "-28 so với tuần trước",
      icon: Users,
      gradient: "from-purple-500 to-violet-600",
      isPositive: false,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-1001",
      customer: "Nguyễn Văn An",
      avatar: "NA",
      product: "Áo thun Premium",
      amount: "450.000 đ",
      status: "completed",
      time: "5 phút trước",
    },
    {
      id: "ORD-1002",
      customer: "Trần Thị Bình",
      avatar: "TB",
      product: "Quần Jeans Slim",
      amount: "850.000 đ",
      status: "processing",
      time: "12 phút trước",
    },
    {
      id: "ORD-1003",
      customer: "Lê Hoàng Cường",
      avatar: "LC",
      product: "Áo khoác Bomber",
      amount: "1.200.000 đ",
      status: "pending",
      time: "28 phút trước",
    },
    {
      id: "ORD-1004",
      customer: "Phạm Minh Đức",
      avatar: "PD",
      product: "Set đồ thể thao",
      amount: "650.000 đ",
      status: "completed",
      time: "1 giờ trước",
    },
    {
      id: "ORD-1005",
      customer: "Võ Thị Em",
      avatar: "VE",
      product: "Váy maxi hoa",
      amount: "720.000 đ",
      status: "shipping",
      time: "2 giờ trước",
    },
  ];

  const topProducts = [
    { name: "Áo thun Basic", sold: 234, revenue: "35.1M đ", trend: "+12%" },
    { name: "Quần Jeans Slim", sold: 189, revenue: "28.4M đ", trend: "+8%" },
    { name: "Áo khoác Hoodie", sold: 156, revenue: "23.4M đ", trend: "+15%" },
    { name: "Váy hoa nhí", sold: 143, revenue: "21.5M đ", trend: "+5%" },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20",
      processing: "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20",
      pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20",
      shipping: "bg-purple-100 text-purple-700 ring-1 ring-purple-600/20",
    };
    const labels = {
      completed: "Hoàn thành",
      processing: "Đang xử lý",
      pending: "Chờ xác nhận",
      shipping: "Đang giao",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 mt-1 flex items-center gap-2">
              <Calendar size={16} />
              <span>Hôm nay, {new Date().toLocaleDateString("vi-VN")}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-white transition-all flex items-center gap-2 shadow-sm">
              <Download size={18} />
              <span>Xuất báo cáo</span>
            </button>
            <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2">
              <Calendar size={18} />
              <span>Tuần này</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/60 hover:border-slate-300 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        stat.isPositive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stat.isPositive ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      {stat.change}
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mb-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500">{stat.changeValue}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Biểu đồ doanh thu
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Theo dõi xu hướng 30 ngày qua
                </p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="h-72 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl flex items-center justify-center border border-slate-200/60">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto text-blue-500 mb-3" />
                <p className="text-slate-600 font-medium">
                  Biểu đồ đang được cập nhật...
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Dữ liệu sẽ hiển thị ở đây
                </p>
              </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Trung bình/ngày</p>
                <p className="text-xl font-bold text-slate-900">4.2M đ</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Cao nhất</p>
                <p className="text-xl font-bold text-emerald-600">8.5M đ</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Thấp nhất</p>
                <p className="text-xl font-bold text-amber-600">1.8M đ</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Sản phẩm bán chạy
            </h3>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Đã bán {product.sold} sản phẩm
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-sm">
                      {product.revenue}
                    </p>
                    <p className="text-xs text-emerald-600 font-semibold">
                      {product.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Đơn hàng gần đây
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Theo dõi các đơn hàng mới nhất
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline">
                Xem tất cả →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Thời gian
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                          {order.avatar}
                        </div>
                        <span className="font-medium text-slate-900">
                          {order.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.product}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {order.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {order.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
