"use client";

import { useState } from "react";

export default function EmailMarketing() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");

  // Mock data campaigns
  const campaigns = [
    {
      id: 1,
      name: "Flash Sale Cuối Tuần",
      subject: "⚡ FLASH SALE 50% - Chỉ 48h duy nhất!",
      status: "sent",
      sent: 15234,
      opened: 8456,
      clicked: 2341,
      revenue: 45600000,
      date: "2026-02-01",
      template: "sale",
      audience: "all_customers",
    },
    {
      id: 2,
      name: "Bộ Sưu Tập Xuân 2026",
      subject: "🌸 BST Xuân 2026 - Tươi mới đón Tết",
      status: "scheduled",
      scheduled: "2026-02-10 09:00",
      audience: "vip_customers",
      template: "collection",
      recipients: 5432,
    },
    {
      id: 3,
      name: "Chăm Sóc Khách Hàng",
      subject: "Cảm ơn bạn đã mua sắm tại FashionStore",
      status: "draft",
      lastEdit: "2026-02-05",
      template: "thankyou",
      audience: "recent_buyers",
    },
    {
      id: 4,
      name: "Giới Thiệu Sản Phẩm Mới",
      subject: "✨ Ra mắt: Dòng Áo Khoác Cao Cấp",
      status: "sent",
      sent: 12890,
      opened: 6234,
      clicked: 1876,
      revenue: 28900000,
      date: "2026-01-25",
      template: "product_launch",
      audience: "engaged_users",
    },
  ];

  const templates = [
    {
      id: 1,
      name: "Flash Sale",
      category: "Promotional",
      thumbnail: "🔥",
      description: "Mẫu email khuyến mãi nhanh với countdown timer",
    },
    {
      id: 2,
      name: "Bộ Sưu Tập Mới",
      category: "Product",
      thumbnail: "✨",
      description: "Giới thiệu bộ sưu tập thời trang mới",
    },
    {
      id: 3,
      name: "Giỏ Hàng Bỏ Quên",
      category: "Automation",
      thumbnail: "🛒",
      description: "Nhắc nhở khách hàng hoàn tất đơn hàng",
    },
    {
      id: 4,
      name: "Chúc Mừng Sinh Nhật",
      category: "Relationship",
      thumbnail: "🎂",
      description: "Email chúc mừng sinh nhật kèm ưu đãi",
    },
    {
      id: 5,
      name: "Newsletter",
      category: "Content",
      thumbnail: "📰",
      description: "Bản tin định kỳ về xu hướng thời trang",
    },
    {
      id: 6,
      name: "Chương Trình Loyalty",
      category: "Relationship",
      thumbnail: "⭐",
      description: "Email về điểm thưởng và quyền lợi",
    },
  ];

  const audiences = [
    { id: "all_customers", name: "Tất cả khách hàng", count: 15234 },
    { id: "vip_customers", name: "Khách hàng VIP", count: 5432 },
    { id: "recent_buyers", name: "Mua hàng gần đây", count: 3421 },
    { id: "engaged_users", name: "Người dùng tương tác cao", count: 8765 },
    { id: "inactive_users", name: "Chưa mua lại", count: 4231 },
  ];

  const statusConfig: Record<string, { label: string; color: string }> = {
    sent: {
      label: "Đã gửi",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    scheduled: {
      label: "Đã lên lịch",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    draft: {
      label: "Bản nháp",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    sending: {
      label: "Đang gửi",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

  const calculateOpenRate = (campaign: any) => {
    if (!campaign.sent) return 0;
    return ((campaign.opened / campaign.sent) * 100).toFixed(1);
  };

  const calculateClickRate = (campaign: any) => {
    if (!campaign.sent) return 0;
    return ((campaign.clicked / campaign.sent) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Email Marketing
              </h1>
              <p className="text-gray-500 mt-1">
                Quản lý và theo dõi các chiến dịch email
              </p>
            </div>
            <button
              onClick={() => setShowNewCampaign(true)}
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
              Tạo chiến dịch mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">
                  Email đã gửi
                </p>
                <p className="text-2xl font-bold text-gray-900">28,124</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              +18.2%
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-600"
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
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Tỷ lệ mở</p>
                <p className="text-2xl font-bold text-gray-900">52.3%</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              +3.7%
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Tỷ lệ click</p>
                <p className="text-2xl font-bold text-gray-900">14.8%</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              +2.1%
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-600"
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
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">₫74.5M</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              +28.5%
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {[
                { id: "campaigns", label: "Chiến dịch", icon: "📧" },
                { id: "templates", label: "Mẫu email", icon: "📝" },
                { id: "audiences", label: "Đối tượng", icon: "👥" },
                { id: "analytics", label: "Phân tích", icon: "📊" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-semibold transition-colors relative flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Danh sách chiến dịch
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Quản lý tất cả email marketing của bạn
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
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
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    Lọc
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
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
                    Xuất dữ liệu
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {campaigns.map((campaign: any) => (
                <div
                  key={campaign.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {campaign.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusConfig[campaign.status]?.color || ""}`}
                        >
                          {statusConfig[campaign.status]?.label || ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {campaign.subject}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          {
                            audiences.find((a) => a.id === campaign.audience)
                              ?.name
                          }
                        </span>
                        {campaign.status === "sent" && (
                          <span>📅 {campaign.date}</span>
                        )}
                        {campaign.status === "scheduled" && (
                          <span>🕐 {campaign.scheduled}</span>
                        )}
                        {campaign.status === "draft" && (
                          <span>✏️ Sửa lần cuối: {campaign.lastEdit}</span>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
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

                  {campaign.status === "sent" && (
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {campaign.sent.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Đã gửi</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">
                          {calculateOpenRate(campaign)}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Tỷ lệ mở</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {calculateClickRate(campaign)}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tỷ lệ click
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">
                          ₫{(campaign.revenue / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Doanh thu</p>
                      </div>
                    </div>
                  )}

                  {campaign.status === "scheduled" && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600"
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
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Sẽ gửi tới {campaign.recipients.toLocaleString()}{" "}
                              người
                            </p>
                            <p className="text-xs text-gray-500">
                              Thời gian: {campaign.scheduled}
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                          Hủy lịch
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <div>
            <div className="mb-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Thư viện mẫu email
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Chọn mẫu phù hợp để bắt đầu chiến dịch
                    </p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Tạo mẫu mới
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                    {template.thumbnail}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">
                        {template.name}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.description}
                    </p>
                    <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                      Sử dụng mẫu này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audiences Tab */}
        {activeTab === "audiences" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Danh sách đối tượng
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Quản lý các nhóm khách hàng của bạn
                  </p>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Tạo đối tượng mới
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {audiences.map((audience) => (
                <div
                  key={audience.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {audience.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {audience.count.toLocaleString()} người
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-500 cursor-pointer">
                        Chỉnh sửa
                      </button>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium cursor-pointer">
                        Gửi email
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Hiệu suất theo thời gian
              </h2>
              <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Biểu đồ phân tích sẽ hiển thị tại đây
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Top 5 chiến dịch hiệu quả
                </h3>
                <div className="space-y-3">
                  {campaigns
                    .filter((c) => c.status === "sent")
                    .slice(0, 5)
                    .map((campaign, idx) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">
                              {campaign.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {calculateOpenRate(campaign)}% open rate
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-amber-600">
                          ₫{((campaign?.revenue || 0) / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Thiết bị mở email
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">📱 Mobile</span>
                      <span className="font-bold text-gray-900">64%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: "64%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">💻 Desktop</span>
                      <span className="font-bold text-gray-900">28%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600"
                        style={{ width: "28%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">📧 Webmail</span>
                      <span className="font-bold text-gray-900">8%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600"
                        style={{ width: "8%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Tạo chiến dịch mới
              </h2>
              <button
                onClick={() => setShowNewCampaign(false)}
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
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên chiến dịch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Flash Sale Cuối Tuần"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tiêu đề email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: ⚡ FLASH SALE 50% - Chỉ 48h duy nhất!"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chọn mẫu email <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {templates.slice(0, 3).map((template) => (
                    <div
                      key={template.id}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-gray-900 cursor-pointer transition-all text-center"
                    >
                      <div className="text-3xl mb-2">{template.thumbnail}</div>
                      <p className="text-xs font-semibold text-gray-900">
                        {template.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Đối tượng nhận <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white">
                  {audiences.map((audience) => (
                    <option key={audience.id} value={audience.id}>
                      {audience.name} ({audience.count.toLocaleString()} người)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Thời gian gửi
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="schedule"
                      value="now"
                      className="w-4 h-4"
                      defaultChecked
                    />
                    <span className="text-sm font-medium">Gửi ngay</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="schedule"
                      value="later"
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">
                      Lên lịch gửi sau
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewCampaign(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                  Tạo chiến dịch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
