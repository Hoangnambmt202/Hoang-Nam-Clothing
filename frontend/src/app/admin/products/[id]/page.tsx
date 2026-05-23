"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Tag,
  Layers,
  Star,
  Eye,
  Copy,
  ExternalLink,
  Loader2,
  ImageIcon,
  Palette,
  Ruler,
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { productApi } from "@/lib/api/product";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "nextjs-toast-notify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductById, clearCurrentProduct } from "@/store/features/productsSlice";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const dispatch = useAppDispatch();
  const productId = params.id as string;

  const { currentProduct: product, loading } = useAppSelector((state) => state.products);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    dispatch(fetchProductById(productId));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [productId, dispatch]);

  const handleDelete = async () => {
    if (!accessToken) return;
    try {
      setIsDeleting(true);
      await productApi.deleteProduct(productId, accessToken);
      showToast.success("Đã xóa sản phẩm thành công!", { duration: 2000 });
      router.push("/admin/products");
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      showToast.error("Không thể xóa sản phẩm.", { duration: 2000 });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast.success("Đã sao chép!", { duration: 1000 });
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <span className="text-slate-500 font-medium">Đang tải thông tin sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">Không tìm thấy sản phẩm</h3>
          <Link href="/admin/products" className="text-blue-600 hover:underline font-medium">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const totalStock = product.variants?.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0) || 0;
  
  // Extract and deduplicate variant images
  const productImages = Array.from(
    new Map(
      product.variants
        ?.flatMap((v: any) => v.images || [])
        ?.map((img: any) => [img.url, img]) || []
    ).values()
  ) as any[];

  const mainImage = productImages.find((img: any) => img.isThumbnail || img.is_thumbnail)?.url
    || productImages[0]?.url
    || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Chi tiết sản phẩm
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">Xem thông tin đầy đủ của sản phẩm</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/products/${productId}/edit`}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 text-sm"
            >
              <Edit size={16} />
              Sửa sản phẩm
            </Link>
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/25 flex items-center gap-2 text-sm"
            >
              <Trash2 size={16} />
              Xóa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="relative aspect-square bg-slate-100">
                <Image
                  src={productImages?.[selectedImage]?.url || mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${
                  product.isActive
                    ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20"
                    : "bg-slate-100 text-slate-700 ring-slate-600/20"
                }`}>
                  {product.isActive ? "Đang bán" : "Nháp / Ẩn"}
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            {productImages && productImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {productImages.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Ảnh ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    {(img.isThumbnail || img.is_thumbnail) && (
                      <div className="absolute bottom-0.5 right-0.5 p-0.5 bg-blue-500 rounded-full">
                        <Star size={8} className="text-white fill-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-3 space-y-5">
            {/* Product Name & Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">{product.name}</h2>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {product.category?.name || "Chưa phân loại"}
                  </span>
                  {product.brand && (
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {product.brand.name}
                    </span>
                  )}
                </div>
              </div>

              {/* ID & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">ID Sản phẩm</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded font-mono truncate max-w-[180px]">
                      {product.id}
                    </code>
                    <button onClick={() => copyToClipboard(product.id)} className="p-1 hover:bg-slate-100 rounded transition-colors">
                      <Copy size={12} className="text-slate-400" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Slug</p>
                  <code className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded font-mono block truncate">
                    {product.slug}
                  </code>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Ngày tạo</p>
                  <p className="text-sm text-slate-700 font-medium">{product.createdAt ? formatDate(product.createdAt) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Cập nhật lần cuối</p>
                  <p className="text-sm text-slate-700 font-medium">{product.updatedAt ? formatDate(product.updatedAt) : "—"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Tag size={16} className="text-blue-500" />
                  Mô tả sản phẩm
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 text-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-fit mx-auto mb-2 shadow-lg shadow-blue-500/20">
                  <Layers size={20} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{product.variants?.length || 0}</p>
                <p className="text-xs text-slate-500 font-medium">Biến thể</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 text-center">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-fit mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{totalStock}</p>
                <p className="text-xs text-slate-500 font-medium">Tồn kho</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 text-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl w-fit mx-auto mb-2 shadow-lg shadow-purple-500/20">
                  <ImageIcon size={20} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{productImages.length}</p>
                <p className="text-xs text-slate-500 font-medium">Hình ảnh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Variants Table */}
        {product.variants && product.variants.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers size={20} className="text-blue-500" />
                Danh sách biến thể ({product.variants.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Màu sắc</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kích cỡ</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Giá bán</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tồn kho</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.variants.map((variant: any, idx: number) => (
                    <tr key={variant.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded font-mono">
                          {variant.sku || "—"}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Palette size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-700 font-medium">{variant.color || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Ruler size={14} className="text-slate-400" />
                          <span className="text-sm text-slate-700 font-medium">{variant.size || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {formatCurrency(Number(variant.price) || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${
                          variant.stockQuantity === 0 ? "text-red-500" :
                          variant.stockQuantity <= 10 ? "text-amber-500" : "text-slate-900"
                        }`}>
                          {variant.stockQuantity ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {variant.stockQuantity === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold ring-1 ring-red-200">
                            <XCircle size={12} /> Hết hàng
                          </span>
                        ) : variant.stockQuantity <= 10 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold ring-1 ring-amber-200">
                            <AlertCircle size={12} /> Sắp hết
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold ring-1 ring-emerald-200">
                            <CheckCircle2 size={12} /> Còn hàng
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Images Grid */}
        {productImages && productImages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon size={20} className="text-purple-500" />
                Thư viện hình ảnh ({productImages.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {productImages.map((img: any, idx: number) => (
                  <div
                    key={img.id || idx}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:shadow-lg transition-all"
                  >
                    <Image
                      src={img.url}
                      alt={`Ảnh sản phẩm ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {(img.isThumbnail || img.is_thumbnail) && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                        <Star size={10} className="fill-white" /> Ảnh chính
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm text-white rounded-lg text-[10px] font-medium">
                      {idx + 1}/{productImages.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Relation */}
        {product.categories && product.categories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Danh mục liên kết</h3>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((cat: any) => (
                <span
                  key={cat.id}
                  className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-full text-xs font-semibold border border-slate-200"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6">
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
              Bạn có chắc chắn muốn xóa sản phẩm <strong>&ldquo;{product.name}&rdquo;</strong>? Tất cả biến thể và hình ảnh liên kết cũng sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-semibold transition-all text-sm disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
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
