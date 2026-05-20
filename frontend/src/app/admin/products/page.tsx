"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { productApi } from "@/lib/api/product";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "nextjs-toast-notify";

export default function ProductsPage() {
  const { accessToken } = useAuth();
  
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    active: 0,
    inactive: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  // Delete product state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      label: "Nháp / Ẩn",
      color: "from-slate-500 to-gray-600",
      bg: "bg-slate-100",
      text: "text-slate-700",
      ring: "ring-slate-600/20",
    },
  };

  // Fetch product list
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }
      if (filterCategory !== "all") {
        params.categoryId = filterCategory;
      }
      if (filterStatus !== "all") {
        if (filterStatus === "active") params.isActive = true;
        if (filterStatus === "draft") params.isActive = false;
        // In-stock / out-of-stock logic can also be passed if supported,
        // otherwise we filter on client or send specific flags
      }

      const res = await productApi.getProducts(params);
      if (res) {
        setProducts(res.products || []);
        setTotalProducts(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      showToast.error("Không thể tải danh sách sản phẩm.", { duration: 2000 });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterCategory, filterStatus]);

  // Fetch filters (categories) & stats
  useEffect(() => {
    async function loadMetadata() {
      try {
        const filters = await productApi.getFilters();
        if (filters && filters.categories) {
          setCategories(filters.categories);
        }
      } catch (err) {
        console.error("Lỗi khi tải filters:", err);
      }

      if (accessToken) {
        try {
          const statistics = await productApi.getProductStats(accessToken);
          if (statistics) {
            setStats(statistics);
          }
        } catch (err) {
          console.error("Lỗi khi tải thống kê:", err);
        }
      }
    }
    loadMetadata();
  }, [accessToken, loadProducts]);

  // Load products when filters or page changes
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle Delete Confirm
  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId || !accessToken) return;
    try {
      setIsDeleting(true);
      await productApi.deleteProduct(deletingId, accessToken);
      showToast.success("Đã xóa sản phẩm thành công!", { duration: 2000 });
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      // Reload products & stats
      loadProducts();
      const statistics = await productApi.getProductStats(accessToken);
      if (statistics) setStats(statistics);
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      showToast.error("Không thể xóa sản phẩm này.", { duration: 2000 });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Helper to map DB values to client UI config
  const getProductDisplayInfo = (product: any) => {
    const mainImg = product.images?.find((img: any) => img.isMain || img.is_thumbnail)?.url || 
                    product.images?.[0]?.url || 
                    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
    
    // Sum stock across variants
    const totalStock = product.variants?.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0) || 0;
    
    // Base price from first variant or custom salePrice
    const price = Number(product.variants?.[0]?.price || 350000);
    const salePrice = product.salePrice ? Number(product.salePrice) : undefined;
    
    // Total sold (mock or derived if supported)
    const sold = product.variants?.reduce((sum: number, v: any) => sum + (v.sold || 0), 0) || 0;

    let statusKey: "active" | "out_of_stock" | "low_stock" | "draft" = "active";
    if (!product.isActive) {
      statusKey = "draft";
    } else if (totalStock === 0) {
      statusKey = "out_of_stock";
    } else if (totalStock <= 10) {
      statusKey = "low_stock";
    }

    return {
      mainImg,
      totalStock,
      price,
      salePrice,
      sold,
      statusKey,
    };
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
              Quản lý danh sách sản phẩm, kho hàng và giá cả thực tế trong hệ thống
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              label: "Tổng sản phẩm",
              value: stats?.total || 0,
              gradient: "from-blue-500 to-indigo-600",
              icon: Package,
            },
            {
              label: "Đang bán",
              value: stats?.active || 0,
              gradient: "from-emerald-500 to-teal-600",
              icon: TrendingUp,
            },
            {
              label: "Sắp hết hàng",
              value: stats?.lowStock || 0,
              gradient: "from-amber-500 to-orange-600",
              icon: AlertCircle,
            },
            {
              label: "Hết hàng",
              value: stats?.outOfStock || 0,
              gradient: "from-red-500 to-rose-600",
              icon: AlertCircle,
            },
            {
              label: "Ngừng bán / Nháp",
              value: stats?.inactive || 0,
              gradient: "from-slate-500 to-gray-600",
              icon: Star,
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 font-medium text-slate-700 max-w-[200px]"
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 font-medium text-slate-700"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="draft">Nháp / Ẩn</option>
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
              <button 
                onClick={() => loadProducts()}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Làm mới</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="bg-white rounded-2xl p-24 text-center shadow-sm border border-slate-200/60 flex flex-col justify-center items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <span className="text-slate-500 font-medium">Đang tải danh sách sản phẩm...</span>
          </div>
        ) : products.length > 0 ? (
          /* Products Grid Mode */
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const { mainImg, totalStock, price, salePrice, sold, statusKey } = getProductDisplayInfo(product);
                const config = statusConfig[statusKey];
                
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <Image
                        src={mainImg}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
                      <span
                        className={`px-3 py-1.5 ${config.bg} ${config.text} rounded-full text-xs font-bold ring-1 ${config.ring} absolute top-3 left-3`}
                      >
                        {config.label}
                      </span>

                      {salePrice && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                          -{Math.round((1 - salePrice / price) * 100)}%
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="flex-1 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Eye size={16} />
                          Xem chi tiết
                        </Link>
                        <button 
                          onClick={() => showToast.info("Chỉnh sửa variant trong tab sản phẩm.", { duration: 2000 })}
                          className="flex-1 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-900 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Edit size={16} />
                          Sửa
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          {product.category?.name || "Premium Collection"}
                        </span>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleDeleteClick(product.id)}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                        {product.name}
                      </h3>

                      <div className="flex items-baseline gap-2 mb-4">
                        {salePrice ? (
                          <>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              {formatCurrency(salePrice)}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              {formatCurrency(price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-slate-900">
                            {formatCurrency(price)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                        <div>
                          <p className="text-slate-500">Tồn kho</p>
                          <p className="font-bold text-slate-900 text-sm">
                            {totalStock}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Sức chứa</p>
                          <p className="font-bold text-slate-900 text-sm">
                            {product.variants?.length || 0} variants
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Products List Table Mode */
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50 border-b-2 border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Giá hiển thị
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Tổng kho
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Biến thể
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
                  {products.map((product) => {
                    const { mainImg, totalStock, price, salePrice, statusKey } = getProductDisplayInfo(product);
                    const config = statusConfig[statusKey];
                    
                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                              <Image
                                src={mainImg}
                                alt={product.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                            <div className="max-w-xs">
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            {product.category?.name || "Collection"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900">
                              {formatCurrency(salePrice || price)}
                            </p>
                            {salePrice && (
                              <p className="text-xs text-slate-400 line-through">
                                {formatCurrency(price)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${totalStock === 0 ? "text-red-500" : "text-slate-950"}`}>
                            {totalStock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-600 font-medium">
                            {product.variants?.length || 0} variants
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${config.ring} ${config.bg} ${config.text}`}
                          >
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link 
                              href={`/products/${product.id}`}
                              target="_blank"
                              className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} />
                            </Link>
                            <button 
                              onClick={() => showToast.info("Chỉnh sửa variant trong tab sản phẩm.", { duration: 2000 })}
                              className="p-2 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-lg transition-colors"
                              title="Sửa"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(product.id)}
                              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                              title="Xóa"
                            >
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
          )
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200/60">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-slate-600">
              Không tìm thấy sản phẩm nào trong hệ thống khớp với bộ lọc của bạn.
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Hiển thị <span className="font-bold text-slate-900">{products.length}</span> sản phẩm (Tổng cộng <span className="font-bold text-slate-900">{totalProducts}</span>)
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-lg font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30">
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-lg font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Elegant Deletion Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6 transform scale-100 transition-all duration-300">
            <div className="flex items-center gap-4 text-red-500">
              <div className="p-3 bg-red-50 rounded-2xl">
                <Trash2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Xóa sản phẩm</h3>
                <p className="text-sm text-slate-500">Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            
            <p className="text-slate-600 text-sm leading-relaxed">
              Bạn có chắc chắn muốn xóa sản phẩm này ra khỏi hệ thống Hoang Nam Clothing? Các biến thể liên kết và hình ảnh của sản phẩm này cũng sẽ bị xóa.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeletingId(null);
                }}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-semibold transition-all text-sm disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/20 transition-all text-sm flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xóa sản phẩm</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
