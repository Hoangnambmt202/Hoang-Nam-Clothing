"use client";

import { VariantFormData } from "@/types/variantForm";
import { X, Save, ImagePlus, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { productApi } from "@/lib/api/product";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: any;
  products?: any[];
  onSubmit: (data: any) => void;
  onClose: () => void;
};

export default function VariantFormModal({
  open,
  mode,
  initialData,
  products = [],
  onSubmit,
  onClose,
}: Props) {
  const { accessToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState<any>({
    productId: "",
    color: "",
    size: "",
    sku: "",
    price: 0,
    stockQuantity: 0,
    status: "ACTIVE",
  });
  
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setImages(initialData.images || []);
    } else {
      setForm({
        productId: products.length > 0 ? products[0].id : "",
        color: "",
        size: "",
        sku: "",
        price: 0,
        stockQuantity: 0,
        status: "ACTIVE",
      });
      setImages([]);
    }
  }, [initialData, products, open]);

  if (!open) return null;

  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!initialData?.id) {
      alert("Bạn chỉ có thể thêm ảnh khi chỉnh sửa biến thể đã tồn tại.");
      return;
    }

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const newImage = await productApi.createImage(initialData.id, {
          url: base64String,
          isThumbnail: images.length === 0,
        }, accessToken || "");
        
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("Tải ảnh thất bại!");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm("Xóa ảnh này? Hình ảnh sẽ bị xóa khỏi hệ thống lưu trữ.")) {
      try {
        await productApi.deleteImage(imageId, accessToken || "");
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      } catch (error) {
        console.error("Failed to delete image", error);
        alert("Xóa ảnh thất bại!");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50/50">
          <h3 className="font-bold text-xl text-gray-800">
            {mode === "create" ? "Thêm biến thể mới" : "Chỉnh sửa biến thể"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-6">
            
            {mode === "create" && (
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Sản phẩm <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.productId}
                  onChange={(e) => update("productId", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Màu sắc"
                value={form.color}
                onChange={(v: string) => update("color", v)}
                placeholder="VD: Đen, Trắng..."
              />
              <Input
                label="Kích thước"
                value={form.size}
                onChange={(v: string) => update("size", v)}
                placeholder="VD: S, M, L..."
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Giá bán (đ)"
                type="number"
                value={form.price}
                onChange={(v: string) => update("price", Number(v))}
              />
              <Input
                label="Tồn kho"
                type="number"
                value={form.stockQuantity}
                onChange={(v: string) => update("stockQuantity", Number(v))}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Mã SKU"
                value={form.sku}
                onChange={(v: string) => update("sku", v)}
                placeholder="Tự động sinh nếu để trống"
                disabled={mode === 'create'}
              />
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
                  Trạng thái
                </label>
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="ACTIVE">Kinh doanh (Active)</option>
                  <option value="INACTIVE">Ngừng bán (Inactive)</option>
                </select>
              </div>
            </div>

            {/* Images Section */}
            {mode === "edit" && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold uppercase text-gray-700">
                    Hình ảnh biến thể
                  </label>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg flex items-center hover:bg-blue-100 transition-colors"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <ImagePlus className="w-4 h-4 mr-1" />}
                      Tải ảnh lên
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative group w-24 h-24 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <img src={img.url} alt="Variant" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => handleDeleteImage(img.id)}
                          className="bg-white/90 text-red-500 p-1.5 rounded-md hover:bg-white transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                      Chưa có hình ảnh nào cho biến thể này.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg flex items-center hover:bg-gray-800 transition-colors shadow-md"
          >
            <Save size={18} className="mr-2" />
            {mode === "create" ? "Tạo biến thể" : "Lưu thông tin"}
          </button>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, value, onChange, type = "text", placeholder, disabled }: any) => (
  <div>
    <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 transition-shadow"
    />
  </div>
);
