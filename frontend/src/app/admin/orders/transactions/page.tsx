"use client";

import { useState } from "react";

export default function TransactionManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data giao dịch
  const transactions = [
    {
      id: "TXN001234",
      orderId: "ORD5678",
      date: "2026-02-05",
      time: "14:30",
      customer: "Nguyễn Văn An",
      email: "anvn@email.com",
      items: 3,
      amount: 2850000,
      status: "completed",
      paymentMethod: "credit_card",
      shippingAddress: "123 Lê Lợi, Quận 1, TP.HCM",
    },
    {
      id: "TXN001233",
      orderId: "ORD5677",
      date: "2026-02-05",
      time: "13:15",
      customer: "Trần Thị Bình",
      email: "binhtt@email.com",
      items: 1,
      amount: 1200000,
      status: "pending",
      paymentMethod: "bank_transfer",
      shippingAddress: "456 Nguyễn Huệ, Quận 5, TP.HCM",
    },
    {
      id: "TXN001232",
      orderId: "ORD5676",
      date: "2026-02-04",
      time: "16:45",
      customer: "Lê Hoàng Cường",
      email: "cuonglh@email.com",
      items: 5,
      amount: 4500000,
      status: "completed",
      paymentMethod: "e_wallet",
      shippingAddress: "789 Trần Hưng Đạo, Quận 3, TP.HCM",
    },
    {
      id: "TXN001231",
      orderId: "ORD5675",
      date: "2026-02-04",
      time: "11:20",
      customer: "Phạm Thu Hà",
      email: "hapt@email.com",
      items: 2,
      amount: 1800000,
      status: "cancelled",
      paymentMethod: "cod",
      shippingAddress: "321 Võ Văn Tần, Quận 10, TP.HCM",
    },
    {
      id: "TXN001230",
      orderId: "ORD5674",
      date: "2026-02-03",
      time: "09:00",
      customer: "Đỗ Minh Tuấn",
      email: "tuandm@email.com",
      items: 4,
      amount: 3200000,
      status: "refunded",
      paymentMethod: "credit_card",
      shippingAddress: "654 Hai Bà Trưng, Quận 1, TP.HCM",
    },
  ];

  const stats = [
    {
      label: "Tổng giao dịch",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      label: "Doanh thu",
      value: "₫87.5M",
      change: "+23.1%",
      trend: "up",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Chờ xử lý",
      value: "23",
      change: "-5.2%",
      trend: "down",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Hoàn tiền",
      value: "8",
      change: "+2.1%",
      trend: "up",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      ),
    },
  ];

  const statusConfig: Record<string, { label: string; color: string }> = {
    completed: {
      label: "Hoàn thành",
      color: "bg-green-400 text-emerald-700 border-emerald-200",
    },
    pending: {
      label: "Chờ xử lý",
      color: "bg-yellow-200 text-amber-700 border-amber-200",
    },
    cancelled: {
      label: "Đã hủy",
      color: "bg-red-300 text-red-700 border-red-200",
    },
    refunded: {
      label: "Đã hoàn tiền",
      color: "bg-blue-300 text-blue-700 border-blue-200",
    },
  };

  const paymentMethodConfig: Record<string, { label: string; icon: string }> = {
    credit_card: { label: "Thẻ tín dụng", icon: "💳" },
    bank_transfer: { label: "Chuyển khoản", icon: "🏦" },
    e_wallet: { label: "Ví điện tử", icon: "📱" },
    cod: { label: "COD", icon: "💵" },
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesTab = activeTab === "all" || txn.status === activeTab;
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý giao dịch
              </h1>
              <p className="text-gray-500 mt-1">
                Theo dõi và quản lý tất cả giao dịch của shop
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Xuất báo cáo
              </button>
              <button className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Tạo giao dịch
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${stat.trend === "down" ? "rotate-180" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                {stat.label}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã giao dịch, đơn hàng hoặc khách hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="custom">Tùy chỉnh</option>
            </select>

            {/* Filter Button */}
            <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Bộ lọc
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: "all", label: "Tất cả", count: transactions.length },
                {
                  id: "completed",
                  label: "Hoàn thành",
                  count: transactions.filter((t) => t.status === "completed")
                    .length,
                },
                {
                  id: "pending",
                  label: "Chờ xử lý",
                  count: transactions.filter((t) => t.status === "pending")
                    .length,
                },
                {
                  id: "cancelled",
                  label: "Đã hủy",
                  count: transactions.filter((t) => t.status === "cancelled")
                    .length,
                },
                {
                  id: "refunded",
                  label: "Hoàn tiền",
                  count: transactions.filter((t) => t.status === "refunded")
                    .length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors relative ${
                    activeTab === tab.id
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Mã giao dịch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Ngày giờ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {txn.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          Đơn: {txn.orderId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {txn.customer}
                        </div>
                        <div className="text-xs text-gray-500">{txn.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{txn.date}</div>
                      <div className="text-xs text-gray-500">{txn.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-700">
                            {txn.items}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">sản phẩm</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {paymentMethodConfig[txn.paymentMethod].icon}
                        </span>
                        <span className="text-sm text-gray-700">
                          {paymentMethodConfig[txn.paymentMethod].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {txn.amount.toLocaleString("vi-VN")}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusConfig[txn.status].color}`}
                      >
                        {statusConfig[txn.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTransaction(txn)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị{" "}
              <span className="font-semibold text-gray-900">
                1-{filteredTransactions.length}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-semibold text-gray-900">
                {transactions.length}
              </span>{" "}
              giao dịch
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Trước
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b overflow-hidden border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Giao dịch{" "}
                {selectedTransaction.id + " - " + selectedTransaction.orderId}
                <p className="text-gray-400 text-base">
                  {selectedTransaction.customer}
                </p>
              </h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Transaction Info */}
              <div className="bg-gray-100 rounded-xl p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Mã giao dịch
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedTransaction.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Mã đơn hàng
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedTransaction.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Ngày giờ
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedTransaction.date} {selectedTransaction.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Trạng thái
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${statusConfig[selectedTransaction.status].color}`}
                    >
                      {statusConfig[selectedTransaction.status].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  Thông tin khách hàng
                </h3>
                <div className="bg-gray-100 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">
                        {selectedTransaction.customer.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedTransaction.customer}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedTransaction.email}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Địa chỉ giao hàng
                    </p>
                    <p className="text-sm text-gray-900">
                      {selectedTransaction.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  Thông tin thanh toán
                </h3>
                <div className="bg-gray-100 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {
                          paymentMethodConfig[selectedTransaction.paymentMethod]
                            .icon
                        }
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {
                            paymentMethodConfig[
                              selectedTransaction.paymentMethod
                            ].label
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          Phương thức thanh toán
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Tạm tính ({selectedTransaction.items} sản phẩm)
                      </span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.amount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-medium text-gray-900">30,000đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-medium text-emerald-600">
                        -30,000đ
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-300 flex justify-between">
                      <span className="font-bold text-gray-900">Tổng cộng</span>
                      <span className="text-xl font-bold text-gray-900">
                        {selectedTransaction.amount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex  gap-3 pt-4">
                <button className="px-4 py-3 border border-gray-400 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium grow">
                  In hóa đơn
                </button>
                <button className="flex justify-center items-center bg-blue-500 text-white gap-1 px-4 py-2 cursor-pointer font-semibold tracking-widest rounded-md hover:bg-blue-400 duration-300 hover:gap-2 hover:translate-x-3 grow">
                  Gửi email
                  <svg
                    className="w-5 h-5"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
