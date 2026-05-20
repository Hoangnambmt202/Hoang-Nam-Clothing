"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  Layers,
  Info,
  Plus,
  Trash2,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { productApi } from "@/lib/api/product";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "nextjs-toast-notify";

// Preset image URLs for easy testing
const PRESET_IMAGES = [
  {
    name: "Áo Thun Trắng",
    url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800",
  },
  {
    name: "Áo Thun Đen",
    url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800",
  },
  {
    name: "Áo Khoác Bomber",
    url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
  },
  {
    name: "Quần Jeans Xanh",
    url: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800",
  },
  {
    name: "Áo Hoodie Xám",
    url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800",
  },
];

export default function CreateProductPage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    isActive: true,
    tags: "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isMainImage, setIsMainImage] = useState(false);
  const [images, setImages] = useState<{ url: string; is_thumbnail: boolean }[]>([]);
  const [variants, setVariants] = useState<
    { color: string; size: string; sku: string; price: number; stockQuantity: number }[]
  >([
    { color: "Trắng", size: "M", sku: "", price: 350000, stockQuantity: 50 },
  ]);

  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(true);

  // Fetch categories and brands on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        setFetchingMeta(true);
        // Get categories from product filters
        const filters = await productApi.getFilters();
        if (filters && filters.categories) {
          setCategories(filters.categories);
        }

        // Get brands
        const brandList = await productApi.getBrands();
        if (brandList) {
          setBrands(brandList);
        }
      } catch (err) {
        console.error("Lỗi khi tải metadata:", err);
        showToast.error("Không thể tải danh sách danh mục hoặc thương hiệu.", {
          duration: 2000,
        });
      } finally {
        setFetchingMeta(false);
      }
    }

    loadMeta();
  }, []);

  const handleAddImage = (url: string, asThumbnail: boolean = false) => {
    if (!url || !url.startsWith("http")) {
      showToast.error("Vui lòng nhập đường dẫn URL ảnh hợp lệ.", { duration: 2000 });
      return;
    }

    // If setting as thumbnail, unset previous thumbnails
    const newImages = images.map((img) =>
      asThumbnail ? { ...img, is_thumbnail: false } : img
    );

    setImages([...newImages, { url, is_thumbnail: asThumbnail || images.length === 0 }]);
    setNewImageUrl("");
    setIsMainImage(false);
    showToast.success("Đã thêm ảnh thành công!", { duration: 1500 });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const wasThumbnail = newImages[index]?.is_thumbnail;
    newImages.splice(index, 1);

    // If we removed the thumbnail, assign the first remaining image as thumbnail
    if (wasThumbnail && newImages.length > 0) {
      newImages[0].is_thumbnail = true;
    }

    setImages(newImages);
  };

  const toggleThumbnail = (index: number) => {
    const newImages = images.map((img, idx) => ({
      ...img,
      is_thumbnail: idx === index,
    }));
    setImages(newImages);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", size: "", sku: "", price: 350000, stockQuantity: 50 },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) {
      showToast.error("Sản phẩm phải có ít nhất một biến thể.", { duration: 2000 });
      return;
    }
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const updateVariantField = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    };
    setVariants(newVariants);
  };

  const generateSKUs = () => {
    if (!product.name) {
      showToast.error("Vui lòng nhập tên sản phẩm trước khi tạo SKU.", { duration: 2000 });
      return;
    }

    // Helper to remove Vietnamese tones and convert to slug
    const removeTones = (str: string) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .toUpperCase()
        .trim();
    };

    const cleanName = removeTones(product.name).split(/\s+/).slice(0, 3).join("-");
    const newVariants = variants.map((v) => {
      const cleanColor = removeTones(v.color || "FREE").replace(/\s+/g, "");
      const cleanSize = removeTones(v.size || "ALL").replace(/\s+/g, "");
      const randomSuffix = Math.floor(100 + Math.random() * 900); // 3-digit random suffix
      const sku = `${cleanName}-${cleanColor}-${cleanSize}-${randomSuffix}`;
      return { ...v, sku };
    });

    setVariants(newVariants);
    showToast.success("Đã tự động tạo SKU cho các biến thể!", { duration: 2000 });
  };

  const handleCreateProduct = async () => {
    if (!accessToken) {
      showToast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", { duration: 2000 });
      return;
    }

    // Validation
    if (!product.name.trim()) {
      showToast.error("Vui lòng nhập tên sản phẩm.", { duration: 2000 });
      return;
    }
    if (!product.categoryId) {
      showToast.error("Vui lòng chọn danh mục sản phẩm.", { duration: 2000 });
      return;
    }
    if (images.length === 0) {
      showToast.error("Vui lòng thêm ít nhất một hình ảnh sản phẩm.", { duration: 2000 });
      return;
    }

    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.color.trim()) {
        showToast.error(`Vui lòng nhập màu sắc cho biến thể thứ ${i + 1}.`, { duration: 2000 });
        return;
      }
      if (!v.size.trim()) {
        showToast.error(`Vui lòng nhập kích cỡ cho biến thể thứ ${i + 1}.`, { duration: 2000 });
        return;
      }
      if (!v.sku.trim()) {
        showToast.error(`Vui lòng điền hoặc tự sinh SKU cho biến thể thứ ${i + 1}.`, {
          duration: 2000,
        });
        return;
      }
      if (Number(v.price) <= 0) {
        showToast.error(`Giá bán của biến thể thứ ${i + 1} phải lớn hơn 0.`, { duration: 2000 });
        return;
      }
    }

    try {
      setLoading(true);

      // 1. Prepare product payload
      const tagsArray = product.tags
        ? product.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const productPayload = {
        name: product.name,
        slug: "temp-slug", // Backend will override with slugify
        description: product.description,
        categoryId: product.categoryId,
        brandId: product.brandId || undefined,
        isActive: product.isActive,
        tags: tagsArray,
      };

      // 2. Post basic product
      const newProduct = await productApi.createProduct(productPayload, accessToken);
      if (!newProduct || !newProduct.id) {
        throw new Error("Không thể khởi tạo sản phẩm cơ bản.");
      }

      const productId = newProduct.id;

      // 3. Post Variants sequentially
      for (const v of variants) {
        const variantPayload = {
          color: v.color,
          size: v.size,
          sku: v.sku,
          price: Number(v.price),
          stockQuantity: Number(v.stockQuantity),
        };
        await productApi.createVariant(productId, variantPayload, accessToken);
      }

      // 4. Post Images sequentially
      for (const img of images) {
        const imagePayload = {
          url: img.url,
          is_thumbnail: img.is_thumbnail,
          productId, // Include to satisfy class-validator DTO constraints
        };
        await productApi.createImage(productId, imagePayload, accessToken);
      }

      showToast.success("Tạo sản phẩm và các thuộc tính thành công!", { duration: 3000 });
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Lỗi khi tạo sản phẩm:", err);
      const errMsg = err.message || "Đã xảy ra lỗi không xác định.";
      showToast.error(`Thất bại: ${errMsg}`, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (fetchingMeta) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-600 font-medium">Đang tải dữ liệu cấu hình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 p-6 md:p-10 font-sans">
      {/* Loading overlay when submitting */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center space-y-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <h4 className="text-xl font-bold text-slate-800">Đang lưu sản phẩm...</h4>
            <p className="text-slate-500 text-sm">
              Đang tạo bản ghi sản phẩm cha, lưu các biến thể kho hàng và tải liên kết hình ảnh lên
              hệ thống. Vui lòng không đóng trang.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/admin" className="hover:text-blue-600 transition-colors">
            Tổng quan
          </Link>
          <span>/</span>
          <Link href="/admin/products" className="hover:text-blue-600 transition-colors">
            Sản phẩm
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Thêm mới</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-3 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent tracking-tight">
                Thêm sản phẩm mới
              </h1>
              <p className="text-slate-600 mt-1">
                Thiết lập bộ sưu tập thời trang cao cấp với đầy đủ biến thể
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="px-5 py-3 border border-slate-300 hover:bg-white rounded-xl text-slate-700 font-semibold transition-all shadow-sm hover:shadow"
            >
              Hủy bỏ
            </Link>
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              onClick={handleCreateProduct}
            >
              <Save size={20} />
              Lưu sản phẩm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                    <Info size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Thông tin cơ bản</h3>
                    <p className="text-blue-100/80 text-xs">
                      Tên gọi và mô tả chi tiết của sản phẩm thời trang
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Tag size={16} className="text-indigo-500" />
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Áo Thun Basic Nike Premium..."
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Chất liệu cotton 100%, đường may tỉ mỉ, form ôm dáng thoải mái năng động phù hợp mùa hè..."
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all resize-none bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Cung cấp thông tin phong phú về chất liệu, thông số và cách bảo quản.
                  </p>
                </div>
              </div>
            </div>

            {/* Images Manager */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Hình ảnh sản phẩm</h3>
                    <p className="text-violet-100/80 text-xs">
                      Tải ảnh lên qua URL hoặc chọn ảnh mẫu bên dưới
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Image URL Form */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Đường dẫn URL hình ảnh (bắt đầu bằng http:// hoặc https://)
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:outline-none text-slate-800 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 md:pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isMainImage}
                        onChange={(e) => setIsMainImage(e.target.checked)}
                        className="rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                      />
                      <span className="text-sm text-slate-700 font-medium">Đặt làm ảnh chính</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddImage(newImageUrl, isMainImage)}
                      className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors text-sm shadow-sm cursor-pointer"
                    >
                      <Plus size={16} />
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Preset Fast Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" />
                    Thêm nhanh từ kho ảnh mẫu đẹp:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleAddImage(preset.url, images.length === 0)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-medium text-slate-700 hover:text-indigo-700 transition-all cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Images Grid list */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                          img.is_thumbnail
                            ? "border-violet-500 shadow-md shadow-violet-500/10"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="aspect-square relative bg-slate-50">
                          <img
                            src={img.url}
                            alt={`preview ${idx}`}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              // If image is broken, show fallback
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=300";
                            }}
                          />
                        </div>

                        {/* Badges and controls */}
                        {img.is_thumbnail && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-violet-600 text-white rounded-md text-[10px] font-bold shadow flex items-center gap-0.5">
                            <Check size={10} />
                            Ảnh chính
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!img.is_thumbnail && (
                            <button
                              type="button"
                              onClick={() => toggleThumbnail(idx)}
                              className="p-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold shadow hover:scale-105 transition-transform"
                              title="Đặt làm ảnh chính"
                            >
                              Chọn chính
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow hover:scale-105 transition-transform"
                            title="Xóa ảnh"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl py-10 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <ImageIcon size={40} className="mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">Chưa có hình ảnh nào được thêm.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Hãy dán một liên kết ảnh hoặc nhấp vào ảnh mẫu bên trên.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Variants Manager */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white">
                    <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                      <Layers size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Biến thể & Giá sản phẩm</h3>
                      <p className="text-emerald-100/80 text-xs">
                        Thiết lập màu sắc, kích cỡ, SKU, giá bán và tồn kho
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={generateSKUs}
                      className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={14} />
                      Tự sinh SKU
                    </button>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="px-3.5 py-1.5 bg-white text-emerald-800 rounded-xl font-bold text-xs transition-all flex items-center gap-1 hover:bg-emerald-50 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} />
                      Thêm mẫu
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {variants.map((v, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all relative group"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Màu sắc</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Đen, Trắng, Xám"
                        value={v.color}
                        onChange={(e) => updateVariantField(index, "color", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm text-slate-800 placeholder-slate-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Kích cỡ</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: S, M, L, XL"
                        value={v.size}
                        onChange={(e) => updateVariantField(index, "size", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm text-slate-800 placeholder-slate-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">SKU (Mã SKU)</label>
                      <input
                        type="text"
                        placeholder="Dùng nút Tự sinh SKU"
                        value={v.sku}
                        onChange={(e) => updateVariantField(index, "sku", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm font-mono text-indigo-700 placeholder-slate-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Giá bán (đ)</label>
                      <input
                        type="number"
                        placeholder="350000"
                        value={v.price}
                        onChange={(e) => updateVariantField(index, "price", Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm text-slate-800 font-medium"
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Số lượng</label>
                        <input
                          type="number"
                          placeholder="50"
                          value={v.stockQuantity}
                          onChange={(e) => updateVariantField(index, "stockQuantity", Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm text-slate-800 font-medium"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200 cursor-pointer"
                        title="Xóa biến thể"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-8">
            {/* Category & Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Phân loại</h3>
                    <p className="text-orange-100/80 text-[11px]">
                      Đặt danh mục & trạng thái hiển thị
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Category selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Danh mục sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-medium"
                    value={product.categoryId}
                    onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">Thương hiệu</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-medium"
                    value={product.brandId}
                    onChange={(e) => setProduct({ ...product, brandId: e.target.value })}
                  >
                    <option value="">Không có / Khác</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">Trạng thái bán</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-medium"
                    value={product.isActive ? "active" : "hidden"}
                    onChange={(e) => setProduct({ ...product, isActive: e.target.value === "active" })}
                  >
                    <option value="active">Đang kích hoạt (Được hiển thị)</option>
                    <option value="hidden">Nháp / Ẩn (Không hiển thị)</option>
                  </select>
                </div>

                {/* Tags input */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">Từ khóa Tags</label>
                  <input
                    type="text"
                    placeholder="basic, cotton, unisex"
                    value={product.tags}
                    onChange={(e) => setProduct({ ...product, tags: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">
                    Các từ khóa ngăn cách bằng dấu phẩy. Giúp khách hàng lọc tìm kiếm dễ dàng hơn.
                  </p>
                </div>
              </div>
            </div>

            {/* Help / Guidelines panel */}
            <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 border border-slate-800 space-y-4">
              <h4 className="text-white font-bold flex items-center gap-2 text-sm">
                <AlertCircle size={16} className="text-amber-500" />
                Hướng dẫn lưu ý
              </h4>
              <ul className="text-xs space-y-2 text-slate-400 list-disc list-inside">
                <li>Tạo các biến thể size riêng biệt để hiển thị đúng lựa chọn của người mua.</li>
                <li>Ảnh chính sẽ được sử dụng làm bìa ở danh sách cửa hàng.</li>
                <li>Mã SKU của biến thể phải là duy nhất trên toàn hệ thống.</li>
                <li>Sử dụng chức năng "Tự sinh SKU" để hệ thống tạo chuẩn mã bán hàng.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
