"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Grid3x3,
  List,
  Package,
  TrendingUp,
  AlertCircle,
  Star,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Áo Thun Basic Cotton Premium",
    category: "Áo Thun",
    price: 350000,
    salePrice: 280000,
    stock: 124,
    sold: 342,
    status: "active",
    rating: 4.8,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
    trending: true,
  },
  {
    id: 2,
    name: "Quần Jeans Slim Fit Xanh Đậm",
    category: "Quần Jeans",
    price: 650000,
    stock: 45,
    sold: 156,
    status: "active",
    rating: 4.6,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&auto=format&fit=crop&q=60",
    trending: false,
  },
  {
    id: 3,
    name: "Áo Khoác Bomber Varsity Đen",
    category: "Áo Khoác",
    price: 850000,
    salePrice: 720000,
    stock: 0,
    sold: 234,
    status: "out_of_stock",
    rating: 4.9,
    reviews: 123,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
    trending: true,
  },
  {
    id: 4,
    name: "Áo Sơ Mi Oxford Trắng",
    category: "Áo Sơ Mi",
    price: 450000,
    stock: 89,
    sold: 198,
    status: "active",
    rating: 4.7,
    reviews: 54,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60",
    trending: false,
  },
  {
    id: 5,
    name: "Quần Short Kaki Be",
    category: "Quần Short",
    price: 280000,
    stock: 56,
    sold: 87,
    status: "active",
    rating: 4.5,
    reviews: 34,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60",
    trending: false,
  },
  {
    id: 6,
    name: "Hoodie Oversize Đen",
    category: "Áo Khoác",
    price: 590000,
    stock: 23,
    sold: 276,
    status: "low_stock",
    rating: 4.9,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60",
    trending: true,
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusConfig = {
    active: {
      label: "Đang bán",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      ring: "ring-emerald-600/20",
    },
    out_of_stock: {
      label: "Hết hàng",
      color: "from-red-500 to-rose-600",
      bg: "bg-red-100",
      text: "text-red-700",
      ring: "ring-red-600/20",
    },
    low_stock: {
      label: "Sắp hết",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-100",
      text: "text-amber-700",
      ring: "ring-amber-600/20",
    },
    draft: {
      label: "Nháp",
      color: "from-slate-500 to-gray-600",
      bg: "bg-slate-100",
      text: "text-slate-700",
      ring: "ring-slate-600/20",
    },
  };

  const stats = [
    {
      label: "Tổng sản phẩm",
      value: MOCK_PRODUCTS.length,
      gradient: "from-blue-500 to-indigo-600",
      icon: Package,
    },
    {
      label: "Đang bán",
      value: MOCK_PRODUCTS.filter((p) => p.status === "active").length,
      gradient: "from-emerald-500 to-teal-600",
      icon: TrendingUp,
    },
    {
      label: "Cảnh báo",
      value: MOCK_PRODUCTS.filter(
        (p) => p.status === "low_stock" || p.status === "out_of_stock",
      ).length,
      gradient: "from-amber-500 to-orange-600",
      icon: AlertCircle,
    },
    {
      label: "Hết hàng",
      value: MOCK_PRODUCTS.filter((p) => p.stock === 0).length,
      gradient: "from-red-500 to-rose-600",
      icon: AlertCircle,
    },
    {
      label: "Sản phẩm hot",
      value: MOCK_PRODUCTS.filter((p) => p.trending).length,
      gradient: "from-pink-500 to-rose-600",
      icon: Star,
    },
  ];

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Quản lý sản phẩm
            </h1>
            <p className="text-slate-600 mt-2">
              Quản lý danh sách sản phẩm, kho hàng và giá cả
            </p>
          </div>
          <Link
            href="/admin/products/create"
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Plus size={20} />
            <span>Thêm sản phẩm</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between ">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-gray-500 focus:outline-none text-gray-500 bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 font-medium text-slate-700"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Tất cả danh mục</option>
                <option value="Áo Thun">Áo Thun</option>
                <option value="Quần Jeans">Quần Jeans</option>
                <option value="Áo Khoác">Áo Khoác</option>
                <option value="Áo Sơ Mi">Áo Sơ Mi</option>
              </select>
              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 font-medium text-slate-700"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="low_stock">Sắp hết</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
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
              <button className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <Download size={18} />
                <span className="hidden sm:inline">Xuất</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const config =
                statusConfig[product.status as keyof typeof statusConfig];
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.stock === 0 ? (
                      <>
                        <span
                          className={`px-2.5 py-1.5 ${config.bg} ${config.text} rounded-full text-xs font-bold ring-1 ${config.ring} absolute top-3 left-3`}
                        >
                          {config.label}
                        </span>
                      </>
                    ) : (
                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Star size={12} fill="white" />
                        HOT
                      </div>
                    )}

                    {product.salePrice && (
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                        -
                        {Math.round(
                          (1 - product.salePrice / product.price) * 100,
                        )}
                        %
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex-1 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1.5">
                        <Eye size={16} />
                        Xem
                      </button>
                      <button className="flex-1 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1.5">
                        <Edit size={16} />
                        Sửa
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                      <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-slate-400" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-amber-400 fill-amber-400"
                        />
                        <span className="text-sm font-bold text-slate-900">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        ({product.reviews} đánh giá)
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                      {product.salePrice ? (
                        <>
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatCurrency(product.salePrice)}
                          </span>
                          <span className="text-sm text-slate-400 line-through">
                            {formatCurrency(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-slate-900">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500">Kho hàng</p>
                        <p className="font-bold text-slate-900">
                          {product.stock}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Đã bán</p>
                        <p className="font-bold text-slate-900">
                          {product.sold}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Kho
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Đã bán
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Đánh giá
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
                {filteredProducts.map((product) => {
                  const config =
                    statusConfig[product.status as keyof typeof statusConfig];
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            {product.trending && (
                              <div className="absolute top-1 right-1">
                                <Star
                                  size={12}
                                  className="text-pink-500 fill-pink-500"
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: #{1000 + product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900">
                            {formatCurrency(product.salePrice || product.price)}
                          </p>
                          {product.salePrice && (
                            <p className="text-xs text-slate-400 line-through">
                              {formatCurrency(product.price)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">
                          {product.sold}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span className="text-sm font-bold text-slate-900">
                            {product.rating}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({product.reviews})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1.5 ${config.bg} ${config.text} rounded-full text-xs font-bold ring-1 ${config.ring}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/60">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-slate-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị{" "}
              <span className="font-bold text-slate-900">
                1-{filteredProducts.length}
              </span>{" "}
              trong số{" "}
              <span className="font-bold text-slate-900">
                {MOCK_PRODUCTS.length}
              </span>{" "}
              sản phẩm
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors">
                Trước
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30">
                1
              </button>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
