"use client";

import { useState, useEffect, useRef } from "react";
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
  Search,
} from "lucide-react";
import Image from "next/image";
import { productApi } from "@/lib/api/product";
import { categoryApi } from "@/lib/api/category";
import { brandApi } from "@/lib/api/brand";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "nextjs-toast-notify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  createCategory,
} from "@/store/features/categoriesSlice";
import { fetchBrands, createBrand } from "@/store/features/brandsSlice";

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
  const dispatch = useAppDispatch();
  const { categories: reduxCategories } = useAppSelector((s) => s.categories);
  const { brands: reduxBrands } = useAppSelector((s) => s.brands);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isMainImage, setIsMainImage] = useState(false);
  const [images, setImages] = useState<
    { url: string; is_thumbnail: boolean }[]
  >([]);
  const [variants, setVariants] = useState<
    {
      color: string;
      size: string;
      sku: string;
      price: number;
      stockQuantity: number;
      images: { url: string; is_thumbnail: boolean }[];
    }[]
  >([{ color: "Trắng", size: "M", sku: "", price: 350000, stockQuantity: 50, images: [] }]);

  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(true);

  // Fetch categories and brands via Redux on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    setFetchingMeta(false);
  }, [dispatch]);

  // Sync Redux state to local state
  useEffect(() => {
    if (reduxCategories.length > 0) setCategories(reduxCategories);
  }, [reduxCategories]);

  useEffect(() => {
    if (reduxBrands.length > 0) setBrands(reduxBrands);
  }, [reduxBrands]);

  // Quick-create category
  const handleQuickCreateCategory = async (name: string) => {
    if (!accessToken || !name.trim()) return;
    try {
      setCreatingCategory(true);
      const result = await dispatch(
        createCategory({ data: { name: name.trim() }, token: accessToken }),
      ).unwrap();
      if (result?.id) {
        setSelectedCategoryIds((prev) => [...prev, result.id]);
        if (!product.categoryId) {
          setProduct((p) => ({ ...p, categoryId: result.id }));
        }
        showToast.success(`Đã tạo danh mục "${name}" thành công!`, {
          duration: 2000,
        });
      }
      setCategorySearch("");
      setShowCategoryDropdown(false);
    } catch {
      showToast.error("Không thể tạo danh mục. Kiểm tra tên đã tồn tại.", {
        duration: 2000,
      });
    } finally {
      setCreatingCategory(false);
    }
  };

  // Quick-create brand
  const handleQuickCreateBrand = async (name: string) => {
    if (!accessToken || !name.trim()) return;
    try {
      setCreatingBrand(true);
      const result = await dispatch(
        createBrand({ data: { name: name.trim() }, token: accessToken }),
      ).unwrap();
      if (result?.id) {
        setProduct((p) => ({ ...p, brandId: result.id }));
        showToast.success(`Đã tạo thương hiệu "${name}" thành công!`, {
          duration: 2000,
        });
      }
      setBrandSearch("");
      setShowBrandDropdown(false);
    } catch {
      showToast.error("Không thể tạo thương hiệu. Kiểm tra tên đã tồn tại.", {
        duration: 2000,
      });
    } finally {
      setCreatingBrand(false);
    }
  };

  // Toggle category in multi-select
  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
    // Set primary categoryId to first selected
    setProduct((p) => {
      const next = selectedCategoryIds.includes(id)
        ? selectedCategoryIds.filter((cid) => cid !== id)
        : [...selectedCategoryIds, id];
      return { ...p, categoryId: next[0] || "" };
    });
  };

  const [uploadingFiles, setUploadingFiles] = useState(false);

  // File upload handler - uploads to Cloudinary via backend API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !accessToken) return;

    setUploadingFiles(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        showToast.error("Chỉ chấp nhận tệp hình ảnh (JPEG, PNG).", {
          duration: 2000,
        });
        continue;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/files/upload`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formData,
          },
        );

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        const cloudinaryUrl = data.url || data.data?.url;

        if (cloudinaryUrl) {
          setImages((prev) => [
            ...prev,
            { url: cloudinaryUrl, is_thumbnail: prev.length === 0 },
          ]);
          showToast.success(`Đã tải ảnh "${file.name}" lên thành công!`, {
            duration: 1500,
          });
        }
      } catch {
        showToast.error(`Lỗi khi tải ảnh "${file.name}" lên server.`, {
          duration: 2000,
        });
      }
    }
    setUploadingFiles(false);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleAddImage = (url: string, asThumbnail: boolean = false) => {
    if (!url || (!url.startsWith("http") && !url.startsWith("data:image/"))) {
      showToast.error("Vui lòng nhập đường dẫn URL ảnh hợp lệ.", {
        duration: 2000,
      });
      return;
    }

    // If setting as thumbnail, unset previous thumbnails
    const newImages = images.map((img) =>
      asThumbnail ? { ...img, is_thumbnail: false } : img,
    );

    setImages([
      ...newImages,
      { url, is_thumbnail: asThumbnail || images.length === 0 },
    ]);
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

  
  const handleFileUploadForVariant = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !accessToken) return;

    setUploadingFiles(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        const cloudinaryUrl = data.url || data.data?.url;
        if (cloudinaryUrl) {
          const newVariants = [...variants];
          newVariants[index].images.push({ url: cloudinaryUrl, is_thumbnail: newVariants[index].images.length === 0 });
          setVariants(newVariants);
        }
      } catch {}
    }
    setUploadingFiles(false);
    e.target.value = "";
  };

  const handleAddImageForVariant = (index: number, url: string) => {
    if (!url) return;
    const newVariants = [...variants];
    newVariants[index].images.push({ url, is_thumbnail: newVariants[index].images.length === 0 });
    setVariants(newVariants);
  };

  const removeImageForVariant = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images.splice(imageIndex, 1);
    if (newVariants[variantIndex].images.length > 0 && !newVariants[variantIndex].images.some(i => i.is_thumbnail)) {
      newVariants[variantIndex].images[0].is_thumbnail = true;
    }
    setVariants(newVariants);
  };

  const toggleThumbnailForVariant = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.map((img, idx) => ({
      ...img,
      is_thumbnail: idx === imageIndex,
    }));
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", size: "", sku: "", price: 350000, stockQuantity: 50, images: [] },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) {
      showToast.error("Sản phẩm phải có ít nhất một biến thể.", {
        duration: 2000,
      });
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
      showToast.error("Vui lòng nhập tên sản phẩm trước khi tạo SKU.", {
        duration: 2000,
      });
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

    const cleanName = removeTones(product.name)
      .split(/\s+/)
      .slice(0, 3)
      .join("-");
    const newVariants = variants.map((v) => {
      const cleanColor = removeTones(v.color || "FREE").replace(/\s+/g, "");
      const cleanSize = removeTones(v.size || "ALL").replace(/\s+/g, "");
      const randomSuffix = Math.floor(100 + Math.random() * 900); // 3-digit random suffix
      const sku = `${cleanName}-${cleanColor}-${cleanSize}-${randomSuffix}`;
      return { ...v, sku };
    });

    setVariants(newVariants);
    showToast.success("Đã tự động tạo SKU cho các biến thể!", {
      duration: 2000,
    });
  };

  const handleCreateProduct = async () => {
    if (!accessToken) {
      showToast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
        duration: 2000,
      });
      return;
    }

    // Validation
    if (!product.name.trim()) {
      showToast.error("Vui lòng nhập tên sản phẩm.", { duration: 2000 });
      return;
    }
    if (!product.categoryId && selectedCategoryIds.length === 0) {
      showToast.error("Vui lòng chọn danh mục sản phẩm.", { duration: 2000 });
      return;
    }


    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.color.trim()) {
        showToast.error(`Vui lòng nhập màu sắc cho biến thể thứ ${i + 1}.`, {
          duration: 2000,
        });
        return;
      }
      if (!v.size.trim()) {
        showToast.error(`Vui lòng nhập kích cỡ cho biến thể thứ ${i + 1}.`, {
          duration: 2000,
        });
        return;
      }
      if (!v.sku.trim()) {
        showToast.error(
          `Vui lòng điền hoặc tự sinh SKU cho biến thể thứ ${i + 1}.`,
          {
            duration: 2000,
          },
        );
        return;
      }
      if (Number(v.price) <= 0) {
        showToast.error(`Giá bán của biến thể thứ ${i + 1} phải lớn hơn 0.`, {
          duration: 2000,
        });
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
        categoryId:
          selectedCategoryIds.length > 0
            ? selectedCategoryIds[0]
            : product.categoryId,
        categoryIds:
          selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        brandId: product.brandId || undefined,
        isActive: product.isActive,
        tags: tagsArray,
      };

      // 2. Post basic product
      const newProduct = await productApi.createProduct(
        productPayload,
        accessToken,
      );
      if (!newProduct || !newProduct.id) {
        throw new Error("Không thể khởi tạo sản phẩm cơ bản.");
      }

      const productId = newProduct.id;

      // 3. Post Variants and Images sequentially
      for (const v of variants) {
        const variantPayload = {
          color: v.color,
          size: v.size,
          sku: v.sku,
          price: Number(v.price),
          stockQuantity: Number(v.stockQuantity),
        };
        const newVariant = await productApi.createVariant(productId, variantPayload, accessToken);
        
        if (newVariant && newVariant.id) {
          for (const img of v.images) {
            const imagePayload = {
              url: img.url,
              is_thumbnail: img.is_thumbnail
            };
            await productApi.createImage(newVariant.id, imagePayload, accessToken);
          }
        }
      }

      showToast.success("Tạo sản phẩm và các thuộc tính thành công!", {
        duration: 3000,
      });
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
          <p className="text-slate-600 font-medium">
            Đang tải dữ liệu cấu hình...
          </p>
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
            <h4 className="text-xl font-bold text-slate-800">
              Đang lưu sản phẩm...
            </h4>
            <p className="text-slate-500 text-sm">
              Đang tạo bản ghi sản phẩm cha, lưu các biến thể kho hàng và tải
              liên kết hình ảnh lên hệ thống. Vui lòng không đóng trang.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
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
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all resize-none bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Cung cấp thông tin phong phú về chất liệu, thông số và cách
                    bảo quản.
                  </p>
                </div>
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
                      <h3 className="text-lg font-bold">
                        Biến thể & Giá sản phẩm
                      </h3>
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

              <div className="p-2 space-y-4">
                {variants.map((v, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all relative group"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Màu sắc
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Đen, Trắng, Xám"
                        value={v.color}
                        onChange={(e) =>
                          updateVariantField(index, "color", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm text-slate-800 placeholder-slate-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Kích cỡ
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: S, M, L, XL"
                        value={v.size}
                        onChange={(e) =>
                          updateVariantField(index, "size", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm text-slate-800 placeholder-slate-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        SKU (Mã SKU)
                      </label>
                      <input
                        type="text"
                        placeholder="Tự động nếu để trống"
                        value={v.sku}
                        title="Sử dụng nút tự động sinh SKU"
                        onChange={(e) =>
                          updateVariantField(index, "sku", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm font-mono text-indigo-700 placeholder-slate-400 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Giá bán (đ)
                      </label>
                      <input
                        type="number"
                        placeholder="350000"
                        value={v.price}
                        onChange={(e) =>
                          updateVariantField(
                            index,
                            "price",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white text-sm text-slate-800 font-medium"
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Số lượng
                        </label>
                        <input
                          type="number"
                          placeholder="50"
                          value={v.stockQuantity}
                          onChange={(e) =>
                            updateVariantField(
                              index,
                              "stockQuantity",
                              Number(e.target.value),
                            )
                          }
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

                    {/* Variant Images */}
                    <div className="col-span-1 md:col-span-5 mt-2 pt-2 border-t border-slate-200">
                      <label className="block text-xs font-bold text-slate-700 mb-2">Hình ảnh biến thể</label>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="URL ảnh..."
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
                            id={`url-input-${index}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`url-input-${index}`) as HTMLInputElement;
                              handleAddImageForVariant(index, input.value);
                              input.value = '';
                            }}
                            className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-semibold"
                          >Thêm URL</button>
                          <label className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center">
                            Tải lên
                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUploadForVariant(index, e)} />
                          </label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {v.images.map((img, imgIdx) => (
                            <div key={imgIdx} className={`relative w-16 h-16 rounded-lg border-2 ${img.is_thumbnail ? 'border-violet-500' : 'border-slate-200'}`}>
                              <img src={img.url} alt="img" className="w-full h-full object-cover rounded-md" />
                              {img.is_thumbnail && <div className="absolute -top-2 -right-2 bg-violet-600 text-white rounded-full p-0.5"><Check size={10} /></div>}
                              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center gap-1 rounded-md transition-opacity">
                                <button type="button" onClick={() => toggleThumbnailForVariant(index, imgIdx)} className="p-1 text-white hover:text-violet-300"><Check size={12} /></button>
                                <button type="button" onClick={() => removeImageForVariant(index, imgIdx)} className="p-1 text-red-400 hover:text-red-300"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
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
                {/* Category multi-select with search */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Danh mục sản phẩm <span className="text-red-500">*</span>
                  </label>
                  {/* Selected tags */}
                  {selectedCategoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedCategoryIds.map((cid) => {
                        const cat = categories.find((c) => c.id === cid);
                        return cat ? (
                          <span
                            key={cid}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-semibold border border-orange-200"
                          >
                            {cat.name}
                            <button
                              type="button"
                              onClick={() => toggleCategory(cid)}
                              className="hover:text-red-600 cursor-pointer"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm hoặc tạo danh mục..."
                      value={categorySearch}
                      onChange={(e) => {
                        setCategorySearch(e.target.value);
                        setShowCategoryDropdown(true);
                      }}
                      onFocus={() => setShowCategoryDropdown(true)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-medium text-sm"
                    />
                    <Search
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                  {showCategoryDropdown && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {categories
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(categorySearch.toLowerCase()),
                        )
                        .map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              toggleCategory(c.id);
                              setShowCategoryDropdown(false);
                              setCategorySearch("");
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between cursor-pointer ${selectedCategoryIds.includes(c.id) ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-700"}`}
                          >
                            {c.name}
                            {selectedCategoryIds.includes(c.id) && (
                              <Check size={14} className="text-orange-600" />
                            )}
                          </button>
                        ))}
                      {categorySearch.trim() &&
                        !categories.some(
                          (c) =>
                            c.name.toLowerCase() ===
                            categorySearch.toLowerCase(),
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleQuickCreateCategory(categorySearch)
                            }
                            disabled={creatingCategory}
                            className="w-full text-left px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 font-semibold flex items-center gap-1.5 cursor-pointer border-t border-slate-100"
                          >
                            {creatingCategory ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Plus size={14} />
                            )}
                            + Tạo nhanh &quot;{categorySearch}&quot;
                          </button>
                        )}
                      {categories.filter((c) =>
                        c.name
                          .toLowerCase()
                          .includes(categorySearch.toLowerCase()),
                      ).length === 0 &&
                        !categorySearch.trim() && (
                          <div className="px-4 py-3 text-sm text-slate-400">
                            Không có danh mục nào
                          </div>
                        )}
                    </div>
                  )}
                </div>

                {/* Brand selector with search */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Thương hiệu
                  </label>
                  {product.brandId && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold border border-blue-200">
                        {brands.find((b) => b.id === product.brandId)?.name ||
                          ""}
                        <button
                          type="button"
                          onClick={() =>
                            setProduct((p) => ({ ...p, brandId: "" }))
                          }
                          className="hover:text-red-600 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm hoặc tạo thương hiệu..."
                      value={brandSearch}
                      onChange={(e) => {
                        setBrandSearch(e.target.value);
                        setShowBrandDropdown(true);
                      }}
                      onFocus={() => setShowBrandDropdown(true)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-medium text-sm"
                    />
                    <Search
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                  {showBrandDropdown && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setProduct((p) => ({ ...p, brandId: "" }));
                          setShowBrandDropdown(false);
                          setBrandSearch("");
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-500 cursor-pointer ${!product.brandId ? "font-semibold" : ""}`}
                      >
                        Không có / Khác
                      </button>
                      {brands
                        .filter((b) =>
                          b.name
                            .toLowerCase()
                            .includes(brandSearch.toLowerCase()),
                        )
                        .map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setProduct((p) => ({ ...p, brandId: b.id }));
                              setShowBrandDropdown(false);
                              setBrandSearch("");
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-center justify-between cursor-pointer ${product.brandId === b.id ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700"}`}
                          >
                            {b.name}
                            {product.brandId === b.id && (
                              <Check size={14} className="text-blue-600" />
                            )}
                          </button>
                        ))}
                      {brandSearch.trim() &&
                        !brands.some(
                          (b) =>
                            b.name.toLowerCase() === brandSearch.toLowerCase(),
                        ) && (
                          <button
                            type="button"
                            onClick={() => handleQuickCreateBrand(brandSearch)}
                            disabled={creatingBrand}
                            className="w-full text-left px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 font-semibold flex items-center gap-1.5 cursor-pointer border-t border-slate-100"
                          >
                            {creatingBrand ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Plus size={14} />
                            )}
                            + Tạo nhanh &quot;{brandSearch}&quot;
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {/* Display Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Trạng thái bán
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-medium"
                    value={product.isActive ? "active" : "hidden"}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        isActive: e.target.value === "active",
                      })
                    }
                  >
                    <option value="active">
                      Đang kích hoạt (Được hiển thị)
                    </option>
                    <option value="hidden">Nháp / Ẩn (Không hiển thị)</option>
                  </select>
                </div>

                {/* Tags input */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Từ khóa Tags
                  </label>
                  <input
                    type="text"
                    placeholder="basic, cotton, unisex"
                    value={product.tags}
                    onChange={(e) =>
                      setProduct({ ...product, tags: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">
                    Các từ khóa ngăn cách bằng dấu phẩy. Giúp khách hàng lọc tìm
                    kiếm dễ dàng hơn.
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
                <li>
                  Tạo các biến thể size riêng biệt để hiển thị đúng lựa chọn của
                  người mua.
                </li>
                <li>Ảnh chính sẽ được sử dụng làm bìa ở danh sách cửa hàng.</li>
                <li>
                  Mã SKU của biến thể phải là duy nhất trên toàn hệ thống.
                </li>
                <li>
                  Sử dụng chức năng "Tự sinh SKU" để hệ thống tạo chuẩn mã bán
                  hàng.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
