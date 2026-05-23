"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, TrendingUp, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInventory, updateInventoryItem } from "@/store/features/inventorySlice";
import { showToast } from "nextjs-toast-notify";

export default function InventoryPage() {
  const dispatch = useAppDispatch();
  const { accessToken } = useAuth();
  const { variants, loading, error } = useAppSelector((state) => state.inventory);

  const [search, setSearch] = useState("");
  const [editedStocks, setEditedStocks] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleSave = async (id: string, newStock: number) => {
    if (!accessToken) {
      showToast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", { duration: 3000 });
      return;
    }
    setSavingId(id);
    try {
      const resultAction = await dispatch(
        updateInventoryItem({ id, stockQuantity: newStock, token: accessToken })
      );
      if (updateInventoryItem.fulfilled.match(resultAction)) {
        showToast.success("Cập nhật số lượng tồn kho thành công!", { duration: 2000 });
      } else {
        showToast.error((resultAction.payload as string) || "Không thể cập nhật tồn kho.", {
          duration: 3000,
        });
      }
    } catch (err: any) {
      showToast.error(err.message || "Có lỗi xảy ra khi lưu.", { duration: 3000 });
    } finally {
      setSavingId(null);
    }
  };

  const filtered = variants.filter((item) => {
    const productName = (item.product?.name || "").toLowerCase();
    const sku = (item.sku || "").toLowerCase();
    const query = search.toLowerCase();
    return productName.includes(query) || sku.includes(query);
  });

  // Calculate dynamic stats
  const totalVariants = variants.length;
  const lowStockCount = variants.filter((v) => v.stockQuantity <= 10).length;
  const activeVariants = variants.filter((v) => v.status === "ACTIVE").length;

  if (loading && variants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <span className="text-slate-500 font-medium">Đang tải dữ liệu kho hàng...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý kho hàng</h1>
        <p className="text-sm text-gray-500">
          Theo dõi tồn kho sản phẩm & biến thể thực tế từ hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Tổng biến thể" value={totalVariants.toString()} icon={<Package />} />
        <StatCard
          title="Sắp hết hàng"
          value={lowStockCount.toString()}
          icon={<AlertTriangle />}
          warning={lowStockCount > 0}
        />
        <StatCard title="Biến thể đang bán" value={activeVariants.toString()} icon={<TrendingUp />} />
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <div className="relative w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên sản phẩm hoặc SKU"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          {error && <span className="text-xs text-red-500 font-semibold">{error}</span>}
        </div>

        {/* Table wrapper for responsive layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4 text-left">Sản phẩm</th>
                <th className="px-6 py-4 text-left">SKU</th>
                <th className="px-6 py-4 text-right">Giá</th>
                <th className="px-6 py-4 text-center">Tồn kho</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Không tìm thấy biến thể sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const currentStock =
                    editedStocks[item.id] !== undefined
                      ? editedStocks[item.id]
                      : item.stockQuantity;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.images?.[0]?.url ||
                              item.product?.images?.[0]?.url ||
                              "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070"
                            }
                            alt={item.product?.name || "Product"}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
                            }}
                          />
                          <div>
                            <div className="font-semibold text-gray-900 line-clamp-1">
                              {item.product?.name || "Sản phẩm chưa đặt tên"}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {[item.color, item.size].filter(Boolean).join(" / ") || "Mặc định"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                        {item.sku || "-"}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900 font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price || 0)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          value={currentStock}
                          onChange={(e) =>
                            setEditedStocks({
                              ...editedStocks,
                              [item.id]: Math.max(0, parseInt(e.target.value, 10) || 0),
                            })
                          }
                          className="w-20 border border-gray-200 rounded-md px-2 py-1 text-center font-medium focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={item.status} stockQuantity={currentStock} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSave(item.id, currentStock)}
                          disabled={savingId === item.id}
                          className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 text-xs font-bold transition inline-flex items-center gap-1.5"
                        >
                          {savingId === item.id && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          )}
                          Lưu
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

const StatCard = ({ title, value, icon, warning }: any) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-xs text-gray-500 uppercase font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div
      className={`p-3 rounded-lg ${
        warning ? "bg-red-50 text-red-600 animate-pulse" : "bg-gray-100 text-gray-500"
      }`}
    >
      {icon}
    </div>
  </div>
);

const StatusBadge = ({ status, stockQuantity }: { status: string; stockQuantity: number }) => {
  let label = "Còn hàng";
  let badgeClass = "bg-green-50 text-green-700 border border-green-200/50";

  if (status === "INACTIVE") {
    label = "Ngừng bán";
    badgeClass = "bg-gray-50 text-gray-500 border border-gray-200/50";
  } else if (stockQuantity === 0) {
    label = "Hết hàng";
    badgeClass = "bg-red-50 text-red-700 border border-red-200/50";
  } else if (stockQuantity <= 10) {
    label = "Sắp hết";
    badgeClass = "bg-amber-50 text-amber-700 border border-amber-200/50";
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
      {label}
    </span>
  );
};

