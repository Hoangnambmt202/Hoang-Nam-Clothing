"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Folder,
  Eye,
  EyeOff,
  MoreVertical,
  Filter,
  Grid3x3,
  List,
  Package,
  TrendingUp,
} from "lucide-react";

const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Áo Thun",
    slug: "ao-thun",
    productCount: 245,
    status: "active",
    description: "Các loại áo thun nam nữ, cotton, oversize...",
    color: "from-blue-500 to-cyan-600",
    revenue: "45.2M đ",
    growth: "+12.5%",
  },
  {
    id: 2,
    name: "Quần Jeans",
    slug: "quan-jeans",
    productCount: 132,
    status: "active",
    description: "Quần jeans skinny, slim fit, regular...",
    color: "from-indigo-500 to-purple-600",
    revenue: "38.7M đ",
    growth: "+8.3%",
  },
  {
    id: 3,
    name: "Áo Khoác",
    slug: "ao-khoac",
    productCount: 98,
    status: "active",
    description: "Jacket, Bomber, Hoodie, Cardigan...",
    color: "from-orange-500 to-red-600",
    revenue: "52.1M đ",
    growth: "+15.7%",
  },
  {
    id: 4,
    name: "Phụ Kiện",
    slug: "phu-kien",
    productCount: 356,
    status: "hidden",
    description: "Mũ, nón, tất, thắt lưng...",
    color: "from-emerald-500 to-teal-600",
    revenue: "28.4M đ",
    growth: "-3.2%",
  },
  {
    id: 5,
    name: "Giày Dép",
    slug: "giay-dep",
    productCount: 189,
    status: "active",
    description: "Sneakers, sandals, boots...",
    color: "from-pink-500 to-rose-600",
    revenue: "67.8M đ",
    growth: "+22.1%",
  },
  {
    id: 6,
    name: "Đầm Váy",
    slug: "dam-vay",
    productCount: 167,
    status: "active",
    description: "Váy maxi, váy ngắn, đầm dạ hội...",
    color: "from-violet-500 to-purple-600",
    revenue: "41.3M đ",
    growth: "+9.8%",
  },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hidden">(
    "all",
  );

  const filteredCategories = MOCK_CATEGORIES.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || cat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalProducts = MOCK_CATEGORIES.reduce(
    (sum, cat) => sum + cat.productCount,
    0,
  );
  const activeCategories = MOCK_CATEGORIES.filter(
    (cat) => cat.status === "active",
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Danh mục sản phẩm
            </h1>
            <p className="text-slate-600 mt-2">
              Quản lý các nhóm sản phẩm của cửa hàng
            </p>
          </div>

          <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Plus size={20} />
            <span>Thêm danh mục</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Tổng danh mục
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {MOCK_CATEGORIES.length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Folder className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-emerald-600 font-semibold">
                {activeCategories} đang hoạt động
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
              <span className="text-slate-600">Trên tất cả danh mục</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  Trung bình/danh mục
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {Math.round(totalProducts / MOCK_CATEGORIES.length)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-slate-600">Sản phẩm mỗi nhóm</span>
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
                placeholder="Tìm kiếm theo tên hoặc slug..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="flex gap-3">
              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 font-medium text-slate-700 min-w-[160px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="hidden">Đã ẩn</option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="group bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Header with gradient */}
                <div
                  className={`h-32 bg-gradient-to-br ${cat.color} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="relative h-full flex items-center justify-center">
                    <Folder
                      className="w-16 h-16 text-white/90"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {cat.status === "active" ? (
                      <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Eye size={12} />
                        Hiển thị
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-slate-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <EyeOff size={12} />
                        Đã ẩn
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono mt-1">
                        /{cat.slug}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-slate-400" />
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Sản phẩm</p>
                      <p className="text-lg font-bold text-slate-900">
                        {cat.productCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Doanh thu</p>
                      <p className="text-lg font-bold text-slate-900">
                        {cat.revenue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        cat.growth.startsWith("+")
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {cat.growth.startsWith("+") ? "↑" : "↓"} {cat.growth}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
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
                    Danh mục
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
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                        >
                          <Folder className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {cat.name}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-mono">
                        /{cat.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {cat.productCount}
                      </span>
                      <span className="text-slate-500 text-sm ml-1">SP</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {cat.revenue}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          cat.growth.startsWith("+")
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cat.growth}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {cat.status === "active" ? (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
                          <Eye size={12} />
                          Hiển thị
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
                          <EyeOff size={12} />
                          Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
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
        {filteredCategories.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/60">
            <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Không tìm thấy danh mục
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
