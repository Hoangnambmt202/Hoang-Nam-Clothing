"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Bookmark, // icon changed for Brand
  Eye,
  EyeOff,
  MoreVertical,
  Filter,
  Grid3x3,
  List,
  Package,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBrands } from "@/store/features/brandsSlice";

interface Brand {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
  status?: string;
  description?: string;
  color?: string;
  revenue?: string;
  growth?: string;
}

export default function BrandsPage() {
  const dispatch = useAppDispatch();
  const { brands, loading } = useAppSelector((state) => state.brands);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hidden">("all");
  const { accessToken } = useAuth();

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || brand.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalProducts = brands.reduce(
    (sum, brand) => sum + (brand.productCount || 0),
    0,
  );
  const activeBrands = brands.filter(
    (brand) => brand.status === "active",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <span className="text-slate-500 font-medium">Đang tải thương hiệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Thương hiệu
            </h1>
            <p className="text-slate-600 mt-2">
              Quản lý các thương hiệu sản phẩm của cửa hàng
            </p>
          </div>

          <button className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Plus size={20} />
            <span>Thêm thương hiệu</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Tổng thương hiệu
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {brands.length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl shadow-lg">
                <Bookmark className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-emerald-600 font-semibold">
                {activeBrands} đang kinh doanh
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Tổng sản phẩm
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {totalProducts.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-slate-600">Từ mọi thương hiệu</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Trung bình/thương hiệu
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {brands.length ? Math.round(totalProducts / brands.length) : 0}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-slate-600">Sản phẩm mỗi thương hiệu</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="flex gap-3">
              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-colors bg-slate-50 font-medium text-slate-700 min-w-[160px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang kinh doanh</option>
                <option value="hidden">Đã ngừng</option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-purple-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brands Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="group bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Header with gradient */}
                <div
                  className={`h-32 bg-gradient-to-br ${brand.color} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="relative h-full flex items-center justify-center">
                    <Bookmark
                      className="w-16 h-16 text-white/90"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {brand.status === "active" ? (
                      <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Eye size={12} />
                        Kinh doanh
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-slate-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <EyeOff size={12} />
                        Ngừng bán
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                        {brand.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono mt-1">
                        /{brand.slug}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-slate-400" />
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {brand.description || "Thương hiệu nổi bật trên hệ thống"}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Sản phẩm</p>
                      <p className="text-lg font-bold text-slate-900">
                        {brand.productCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Doanh thu</p>
                      <p className="text-lg font-bold text-slate-900">
                        {brand.revenue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        (brand.growth || "").startsWith("+")
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {(brand.growth || "").startsWith("+") ? "↑" : "↓"} {brand.growth || "0%"}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Thương hiệu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Đường dẫn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Doanh thu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Tăng trưởng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBrands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${brand.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                        >
                          <Bookmark className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {brand.name}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {brand.description || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-mono">
                        /{brand.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {brand.productCount}
                      </span>
                      <span className="text-slate-500 text-sm ml-1">SP</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {brand.revenue}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          (brand.growth || "").startsWith("+")
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {brand.growth || "0%"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {brand.status === "active" ? (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
                          <Eye size={12} />
                          Kinh doanh
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
                          <EyeOff size={12} />
                          Ngừng bán
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-purple-50 text-slate-400 hover:text-purple-600 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/60">
            <Bookmark className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Không tìm thấy thương hiệu
            </h3>
            <p className="text-slate-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
