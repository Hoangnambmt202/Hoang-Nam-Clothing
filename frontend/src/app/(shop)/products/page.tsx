"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/features/productsSlice";
import { fetchCategories } from "@/store/features/categoriesSlice";
import { fetchBrands } from "@/store/features/brandsSlice";
import { addItem, addToCartDb } from "@/store/features/cartSlice";
import { RootState, AppDispatch } from "@/store/store";
import { showToast } from "nextjs-toast-notify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Search,
  ShoppingCart,
  Filter,
  Grid3x3,
  List as ListIcon,
  ChevronDown,
  X,
  SlidersHorizontal
} from "lucide-react";
import WishlistHeartButton from "@/components/user/features/wishlist/WishlistHeartButton";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Global State
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { products, total, totalPages, loading } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { brands } = useSelector((state: RootState) => state.brands);

  // Local Filter State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: 12,
    q: searchParams.get("q") || "",
    categoryId: searchParams.get("categoryId") || "",
    brandId: searchParams.get("brandId") || "",
    sortBy: searchParams.get("sortBy") || "createdAt_desc",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Initial Data Fetch
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  // Fetch Products when filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Build query string params
      const queryParams: Record<string, any> = { ...filters };
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) delete queryParams[key];
      });

      // Update URL
      const urlParams = new URLSearchParams(queryParams as any);
      router.push(`/products?${urlParams.toString()}`, { scroll: false });

      // Prepare API params by splitting sortBy (e.g. "createdAt_desc" -> sortBy="createdAt", sortOrder="DESC")
      const apiParams = { ...queryParams };
      if (apiParams.sortBy && typeof apiParams.sortBy === "string" && apiParams.sortBy.includes("_")) {
        const [sortField, sortOrderParam] = apiParams.sortBy.split('_');
        apiParams.sortBy = sortField;
        apiParams.sortOrder = sortOrderParam.toUpperCase();
      }
      if (apiParams.q) {
        apiParams.search = apiParams.q;
        delete apiParams.q;
      }

      dispatch(fetchProducts(apiParams));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters, dispatch, router]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1, limit: 12, q: "", categoryId: "", brandId: "", sortBy: "createdAt_desc", minPrice: "", maxPrice: ""
    });
  };

  // Helper function to extract correct image and price
  const getProductDisplayInfo = (product: any) => {
    const productImages = (Array.from(
      new Map(
        product.variants
          ?.flatMap((v: any) => v.images || [])
          ?.map((img: any) => [img.url, img]) || []
      ).values()
    ) as any[]) || [];
    const mainImage = productImages.find((img: any) => img.isThumbnail || img.is_thumbnail)?.url ||
                      productImages[0]?.url ||
                      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";
    
    const lowestVariantPrice = product.variants?.length > 0 
      ? Math.min(...product.variants.map((v: any) => Number(v.price))) 
      : (product.price || 0);
    const price = product.salePrice ? product.salePrice : lowestVariantPrice;

    return { mainImage, price };
  };

  const renderProductCard = (product: any) => {
    const { mainImage, price } = getProductDisplayInfo(product);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        key={product.id}
        className={`group bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 relative ${
          viewMode === "list" ? "flex flex-row h-48" : "flex flex-col h-full hover:-translate-y-2"
        }`}
      >
        <div className="absolute top-4 right-4 z-20">
          <WishlistHeartButton productId={product.id} productName={product.name} />
        </div>
        <Link 
          href={`/products/${product.id}`} 
          className={`relative overflow-hidden block flex-shrink-0 ${viewMode === 'list' ? 'w-48 h-full' : 'aspect-[3/4] w-full'}`}
        >
          {product.salePrice && (
            <span className="absolute top-4 left-4 z-10 bg-red-500 text-white font-montserrat text-xs uppercase tracking-wider px-3 py-1 rounded-full font-semibold">
              Sale
            </span>
          )}
          <img
            src={mainImage}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        <div className={`p-6 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-center' : ''}`}>
          <span className="text-[10px] uppercase tracking-widest text-[#64748B] font-montserrat mb-2 block font-medium">
            {product.brand?.name || product.category?.name || "Premium Collection"}
          </span>
          <Link href={`/products/${product.id}`} className="flex-1">
            <h2 className="text-lg font-montserrat font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors line-clamp-2 mb-3">
              {product.name}
            </h2>
          </Link>
          
          {viewMode === "list" && (
            <p className="text-[#64748B] text-sm line-clamp-2 mb-4">
              {product.description || "Khám phá phong cách thời trang hiện đại với bộ sưu tập mới nhất."}
            </p>
          )}

          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-xl font-montserrat font-bold text-[#1E293B]">
                {Number(price).toLocaleString("vi-VN")}đ
              </span>
              {product.salePrice && product.price && (
                <span className="text-sm line-through text-[#94A3B8]">
                  {Number(product.price).toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>
            
            {(product.variants?.length ?? 0) > 1 ? (
              // Multiple variants → go to detail page to pick size/color
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/products/${product.id}`);
                }}
                title="Chọn biến thể sản phẩm"
                className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-[#1E293B] hover:text-white text-slate-700 rounded-xl transition-all duration-200 shadow-sm text-xs font-montserrat font-medium whitespace-nowrap"
              >
                <ShoppingCart size={15} />
                <span>Chọn mẫu</span>
              </button>
            ) : (
              // Single variant (or no variant) → add directly
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const firstVariant = product.variants?.[0];
                  const itemObj = {
                    id: product.id,
                    name: product.name,
                    price: Number(price),
                    quantity: 1,
                    image: mainImage,
                    variantId: firstVariant?.id,
                    size: firstVariant?.size || "",
                    color: firstVariant?.color || "",
                  };
                  if (accessToken) {
                    dispatch(addToCartDb({ item: itemObj, token: accessToken }) as any);
                  } else {
                    dispatch(addItem(itemObj));
                  }
                  showToast.success(`Đã thêm ${product.name} vào giỏ hàng!`, { duration: 2000 });
                }}
                title="Thêm vào giỏ hàng"
                className="p-3 bg-slate-50 hover:bg-[#1E293B] hover:text-white text-slate-700 rounded-xl transition-all duration-200 shadow-sm"
              >
                <ShoppingCart size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-manrope">
      {/* Header Title */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-[#1E293B] mb-4">
          Bộ Sưu Tập Sản Phẩm
        </h1>
        <p className="font-montserrat text-[#64748B] text-sm tracking-wide uppercase">
          Khám phá những thiết kế thời trang hiện đại và phong cách nhất
        </p>
      </div>

      {/* Filter Toggle Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 mb-6">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 font-montserrat font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
        >
          <SlidersHorizontal size={18} />
          {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
        </button>
        <span className="text-sm font-montserrat text-[#64748B]">{total} kết quả</span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:w-1/4 flex-shrink-0 lg:block overflow-hidden lg:overflow-visible"
            >
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm sticky top-24 space-y-8">
                
                <div className="flex items-center justify-between">
                  <h3 className="font-montserrat font-bold text-lg text-[#1E293B] flex items-center gap-2">
                    <Filter size={18} /> Lọc kết quả
                  </h3>
                  <button onClick={clearFilters} className="text-xs text-[#2563EB] hover:underline font-montserrat font-medium">
                    Xóa lọc
                  </button>
                </div>

                {/* Search Box */}
                <div>
                  <label className="text-xs font-montserrat uppercase tracking-wider text-[#64748B] font-semibold mb-3 block">
                    Tìm kiếm
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tên sản phẩm..."
                      value={filters.q}
                      onChange={(e) => handleFilterChange("q", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-montserrat focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-xs font-montserrat uppercase tracking-wider text-[#64748B] font-semibold mb-3 block">
                    Danh mục
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    <div 
                      onClick={() => handleFilterChange("categoryId", "")}
                      className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-montserrat transition-colors ${!filters.categoryId ? 'bg-[#2563EB] text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      Tất cả danh mục
                    </div>
                    {categories.map((cat: any) => (
                      <div 
                        key={cat.id}
                        onClick={() => handleFilterChange("categoryId", cat.id)}
                        className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-montserrat flex justify-between items-center transition-colors ${filters.categoryId === cat.id ? 'bg-[#2563EB] text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        <span>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="text-xs font-montserrat uppercase tracking-wider text-[#64748B] font-semibold mb-3 block">
                    Thương hiệu
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                    <div 
                      onClick={() => handleFilterChange("brandId", "")}
                      className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-montserrat transition-colors ${!filters.brandId ? 'bg-[#2563EB] text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      Tất cả thương hiệu
                    </div>
                    {brands.map((brand: any) => (
                      <div 
                        key={brand.id}
                        onClick={() => handleFilterChange("brandId", brand.id)}
                        className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-montserrat transition-colors ${filters.brandId === brand.id ? 'bg-[#2563EB] text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {brand.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-xs font-montserrat uppercase tracking-wider text-[#64748B] font-semibold mb-3 flex justify-between items-center">
                    <span>Khoảng giá (VNĐ)</span>
                    <span className="text-[#2563EB] lowercase font-bold text-[10px]">
                      0đ - {Number(filters.maxPrice || 10000000).toLocaleString('vi-VN')}đ
                    </span>
                  </label>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="range"
                      min="0"
                      max="20000000"
                      step="100000"
                      value={filters.maxPrice || 10000000}
                      onChange={(e) => {
                        handleFilterChange("minPrice", 0);
                        handleFilterChange("maxPrice", e.target.value);
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                    />
                  </div>
                </div>

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Top Bar */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-montserrat text-[#64748B] hidden lg:block">
              Hiển thị <span className="font-bold text-[#1E293B]">{products?.length || 0}</span> trên tổng số <span className="font-bold text-[#1E293B]">{total}</span> sản phẩm
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-montserrat font-medium text-[#64748B] uppercase tracking-wider hidden sm:inline-block">Sắp xếp:</span>
                <select 
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="bg-slate-50 border-none text-sm font-montserrat font-medium text-[#1E293B] py-2 px-4 rounded-xl focus:ring-2 focus:ring-[#2563EB]/20 outline-none cursor-pointer appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231E293B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] bg-[length:16px_16px]"
                >
                  <option value="createdAt_desc">Mới nhất</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="name_asc">Tên A-Z</option>
                </select>
              </div>

              {/* View Toggles */}
              <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center py-20 gap-4 bg-white rounded-3xl border border-zinc-100 shadow-sm">
              <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin" />
              <span className="font-montserrat text-sm text-[#64748B]">Đang tìm kiếm sản phẩm phù hợp...</span>
            </div>
          ) : products.length > 0 ? (
            <motion.div 
              layout
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
            >
              <AnimatePresence>
                {products.map(renderProductCard)}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex-1 bg-white rounded-3xl border border-zinc-100 shadow-sm p-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-cormorant font-bold text-[#1E293B] mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-[#64748B] font-montserrat text-sm max-w-md mb-6">
                Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. Thử thay đổi các tùy chọn để xem thêm.
              </p>
              <button 
                onClick={clearFilters}
                className="px-6 py-3 bg-[#1E293B] text-white rounded-xl font-montserrat font-medium hover:bg-[#0F172A] transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button 
                onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
                disabled={filters.page === 1}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white font-montserrat text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleFilterChange("page", i + 1)}
                  className={`w-10 h-10 rounded-xl font-montserrat text-sm font-medium transition-colors ${
                    filters.page === i + 1 
                      ? 'bg-[#1E293B] text-white shadow-md' 
                      : 'bg-white border border-zinc-200 text-[#1E293B] hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => handleFilterChange("page", Math.min(totalPages, filters.page + 1))}
                disabled={filters.page === totalPages}
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white font-montserrat text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
