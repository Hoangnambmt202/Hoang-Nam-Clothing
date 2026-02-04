"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

export default function RevenuePage() {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "1.250.000.000 đ",
      change: "+12.5%",
      changeValue: "+138M so với tháng trước",
      isPositive: true,
      icon: DollarSign,
      color: "blue",
    },
    {
      title: "Lợi nhuận ròng",
      value: "350.000.000 đ",
      change: "+8.2%",
      changeValue: "+26.6M so với tháng trước",
      isPositive: true,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      title: "Chi phí vận hành",
      value: "125.000.000 đ",
      change: "-2.4%",
      changeValue: "-3M tiết kiệm được",
      isPositive: true,
      icon: Activity,
      color: "orange",
    },
    {
      title: "Giá trị đơn TB",
      value: "450.000 đ",
      change: "-5.1%",
      changeValue: "-24K so với tháng trước",
      isPositive: false,
      icon: BarChart3,
      color: "purple",
    },
  ];

  const monthlyData = [
    { month: "T1", value: 65, amount: "650M" },
    { month: "T2", value: 59, amount: "590M" },
    { month: "T3", value: 80, amount: "800M" },
    { month: "T4", value: 81, amount: "810M" },
    { month: "T5", value: 56, amount: "560M" },
    { month: "T6", value: 55, amount: "550M" },
    { month: "T7", value: 70, amount: "700M" },
    { month: "T8", value: 85, amount: "850M" },
    { month: "T9", value: 90, amount: "900M" },
    { month: "T10", value: 85, amount: "850M" },
    { month: "T11", value: 95, amount: "950M" },
    { month: "T12", value: 100, amount: "1.0B" },
  ];

  const categories = [
    {
      name: "Áo Thun",
      percent: 45,
      revenue: "562.5M đ",
      color: "blue",
      items: 2840,
    },
    {
      name: "Quần Jeans",
      percent: 30,
      revenue: "375M đ",
      color: "indigo",
      items: 1560,
    },
    {
      name: "Áo Khoác",
      percent: 15,
      revenue: "187.5M đ",
      color: "purple",
      items: 780,
    },
    {
      name: "Phụ Kiện",
      percent: 10,
      revenue: "125M đ",
      color: "slate",
      items: 520,
    },
  ];

  const transactions = [
    {
      id: "TRX-2024001",
      customer: "Nguyễn Văn An",
      date: "04/02/2024",
      time: "14:30",
      amount: 1250000,
      status: "success",
      method: "Banking",
    },
    {
      id: "TRX-2024002",
      customer: "Trần Thị Bình",
      date: "04/02/2024",
      time: "13:15",
      amount: 850000,
      status: "success",
      method: "Momo",
    },
    {
      id: "TRX-2024003",
      customer: "Lê Hoàng Cường",
      date: "04/02/2024",
      time: "11:45",
      amount: 2100000,
      status: "success",
      method: "COD",
    },
    {
      id: "TRX-2024004",
      customer: "Phạm Minh Đức",
      date: "03/02/2024",
      time: "16:20",
      amount: 675000,
      status: "pending",
      method: "Banking",
    },
    {
      id: "TRX-2024005",
      customer: "Võ Thị Em",
      date: "03/02/2024",
      time: "10:05",
      amount: 1450000,
      status: "success",
      method: "Momo",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      ring: "ring-blue-100",
    },
    emerald: {
      bg: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
      ring: "ring-emerald-100",
    },
    orange: {
      bg: "bg-orange-500",
      light: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      ring: "ring-orange-100",
    },
    purple: {
      bg: "bg-purple-500",
      light: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
      ring: "ring-purple-100",
    },
    indigo: {
      bg: "bg-indigo-500",
      light: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-200",
      ring: "ring-indigo-100",
    },
    slate: {
      bg: "bg-slate-500",
      light: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
      ring: "ring-slate-100",
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Báo cáo doanh thu
            </h1>
            <p className="text-slate-600 mt-1">
              Thống kê chi tiết tình hình kinh doanh
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm hover:shadow">
              <Calendar size={18} />
              <span>Tháng này</span>
            </button>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25">
              <Download size={18} />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const colors =
              colorClasses[stat.color as keyof typeof colorClasses];

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${colors.light} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 ${
                      stat.isPositive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    } rounded-full text-xs font-bold`}
                  >
                    {stat.isPositive ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-slate-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.changeValue}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Biểu đồ doanh thu 2024
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Theo dõi xu hướng hàng tháng
                </p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Chart */}
            <div className="h-80 flex items-end justify-between gap-2">
              {monthlyData.map((data, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-3 group"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-lg transition-all cursor-pointer relative group"
                      style={{ height: `${data.value * 2.8}px` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        {data.amount}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-slate-100">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Trung bình</p>
                <p className="text-xl font-bold text-slate-900">750M đ</p>
              </div>
              <div className="text-center border-x-2 border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Cao nhất</p>
                <p className="text-xl font-bold text-emerald-600">1.0B đ</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-1">Thấp nhất</p>
                <p className="text-xl font-bold text-orange-600">550M đ</p>
              </div>
            </div>
          </div>

          {/* Category Revenue */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Theo danh mục
                </h3>
                <p className="text-sm text-slate-500 mt-1">Phân bổ doanh thu</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <PieChart size={20} className="text-purple-600" />
              </div>
            </div>

            <div className="space-y-5">
              {categories.map((item, idx) => {
                const colors =
                  colorClasses[item.color as keyof typeof colorClasses];
                return (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${colors.bg} rounded-full`} />
                        <span className="text-sm font-semibold text-slate-700">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {item.percent}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${colors.bg} transition-all duration-500`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{item.items} sản phẩm</span>
                      <span className="font-semibold">{item.revenue}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t-2 border-slate-100">
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  Danh mục hàng đầu
                </p>
                <p className="text-2xl font-bold text-blue-900">562.5M đ</p>
                <p className="text-xs text-blue-600 mt-1">
                  Áo Thun - Tháng 12/2024
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Giao dịch gần đây
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Danh sách giao dịch mới nhất
              </p>
            </div>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm group">
              Xem tất cả
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Mã GD
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Phương thức
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {tx.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {tx.customer}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        <div className="font-medium">{tx.date}</div>
                        <div className="text-xs text-slate-500">{tx.time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        {tx.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          tx.status === "success"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                        }`}
                      >
                        {tx.status === "success" ? "Thành công" : "Đang xử lý"}
                      </span>
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
