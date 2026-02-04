"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import Image from "next/image";

export default function CreateProductPage() {
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState([
    { size: "S", color: "Đen", price: 350000, stock: 50 },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImages([...images, imageUrl]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", price: 0, stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="p-3 hover:bg-white rounded-xl border-2 border-transparent hover:border-slate-200 transition-all text-slate-500 hover:text-slate-800 shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Thêm sản phẩm mới
              </h1>
              <p className="text-slate-600 mt-1">
                Điền thông tin chi tiết cho sản phẩm
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="px-5 py-3 border-2 border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 hover:bg-white font-semibold transition-all shadow-sm"
            >
              Hủy bỏ
            </Link>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all">
              <Save size={20} />
              Lưu sản phẩm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Info size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Thông tin chung</h3>
                    <p className="text-blue-100 text-sm">
                      Thông tin cơ bản về sản phẩm
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Tag size={16} />
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Áo Thun Nam Basic Premium Cotton..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Mô tả chi tiết về sản phẩm, chất liệu, kiểu dáng, đặc điểm nổi bật..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all resize-none bg-slate-50 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Mô tả chi tiết giúp khách hàng hiểu rõ hơn về sản phẩm
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Giá & Kho hàng</h3>
                    <p className="text-emerald-100 text-sm">
                      Quản lý giá bán và số lượng tồn kho
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Giá bán (VNĐ)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="number"
                        placeholder="350000"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Giá khuyến mãi (VNĐ)
                    </label>
                    <div className="relative">
                      <Tag
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="number"
                        placeholder="280000"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Số lượng trong kho
                    </label>
                    <div className="relative">
                      <Package
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="number"
                        placeholder="100"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      SKU (Mã sản phẩm)
                    </label>
                    <input
                      type="text"
                      placeholder="AO-THUN-001"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-all bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Layers size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Biến thể sản phẩm</h3>
                      <p className="text-purple-100 text-sm">
                        Quản lý size, màu sắc và giá
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={addVariant}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Thêm
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-xl border-2 border-slate-100 hover:border-purple-200 transition-all"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Size
                      </label>
                      <select className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-all bg-white text-sm">
                        <option value="">Chọn size</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Màu sắc
                      </label>
                      <input
                        type="text"
                        placeholder="Đen, Trắng..."
                        defaultValue={variant.color}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-all bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Giá (VNĐ)
                      </label>
                      <input
                        type="number"
                        placeholder="350000"
                        defaultValue={variant.price}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-all bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        placeholder="50"
                        defaultValue={variant.stock}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-all bg-white text-sm"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => removeVariant(index)}
                        className="w-full py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-6">
            {/* Organization */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Phân loại</h3>
                    <p className="text-orange-100 text-sm">
                      Danh mục & trạng thái
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Danh mục
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white">
                    <option value="">Chọn danh mục</option>
                    <option value="ao-thun">Áo Thun</option>
                    <option value="quan-jeans">Quần Jeans</option>
                    <option value="ao-khoac">Áo Khoác</option>
                    <option value="ao-so-mi">Áo Sơ Mi</option>
                    <option value="quan-short">Quần Short</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Trạng thái
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white">
                    <option value="active">Đang bán</option>
                    <option value="draft">Nháp</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Thẻ tags
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tags, cách nhau bởi dấu phẩy"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none transition-all bg-slate-50 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    VD: thời trang, nam, basic
                  </p>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <ImageIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Hình ảnh</h3>
                    <p className="text-cyan-100 text-sm">
                      Tải lên ảnh sản phẩm
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 group"
                    >
                      <Image
                        src={img}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => removeImage(idx)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all group">
                    <Upload
                      size={32}
                      className="text-slate-400 group-hover:text-blue-600 mb-2 transition-colors"
                    />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                      Tải ảnh lên
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-700 font-medium flex items-start gap-2">
                    <Info size={14} className="flex-shrink-0 mt-0.5" />
                    <span>
                      Định dạng hỗ trợ: JPG, PNG, WebP. Tối đa 5MB. Khuyến nghị
                      tỷ lệ 1:1 (vuông).
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* SEO (Optional) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Tag size={18} />
                SEO (Tùy chọn)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    placeholder="Tiêu đề tối ưu SEO"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-slate-50 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả ngắn gọn cho công cụ tìm kiếm"
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all resize-none bg-slate-50 focus:bg-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
