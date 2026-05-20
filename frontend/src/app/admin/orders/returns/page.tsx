"use client";

import { useState } from "react";

export default function ReturnsRefunds() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnItems, setReturnItems] = useState<any[]>([]);
  const [refundMethod, setRefundMethod] = useState("original");
  const [step, setStep] = useState(1);

  // Mock data đơn hàng
  const orders = [
    {
      id: "ORD001",
      date: "15/01/2026",
      total: 2500000,
      status: "delivered",
      items: [
        {
          id: 1,
          name: "Áo Sơ Mi Trắng Premium",
          size: "M",
          price: 850000,
          quantity: 1,
          image: "/api/placeholder/80/80",
        },
        {
          id: 2,
          name: "Quần Jeans Slim Fit",
          size: "30",
          price: 950000,
          quantity: 1,
          image: "/api/placeholder/80/80",
        },
        {
          id: 3,
          name: "Giày Sneaker Canvas",
          size: "42",
          price: 700000,
          quantity: 1,
          image: "/api/placeholder/80/80",
        },
      ],
    },
    {
      id: "ORD002",
      date: "10/01/2026",
      total: 1800000,
      status: "delivered",
      items: [
        {
          id: 4,
          name: "Váy Dạ Hội Đen",
          size: "S",
          price: 1800000,
          quantity: 1,
          image: "/api/placeholder/80/80",
        },
      ],
    },
  ];

  const returnReasons = [
    "Sản phẩm không đúng kích thước",
    "Sản phẩm bị lỗi/hỏng",
    "Sản phẩm không giống hình",
    "Đổi ý không muốn mua nữa",
    "Nhận được sản phẩm sai",
    "Khác (ghi chú bên dưới)",
  ];

  const toggleItemReturn = (itemId: any) => {
    setReturnItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id: any) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const calculateRefundAmount = () => {
    if (!selectedOrder) return 0;
    return selectedOrder.items
      .filter((item: any) => returnItems.includes(item.id))
      .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  };

  const handleSubmitReturn = () => {
    // Xử lý gửi yêu cầu trả hàng
    alert("Yêu cầu trả hàng đã được gửi thành công!");
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Trả Hàng & Hoàn Tiền
              </h1>
              <p className="text-sm text-gray-500">
                Xử lý yêu cầu trả hàng và hoàn tiền của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { num: 1, label: "Chọn đơn hàng" },
              { num: 2, label: "Chọn sản phẩm" },
              { num: 3, label: "Xác nhận" },
              { num: 4, label: "Hoàn tất" },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s.num
                        ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step > s.num ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      step > s.num
                        ? "bg-gradient-to-r from-rose-500 to-pink-600"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Chọn đơn hàng */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Chọn đơn hàng cần trả
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${
                    selectedOrder?.id === order.id
                      ? "border-rose-500 bg-rose-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Đã giao hàng
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Ngày đặt: {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="text-lg font-bold text-gray-900">
                        {order.total.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => selectedOrder && setStep(2)}
              disabled={!selectedOrder}
              className="w-full mt-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp tục
            </button>
          </div>
        )}

        {/* Step 2: Chọn sản phẩm và lý do */}
        {step === 2 && selectedOrder && (
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Chọn sản phẩm cần trả
            </h2>

            <div className="space-y-4 mb-6">
              {selectedOrder.items.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => toggleItemReturn(item.id)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    returnItems.includes(item.id)
                      ? "border-rose-500 bg-rose-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size} | Số lượng: {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          returnItems.includes(item.id)
                            ? "border-rose-500 bg-rose-500"
                            : "border-gray-300"
                        }`}
                      >
                        {returnItems.includes(item.id) && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Lý do trả hàng <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                {returnReasons.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={returnReason === reason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-4 h-4 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ghi chú thêm (không bắt buộc)
              </label>
              <textarea
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                rows={4}
                placeholder="Mô tả chi tiết về vấn đề của sản phẩm..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={returnItems.length === 0 || !returnReason}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Xác nhận */}
        {step === 3 && selectedOrder && (
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Xác nhận thông tin trả hàng
            </h2>

            {/* Thông tin đơn hàng */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Đơn hàng #{selectedOrder.id}
              </h3>
              <div className="space-y-3">
                {selectedOrder.items
                  .filter((item: any) => returnItems.includes(item.id))
                  .map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Size {item.size} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Lý do trả hàng */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Lý do trả hàng
              </h3>
              <p className="text-gray-700">{returnReason}</p>
            </div>

            {/* Phương thức hoàn tiền */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Phương thức hoàn tiền
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="radio"
                    name="refund"
                    value="original"
                    checked={refundMethod === "original"}
                    onChange={(e) => setRefundMethod(e.target.value)}
                    className="w-4 h-4 text-rose-500 focus:ring-rose-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Hoàn về phương thức thanh toán gốc
                    </p>
                    <p className="text-sm text-gray-500">
                      Tiền sẽ được hoàn về tài khoản/thẻ bạn đã dùng
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="radio"
                    name="refund"
                    value="store_credit"
                    checked={refundMethod === "store_credit"}
                    onChange={(e) => setRefundMethod(e.target.value)}
                    className="w-4 h-4 text-rose-500 focus:ring-rose-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Mã giảm giá cho lần mua sau
                    </p>
                    <p className="text-sm text-gray-500">
                      Nhận thêm 10% giá trị đơn hàng
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Tổng tiền hoàn */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Số tiền được hoàn:
                </span>
                <span className="text-2xl font-bold text-rose-600">
                  {calculateRefundAmount().toLocaleString("vi-VN")}đ
                </span>
              </div>
              {refundMethod === "store_credit" && (
                <p className="text-sm text-gray-600 mt-2">
                  + Bonus:{" "}
                  {(calculateRefundAmount() * 0.1).toLocaleString("vi-VN")}đ
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Vui lòng đóng gói sản phẩm cẩn thận, giữ nguyên tem mác
                    </li>
                    <li>
                      Thời gian hoàn tiền: 5-7 ngày làm việc sau khi nhận hàng
                    </li>
                    <li>Phí vận chuyển trả hàng do shop hỗ trợ</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmitReturn}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Xác nhận trả hàng
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Hoàn tất */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Yêu cầu đã được gửi!
            </h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi đã nhận được yêu cầu trả hàng của bạn. Đội ngũ chăm sóc
              khách hàng sẽ liên hệ với bạn trong vòng 24 giờ.
            </p>

            <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">
                Mã yêu cầu của bạn
              </h3>
              <div className="flex items-center justify-between bg-white border-2 border-dashed border-gray-300 rounded-lg p-4">
                <span className="text-2xl font-bold text-gray-900">
                  RET-{Date.now().toString().slice(-6)}
                </span>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
                  Sao chép
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-rose-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Chuẩn bị hàng</p>
                  <p className="text-sm text-gray-500">
                    Đóng gói sản phẩm cẩn thận, giữ nguyên tem mác
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-rose-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Chờ liên hệ</p>
                  <p className="text-sm text-gray-500">
                    Nhân viên sẽ liên hệ để sắp xếp lịch lấy hàng
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-rose-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Hoàn tiền</p>
                  <p className="text-sm text-gray-500">
                    Nhận tiền sau 5-7 ngày kể từ khi shop nhận hàng
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setSelectedOrder(null);
                  setReturnItems([]);
                  setReturnReason("");
                }}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Trả hàng khác
              </button>
              <button className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
