"use client";

import { useState, useEffect } from "react";
import { shippingApi } from "@/lib/api/shipping";
import { useAuth } from "@/hooks/useAuth";

export default function ShippingPartners() {
  const { accessToken } = useAuth();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseCost: 0,
    estimatedDays: 0,
    isActive: true,
  });

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await shippingApi.getAll(false);
      setPartners(data);
    } catch (error) {
      console.error("Failed to fetch shipping methods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPartner) {
        await shippingApi.update(selectedPartner.id, formData, accessToken || "");
      } else {
        await shippingApi.create(formData, accessToken || "");
      }
      setShowAddPartner(false);
      setSelectedPartner(null);
      fetchPartners();
    } catch (error) {
      console.error("Failed to save shipping method:", error);
      alert("Lỗi khi lưu phương thức vận chuyển");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa phương thức này?")) return;
    try {
      await shippingApi.delete(id, accessToken || "");
      fetchPartners();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Lỗi khi xóa");
    }
  };

  const filteredPartners = partners.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return p.isActive;
    if (activeTab === "inactive") return !p.isActive;
    return true;
  });

  const statusConfig: Record<string, { label: string; color: string }> = {
    active: {
      label: "Hoạt động",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    inactive: {
      label: "Tạm ngưng",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đối tác vận chuyển</h1>
              <p className="text-gray-500 mt-1">Quản lý các đơn vị vận chuyển (Shipping Methods)</p>
            </div>
            <button
              onClick={() => {
                setSelectedPartner(null);
                setFormData({ name: "", description: "", baseCost: 0, estimatedDays: 0, isActive: true });
                setShowAddPartner(true);
              }}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
            >
              Thêm đối tác
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            {[
              { id: "all", label: "Tất cả", count: partners.length },
              { id: "active", label: "Hoạt động", count: partners.filter((p) => p.isActive).length },
              { id: "inactive", label: "Tạm ngưng", count: partners.filter((p) => !p.isActive).length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-semibold transition-colors relative ${
                  activeTab === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
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

        {/* List */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">🚚</div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{partner.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${partner.isActive ? statusConfig.active.color : statusConfig.inactive.color}`}>
                          {partner.isActive ? statusConfig.active.label : statusConfig.inactive.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedPartner(partner);
                        setFormData({
                          name: partner.name,
                          description: partner.description || "",
                          baseCost: partner.baseCost,
                          estimatedDays: partner.estimatedDays || 0,
                          isActive: partner.isActive,
                        });
                        setShowAddPartner(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(partner.id)} className="text-red-500 hover:text-red-700">
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Mô tả:</span>
                    <span className="font-semibold text-gray-900">{partner.description || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Giá cơ bản:</span>
                    <span className="font-semibold text-gray-900">{Number(partner.baseCost).toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Thời gian dự kiến:</span>
                    <span className="font-semibold text-gray-900">{partner.estimatedDays} ngày</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedPartner ? "Cập nhật" : "Thêm mới"} Phương thức</h2>
              <button onClick={() => setShowAddPartner(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tên phương thức *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Phí vận chuyển cơ bản (₫) *</label>
                  <input
                    required
                    type="number"
                    value={formData.baseCost}
                    onChange={(e) => setFormData({ ...formData, baseCost: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Thời gian (Ngày)</label>
                  <input
                    type="number"
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData({ ...formData, estimatedDays: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="isActive" className="font-semibold text-gray-900">Kích hoạt phương thức này</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddPartner(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium">
                  Hủy
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium">
                  {selectedPartner ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
