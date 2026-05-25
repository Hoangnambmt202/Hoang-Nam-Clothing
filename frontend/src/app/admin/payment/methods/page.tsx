"use client";

import { useState, useEffect } from "react";
import { paymentApi } from "@/lib/api/payment";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentMethods() {
  const { user, accessToken } = useAuth();
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    type: "",
    description: "",
    isActive: true,
  });

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const data = await paymentApi.getAll(false);
      setMethods(data);
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPayment) {
        await paymentApi.update(selectedPayment.id, formData, accessToken || "");
      } else {
        await paymentApi.create(formData, accessToken || "");
      }
      setShowAddPayment(false);
      setSelectedPayment(null);
      fetchMethods();
    } catch (error) {
      console.error("Failed to save payment method:", error);
      alert("Lỗi khi lưu phương thức thanh toán");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa cổng thanh toán này?")) return;
    try {
      await paymentApi.delete(id, accessToken || "");
      fetchMethods();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Lỗi khi xóa");
    }
  };

  const filteredMethods = methods.filter((pm) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return pm.isActive;
    if (activeTab === "inactive") return !pm.isActive;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cổng thanh toán
              </h1>
              <p className="text-gray-500 mt-1">
                Quản lý các cổng thanh toán chung của hệ thống
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedPayment(null);
                setFormData({ name: "", provider: "", type: "", description: "", isActive: true });
                setShowAddPayment(true);
              }}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
            >
              Thêm cổng thanh toán
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {[
                { id: "all", label: "Tất cả", count: methods.length },
                { id: "active", label: "Đang hoạt động", count: methods.filter((p) => p.isActive).length },
                { id: "inactive", label: "Tạm ngưng", count: methods.filter((p) => !p.isActive).length },
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
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                    {tab.count}
                  </span>
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMethods.map((payment) => (
              <div key={payment.id} className="bg-white rounded-2xl border-2 border-gray-200 transition-all hover:shadow-lg">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                        💳
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {payment.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Provider: {payment.provider} | Type: {payment.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setFormData({
                            name: payment.name,
                            provider: payment.provider,
                            type: payment.type,
                            description: payment.description || "",
                            isActive: payment.isActive,
                          });
                          setShowAddPayment(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Mô tả</span>
                      <span className="font-semibold text-gray-900">{payment.description || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${payment.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {payment.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedPayment ? "Cập nhật" : "Thêm mới"} Cổng thanh toán
              </h2>
              <button
                onClick={() => setShowAddPayment(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Tên hiển thị *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Thanh toán khi nhận hàng (COD)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Nhà cung cấp (Provider) *</label>
                  <input
                    required
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="VD: COD, VNPAY, MOMO"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none uppercase text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Loại (Type) *</label>
                  <select name="type" id="type" className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-xl outline-none text-gray-500" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="">Chọn loại</option>
                    <option value="cash">Thanh toán khi nhận hàng (COD)</option>
                    <option value="banking">Thanh toán qua ngân hàng</option>
                    <option value="e_wallet">Thanh toán qua ví điện tử</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Mô tả chi tiết</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hướng dẫn hoặc mô tả thêm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none h-24 text-gray-500"
                />
              </div>

              <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 "
                />
                <div>
                  <p className="font-semibold text-gray-900">Kích hoạt cổng thanh toán này</p>
                  <p className="text-sm text-gray-500">Khách hàng sẽ có thể chọn phương thức này khi thanh toán</p>
                </div>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  {selectedPayment ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
