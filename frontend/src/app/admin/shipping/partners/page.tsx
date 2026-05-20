"use client";

import { useState } from "react";

export default function ShippingPartners() {
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Mock data shipping partners
  const partners = [
    {
      id: 1,
      name: "Giao Hàng Nhanh",
      logo: "📦",
      status: "active",
      type: "express",
      rating: 4.8,
      totalShipments: 2453,
      onTimeRate: 96.5,
      avgDeliveryTime: 2.3,
      priceRange: "15,000 - 35,000",
      coverage: "Toàn quốc",
      apiIntegrated: true,
      trackingEnabled: true,
      cod: true,
      insurance: true,
      contactPerson: "Nguyễn Văn A",
      phone: "0901 234 567",
      email: "contact@ghn.vn",
      lastShipment: "2026-02-06",
    },
    {
      id: 2,
      name: "Viettel Post",
      logo: "📮",
      status: "active",
      type: "standard",
      rating: 4.6,
      totalShipments: 1876,
      onTimeRate: 94.2,
      avgDeliveryTime: 3.1,
      priceRange: "12,000 - 28,000",
      coverage: "Toàn quốc",
      apiIntegrated: true,
      trackingEnabled: true,
      cod: true,
      insurance: true,
      contactPerson: "Trần Thị B",
      phone: "0902 345 678",
      email: "support@viettelpost.vn",
      lastShipment: "2026-02-06",
    },
    {
      id: 3,
      name: "J&T Express",
      logo: "🚚",
      status: "active",
      type: "express",
      rating: 4.7,
      totalShipments: 1654,
      onTimeRate: 95.8,
      avgDeliveryTime: 2.5,
      priceRange: "14,000 - 32,000",
      coverage: "Toàn quốc",
      apiIntegrated: true,
      trackingEnabled: true,
      cod: true,
      insurance: false,
      contactPerson: "Lê Văn C",
      phone: "0903 456 789",
      email: "partner@jtexpress.vn",
      lastShipment: "2026-02-05",
    },
    {
      id: 4,
      name: "BEST Express",
      logo: "🏃",
      status: "active",
      type: "economy",
      rating: 4.4,
      totalShipments: 987,
      onTimeRate: 92.3,
      avgDeliveryTime: 3.8,
      priceRange: "10,000 - 25,000",
      coverage: "TP.HCM, Hà Nội",
      apiIntegrated: false,
      trackingEnabled: true,
      cod: true,
      insurance: false,
      contactPerson: "Phạm Thị D",
      phone: "0904 567 890",
      email: "info@best-inc.vn",
      lastShipment: "2026-02-04",
    },
    {
      id: 5,
      name: "Ninja Van",
      logo: "🥷",
      status: "inactive",
      type: "standard",
      rating: 4.3,
      totalShipments: 543,
      onTimeRate: 91.5,
      avgDeliveryTime: 3.2,
      priceRange: "13,000 - 30,000",
      coverage: "Miền Nam",
      apiIntegrated: true,
      trackingEnabled: true,
      cod: true,
      insurance: true,
      contactPerson: "Đỗ Văn E",
      phone: "0905 678 901",
      email: "hello@ninjavan.co",
      lastShipment: "2026-01-15",
    },
  ];

  const stats = [
    {
      label: "Đối tác hoạt động",
      value: "4",
      change: "+1",
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Đơn hàng tháng này",
      value: "1,247",
      change: "+23.5%",
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
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Giao đúng hẹn",
      value: "94.8%",
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Chi phí trung bình",
      value: "₫22.5K",
      change: "-3.2%",
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const typeConfig: Record<string, { label: string; color: string }> = {
    express: {
      label: "Hỏa tốc",
      color: "bg-red-100 text-red-700 border-red-200",
    },
    standard: {
      label: "Tiêu chuẩn",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    economy: {
      label: "Tiết kiệm",
      color: "bg-green-100 text-green-700 border-green-200",
    },
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    active: {
      label: "Hoạt động",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    inactive: {
      label: "Tạm ngưng",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    pending: {
      label: "Chờ duyệt",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

  const filteredPartners = partners.filter(
    (p) => activeTab === "all" || p.status === activeTab,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đối tác vận chuyển
              </h1>
              <p className="text-gray-500 mt-1">
                Quản lý các đơn vị vận chuyển và theo dõi hiệu suất
              </p>
            </div>
            <button
              onClick={() => setShowAddPartner(true)}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm đối tác
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                >
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {[
                { id: "all", label: "Tất cả", count: partners.length },
                {
                  id: "active",
                  label: "Hoạt động",
                  count: partners.filter((p) => p.status === "active").length,
                },
                {
                  id: "inactive",
                  label: "Tạm ngưng",
                  count: partners.filter((p) => p.status === "inactive").length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-semibold transition-colors relative ${
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
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                      {partner.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {partner.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusConfig[partner.status].color}`}
                        >
                          {statusConfig[partner.status].label}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${typeConfig[partner.type].color}`}
                        >
                          {typeConfig[partner.type].label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPartner(partner)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
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
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(partner.rating) ? "text-amber-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">
                      {partner.rating}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">
                      {partner.totalShipments.toLocaleString()}
                    </span>{" "}
                    đơn hàng
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs text-gray-500 font-medium">
                        Giao đúng hẹn
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {partner.onTimeRate}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                      <span className="text-xs text-gray-500 font-medium">
                        Thời gian TB
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {partner.avgDeliveryTime} ngày
                    </p>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Phạm vi:</span>
                    <span className="font-semibold text-gray-900">
                      {partner.coverage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Giá cước:</span>
                    <span className="font-semibold text-gray-900">
                      ₫{partner.priceRange}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Giao gần nhất:</span>
                    <span className="font-semibold text-gray-900">
                      {partner.lastShipment}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  {partner.apiIntegrated && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                      🔌 API
                    </span>
                  )}
                  {partner.trackingEnabled && (
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg border border-purple-100">
                      📍 Tracking
                    </span>
                  )}
                  {partner.cod && (
                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100">
                      💵 COD
                    </span>
                  )}
                  {partner.insurance && (
                    <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-100">
                      🛡️ Bảo hiểm
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                    Xem báo cáo
                  </button>
                  <button className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium">
                    Tạo đơn hàng
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Comparison */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  So sánh hiệu suất
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Đánh giá các đối tác vận chuyển
                </p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Xuất báo cáo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Đối tác
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Đánh giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Đúng hẹn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    TG giao
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Chi phí TB
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners
                  .filter((p) => p.status === "active")
                  .map((partner) => (
                    <tr
                      key={partner.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{partner.logo}</div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {partner.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {partner.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-semibold text-gray-900">
                            {partner.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          {partner.totalShipments.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className={`h-full ${partner.onTimeRate >= 95 ? "bg-emerald-500" : partner.onTimeRate >= 90 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${partner.onTimeRate}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900">
                            {partner.onTimeRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          {partner.avgDeliveryTime} ngày
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          ₫{partner.priceRange.split(" - ")[0]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusConfig[partner.status].color}`}
                        >
                          {statusConfig[partner.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Thêm đối tác vận chuyển
              </h2>
              <button
                onClick={() => setShowAddPartner(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
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
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tên đối tác <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Giao Hàng Nhanh"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Loại dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white">
                    <option>Hỏa tốc</option>
                    <option>Tiêu chuẩn</option>
                    <option>Tiết kiệm</option>
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Người liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0901 234 567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="contact@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>

              {/* Coverage */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phạm vi hoạt động <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Toàn quốc, TP.HCM và Hà Nội"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Giá thấp nhất (₫)
                  </label>
                  <input
                    type="number"
                    placeholder="15000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Giá cao nhất (₫)
                  </label>
                  <input
                    type="number"
                    placeholder="35000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Tính năng hỗ trợ
                </label>
                <div className="space-y-2">
                  {[
                    { id: "api", label: "Tích hợp API" },
                    { id: "tracking", label: "Tracking đơn hàng" },
                    { id: "cod", label: "Thu hộ COD" },
                    { id: "insurance", label: "Bảo hiểm hàng hóa" },
                  ].map((feature) => (
                    <label
                      key={feature.id}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900"
                      />
                      <span className="font-medium text-gray-900">
                        {feature.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddPartner(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                  Thêm đối tác
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết đối tác
              </h2>
              <button
                onClick={() => setSelectedPartner(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
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
              {/* Partner Header */}
              <div className="text-center pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-4">
                  {selectedPartner.logo}
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-2">
                  {selectedPartner.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusConfig[selectedPartner.status].color}`}
                  >
                    {statusConfig[selectedPartner.status].label}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${typeConfig[selectedPartner.type].color}`}
                  >
                    {typeConfig[selectedPartner.type].label}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">
                  Thông tin liên hệ
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Người liên hệ:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {selectedPartner.contactPerson}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Điện thoại:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedPartner.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedPartner.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Hiệu suất</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {selectedPartner.rating}
                    </p>
                    <p className="text-xs text-gray-500">Đánh giá</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {selectedPartner.onTimeRate}%
                    </p>
                    <p className="text-xs text-gray-500">Đúng hẹn</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {selectedPartner.totalShipments}
                    </p>
                    <p className="text-xs text-gray-500">Đơn hàng</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {selectedPartner.avgDeliveryTime}
                    </p>
                    <p className="text-xs text-gray-500">Ngày giao TB</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-4">
                <button className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                  Tạo đơn hàng mới
                </button>
                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Xem báo cáo chi tiết
                </button>
                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                  Chỉnh sửa thông tin
                </button>
                {selectedPartner.status === "active" ? (
                  <button className="w-full py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors font-medium">
                    Tạm ngưng hợp tác
                  </button>
                ) : (
                  <button className="w-full py-3 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors font-medium">
                    Kích hoạt lại
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
