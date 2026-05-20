"use client";

import { useState } from "react";

export default function PaymentMethods() {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("active");

  // Mock data payment methods
  const paymentMethods = [
    {
      id: 1,
      type: "credit_card",
      provider: "Visa",
      name: "Thẻ Visa",
      cardNumber: "**** **** **** 4532",
      cardHolder: "NGUYEN VAN AN",
      expiryDate: "12/26",
      isDefault: true,
      status: "active",
      addedDate: "2025-01-15",
      lastUsed: "2026-02-05",
      transactions: 24,
    },
    {
      id: 2,
      type: "credit_card",
      provider: "Mastercard",
      name: "Thẻ Mastercard",
      cardNumber: "**** **** **** 8765",
      cardHolder: "NGUYEN VAN AN",
      expiryDate: "08/27",
      isDefault: false,
      status: "active",
      addedDate: "2025-03-20",
      lastUsed: "2026-01-28",
      transactions: 12,
    },
    {
      id: 3,
      type: "bank_account",
      provider: "Vietcombank",
      name: "Tài khoản Vietcombank",
      accountNumber: "**** **** 2341",
      accountHolder: "Nguyen Van An",
      isDefault: false,
      status: "active",
      addedDate: "2024-11-10",
      lastUsed: "2026-02-03",
      transactions: 8,
    },
    {
      id: 4,
      type: "e_wallet",
      provider: "MoMo",
      name: "Ví MoMo",
      phoneNumber: "0912 *** 456",
      accountHolder: "Nguyen Van An",
      isDefault: false,
      status: "active",
      addedDate: "2025-02-01",
      lastUsed: "2026-02-04",
      transactions: 15,
    },
    {
      id: 5,
      type: "credit_card",
      provider: "Visa",
      name: "Thẻ Visa cũ",
      cardNumber: "**** **** **** 1234",
      cardHolder: "NGUYEN VAN AN",
      expiryDate: "03/25",
      isDefault: false,
      status: "expired",
      addedDate: "2023-06-10",
      lastUsed: "2025-03-01",
      transactions: 45,
    },
  ];

  const stats = [
    {
      label: "Phương thức đang dùng",
      value: "4",
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Giao dịch tháng này",
      value: "18",
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
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Tổng chi tiêu",
      value: "₫12.4M",
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
    {
      label: "Điểm thưởng",
      value: "2,340",
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
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const providerConfig: Record<string, any> = {
    Visa: {
      icon: "💳",
      color: "bg-blue-600",
      logo: <div className="font-bold text-white text-sm">VISA</div>,
    },
    Mastercard: {
      icon: "💳",
      color: "bg-red-600",
      logo: <div className="font-bold text-white text-xs">MC</div>,
    },
    Vietcombank: {
      icon: "🏦",
      color: "bg-green-600",
      logo: <div className="font-bold text-white text-xs">VCB</div>,
    },
    MoMo: {
      icon: "📱",
      color: "bg-pink-600",
      logo: <div className="font-bold text-white text-xs">MOMO</div>,
    },
    ZaloPay: {
      icon: "💰",
      color: "bg-blue-500",
      logo: <div className="font-bold text-white text-xs">ZP</div>,
    },
  };

  const filteredPayments = paymentMethods.filter(
    (pm) => activeTab === "all" || pm.status === activeTab,
  );

  const getPaymentIcon = (payment: any) => {
    if (payment.type === "credit_card") {
      return (
        <div
          className={`w-16 h-16 ${providerConfig[payment.provider].color} rounded-xl flex items-center justify-center`}
        >
          {providerConfig[payment.provider].logo}
        </div>
      );
    }
    if (payment.type === "bank_account") {
      return (
        <div
          className={`w-16 h-16 ${providerConfig[payment.provider].color} rounded-xl flex items-center justify-center text-3xl`}
        >
          🏦
        </div>
      );
    }
    return (
      <div
        className={`w-16 h-16 ${providerConfig[payment.provider].color} rounded-xl flex items-center justify-center text-3xl`}
      >
        {providerConfig[payment.provider].icon}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Phương thức thanh toán
              </h1>
              <p className="text-gray-500 mt-1">
                Quản lý thẻ và tài khoản thanh toán của bạn
              </p>
            </div>
            <button
              onClick={() => setShowAddPayment(true)}
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
              Thêm phương thức mới
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
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">
                Bảo mật thông tin thanh toán
              </h3>
              <p className="text-sm text-gray-700">
                Tất cả thông tin thanh toán của bạn được mã hóa và bảo mật theo
                tiêu chuẩn PCI DSS. Chúng tôi không lưu trữ mã CVV/CVC của thẻ.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {[
                {
                  id: "active",
                  label: "Đang sử dụng",
                  count: paymentMethods.filter((p) => p.status === "active")
                    .length,
                },
                {
                  id: "expired",
                  label: "Đã hết hạn",
                  count: paymentMethods.filter((p) => p.status === "expired")
                    .length,
                },
                { id: "all", label: "Tất cả", count: paymentMethods.length },
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

        {/* Payment Methods List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className={`bg-white rounded-2xl border-2 transition-all hover:shadow-lg ${
                payment.isDefault
                  ? "border-gray-900"
                  : payment.status === "expired"
                    ? "border-red-200 opacity-75"
                    : "border-gray-200"
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {getPaymentIcon(payment)}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {payment.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {payment.provider}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPayment(payment)}
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

                {/* Card Info */}
                <div className="space-y-3 mb-6">
                  {payment.type === "credit_card" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Số thẻ</span>
                        <span className="font-mono font-semibold text-gray-900">
                          {payment.cardNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Chủ thẻ</span>
                        <span className="font-semibold text-gray-900">
                          {payment.cardHolder}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Hết hạn</span>
                        <span
                          className={`font-semibold ${payment.status === "expired" ? "text-red-600" : "text-gray-900"}`}
                        >
                          {payment.expiryDate}
                        </span>
                      </div>
                    </>
                  )}
                  {payment.type === "bank_account" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Số tài khoản
                        </span>
                        <span className="font-mono font-semibold text-gray-900">
                          {payment.accountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Chủ tài khoản
                        </span>
                        <span className="font-semibold text-gray-900">
                          {payment.accountHolder}
                        </span>
                      </div>
                    </>
                  )}
                  {payment.type === "e_wallet" && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Số điện thoại
                        </span>
                        <span className="font-mono font-semibold text-gray-900">
                          {payment.phoneNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Chủ tài khoản
                        </span>
                        <span className="font-semibold text-gray-900">
                          {payment.accountHolder}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {payment.transactions}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Giao dịch</p>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div className="flex-1 text-center">
                    <p className="text-sm font-semibold text-gray-900">
                      {payment.lastUsed}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Dùng lần cuối</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {payment.isDefault && (
                      <span className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg">
                        Mặc định
                      </span>
                    )}
                    {payment.status === "expired" && (
                      <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                        Đã hết hạn
                      </span>
                    )}
                  </div>
                  {!payment.isDefault && payment.status === "active" && (
                    <button className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
                      Đặt làm mặc định
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button
            onClick={() => setShowAddPayment(true)}
            className="bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-900 transition-all p-6 flex flex-col items-center justify-center min-h-[320px] group"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-900 transition-colors">
              <svg
                className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors"
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
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              Thêm phương thức mới
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Thêm thẻ tín dụng, tài khoản ngân hàng
              <br />
              hoặc ví điện tử
            </p>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Giao dịch gần đây
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Lịch sử thanh toán của bạn
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              {
                date: "2026-02-05",
                description: "Mua hàng #ORD5678",
                amount: -850000,
                method: "Visa ***4532",
                status: "success",
              },
              {
                date: "2026-02-04",
                description: "Mua hàng #ORD5677",
                amount: -1200000,
                method: "MoMo",
                status: "success",
              },
              {
                date: "2026-02-03",
                description: "Hoàn tiền #ORD5676",
                amount: +320000,
                method: "Vietcombank",
                status: "refunded",
              },
              {
                date: "2026-02-01",
                description: "Mua hàng #ORD5675",
                amount: -450000,
                method: "Mastercard ***8765",
                status: "success",
              },
            ].map((txn, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        txn.status === "refunded"
                          ? "bg-blue-100"
                          : txn.amount < 0
                            ? "bg-red-100"
                            : "bg-emerald-100"
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 ${
                          txn.status === "refunded"
                            ? "text-blue-600"
                            : txn.amount < 0
                              ? "text-red-600"
                              : "text-emerald-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {txn.status === "refunded" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {txn.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">
                          {txn.date}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {txn.method}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        txn.amount < 0 ? "text-gray-900" : "text-emerald-600"
                      }`}
                    >
                      {txn.amount < 0 ? "-" : "+"}₫
                      {Math.abs(txn.amount).toLocaleString("vi-VN")}
                    </p>
                    {txn.status === "refunded" && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        Hoàn tiền
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-gray-200 text-center">
            <button className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Xem tất cả giao dịch →
            </button>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Thêm phương thức thanh toán
              </h2>
              <button
                onClick={() => setShowAddPayment(false)}
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
              {/* Payment Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Chọn loại thanh toán
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-4 border-2 border-gray-900 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="text-3xl mb-2">💳</div>
                    <p className="text-sm font-bold text-gray-900">
                      Thẻ tín dụng
                    </p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-900 transition-all">
                    <div className="text-3xl mb-2">🏦</div>
                    <p className="text-sm font-semibold text-gray-600">
                      Ngân hàng
                    </p>
                  </button>
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-900 transition-all">
                    <div className="text-3xl mb-2">📱</div>
                    <p className="text-sm font-semibold text-gray-600">
                      Ví điện tử
                    </p>
                  </button>
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Số thẻ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none font-mono"
                />
              </div>

              {/* Card Holder */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên chủ thẻ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="NGUYEN VAN AN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none uppercase"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ngày hết hạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mã CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none font-mono"
                  />
                </div>
              </div>

              {/* Default Checkbox */}
              <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    Đặt làm phương thức mặc định
                  </p>
                  <p className="text-sm text-gray-500">
                    Sử dụng thẻ này cho các giao dịch tiếp theo
                  </p>
                </div>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddPayment(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                  Thêm thẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết thanh toán
              </h2>
              <button
                onClick={() => setSelectedPayment(null)}
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

            <div className="p-6 space-y-4">
              <div className="text-center pb-6 border-b border-gray-200">
                {getPaymentIcon(selectedPayment)}
                <h3 className="font-bold text-xl text-gray-900 mt-4">
                  {selectedPayment.name}
                </h3>
                <p className="text-gray-500">{selectedPayment.provider}</p>
              </div>

              <button className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                Đặt làm mặc định
              </button>
              <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                Chỉnh sửa thông tin
              </button>
              <button className="w-full py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-colors font-medium">
                Xóa phương thức
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
