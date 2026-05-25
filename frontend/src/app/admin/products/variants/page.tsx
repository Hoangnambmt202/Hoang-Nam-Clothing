"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  Edit,
} from "lucide-react";
import { VariantFormData } from "@/types/variantForm";
import VariantFormModal from "@/components/admin/product/VariantFormModal";
import { productApi } from "@/lib/api/product";
import { useAuth } from "@/hooks/useAuth";

const VariantManagement = () => {
  const [variants, setVariants] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  
  // Quick Create State
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [availableColors, setAvailableColors] = useState<string[]>(["Trắng", "Đen", "Đỏ", "Xanh dương", "Vàng"]);
  const [availableSizes, setAvailableSizes] = useState<string[]>(["S", "M", "L", "XL", "XXL"]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isQuickCreating, setIsQuickCreating] = useState(false);
  
  // Custom inputs for quick preset
  const [customColor, setCustomColor] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [showCustomSize, setShowCustomSize] = useState(false);

  const { accessToken } = useAuth();

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [variantsData, productsData, filtersData] = await Promise.all([
        productApi.getAllVariants(),
        productApi.getProducts({ limit: 100 }), // Fetch up to 100 products for dropdown
        productApi.getFilters(),
      ]);
      setVariants(variantsData);
      setProducts(productsData?.products || []);
      
      // Merge fetched filters with defaults, deduplicate
      if (filtersData?.colors) {
        setAvailableColors(prev => Array.from(new Set([...prev, ...filtersData.colors])));
      }
      if (filtersData?.sizes) {
        setAvailableSizes(prev => Array.from(new Set([...prev, ...filtersData.sizes])));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSubmitVariant = async (data: VariantFormData) => {
    try {
      if (editingVariant) {
        await productApi.updateVariant(editingVariant.id, data, accessToken || "");
      } else {
        if (data.productId) {
          const skuSuffix = `${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`;
          const product = products.find(p => p.id === data.productId);
          const slug = product?.slug || 'product';
          const sku = `${slug.toUpperCase()}-${data.color}-${data.size}-${skuSuffix}`;
          
          await productApi.createVariant(data.productId, { ...data, sku }, accessToken || "");
        }
      }
      setOpenModal(false);
      fetchInitialData();
    } catch (error: any) {
      alert(error?.message || "Có lỗi xảy ra");
    }
  };
  
  const handleDeleteVariant = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa biến thể này? Hình ảnh của biến thể cũng sẽ bị xóa khỏi hệ thống.")) {
      try {
        await productApi.deleteVariant(id, accessToken || "");
        fetchInitialData();
      } catch (error) {
        console.error("Delete failed", error);
        alert("Xóa thất bại");
      }
    }
  };

  const handleQuickCreate = async () => {
    if (!selectedProductId) return alert("Vui lòng chọn sản phẩm");
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      return alert("Vui lòng chọn ít nhất 1 màu và 1 kích thước");
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    try {
      setIsQuickCreating(true);
      for (const color of selectedColors) {
        for (const size of selectedSizes) {
          const skuSuffix = `${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`;
          const sku = `${product.slug.toUpperCase()}-${color}-${size}-${skuSuffix}`;
          const payload = {
            color,
            size,
            price: product.price || 0,
            stockQuantity: 0,
            sku,
            status: "ACTIVE",
          };
          
          // Tránh tạo trùng
          const exists = variants.find(v => v.product?.id === selectedProductId && v.color === color && v.size === size);
          if (!exists) {
            await productApi.createVariant(selectedProductId, payload, accessToken || "");
          }
        }
      }
      
      setSelectedColors([]);
      setSelectedSizes([]);
      fetchInitialData();
      alert("Tạo các biến thể thành công!");
    } catch (error: any) {
      alert(error?.message || "Có lỗi xảy ra khi tạo nhanh");
    } finally {
      setIsQuickCreating(false);
    }
  };

  const toggleSelection = (item: string, list: string[], setList: any) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddCustomColor = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (customColor.trim() && !availableColors.includes(customColor.trim())) {
      setAvailableColors([...availableColors, customColor.trim()]);
      setSelectedColors([...selectedColors, customColor.trim()]);
      setCustomColor("");
      setShowCustomColor(false);
    }
  };

  const handleAddCustomSize = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (customSize.trim() && !availableSizes.includes(customSize.trim())) {
      setAvailableSizes([...availableSizes, customSize.trim()]);
      setSelectedSizes([...selectedSizes, customSize.trim()]);
      setCustomSize("");
      setShowCustomSize(false);
    }
  };

  // Lọc variants theo sản phẩm đang được chọn (nếu có)
  const displayedVariants = selectedProductId 
    ? variants.filter(v => v.product?.id === selectedProductId)
    : variants;

  const handleInlineUpdate = async (id: string, field: string, value: any) => {
    try {
      await productApi.updateVariant(id, { [field]: Number(value) }, accessToken || "");
      // Cập nhật local state để UI phản hồi nhanh
      setVariants(variants.map(v => v.id === id ? { ...v, [field]: Number(value) } : v));
    } catch (error) {
      console.error("Update failed", error);
      fetchInitialData(); // Reset form
    }
  };

  if (loading && variants.length === 0) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý Biến thể
          </h1>
          <p className="text-gray-500 text-sm">
            Thiết lập giá, kho, SKU và hình ảnh cho từng kết hợp thuộc tính.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Quick Create Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 text-lg">Tạo nhanh Preset Biến Thể</h2>
          
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                Bộ Lọc / Chọn Sản phẩm
              </label>
              <select 
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">-- Tất cả sản phẩm --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProductId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                    Màu sắc
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleSelection(color, selectedColors, setSelectedColors)}
                        className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                          selectedColors.includes(color) 
                            ? "bg-black text-white border-black" 
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                    {!showCustomColor ? (
                      <button 
                        onClick={() => setShowCustomColor(true)}
                        className="p-1 border border-dashed border-gray-300 rounded-md text-gray-400 hover:text-black hover:border-black transition-colors flex items-center justify-center w-8 h-8"
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input 
                          type="text" 
                          autoFocus
                          value={customColor}
                          onChange={e => setCustomColor(e.target.value)}
                          onKeyDown={handleAddCustomColor}
                          onBlur={() => {
                            if(!customColor) setShowCustomColor(false);
                          }}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md outline-none focus:border-black"
                          placeholder="Màu mới"
                        />
                        <button onClick={handleAddCustomColor} className="p-1 bg-black text-white rounded-md">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                    Kích thước
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSelection(size, selectedSizes, setSelectedSizes)}
                        className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                          selectedSizes.includes(size) 
                            ? "bg-black text-white border-black" 
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                    {!showCustomSize ? (
                      <button 
                        onClick={() => setShowCustomSize(true)}
                        className="p-1 border border-dashed border-gray-300 rounded-md text-gray-400 hover:text-black hover:border-black transition-colors flex items-center justify-center w-8 h-8"
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input 
                          type="text" 
                          autoFocus
                          value={customSize}
                          onChange={e => setCustomSize(e.target.value)}
                          onKeyDown={handleAddCustomSize}
                          onBlur={() => {
                            if(!customSize) setShowCustomSize(false);
                          }}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md outline-none focus:border-black"
                          placeholder="Size mới"
                        />
                        <button onClick={handleAddCustomSize} className="p-1 bg-black text-white rounded-md">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button 
                    onClick={handleQuickCreate}
                    disabled={isQuickCreating || selectedColors.length === 0 || selectedSizes.length === 0}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isQuickCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                    Tạo {selectedColors.length * selectedSizes.length} biến thể ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Variants Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">
              Danh sách Biến thể {selectedProductId && `của sản phẩm được chọn`} ({displayedVariants.length})
            </h3>
            <button
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center"
              onClick={() => {
                setEditingVariant(null);
                setOpenModal(true);
              }}
            >
              <Plus size={16} className="mr-2" /> Thêm thủ công
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs font-bold uppercase text-gray-500">
                  <th className="px-6 py-4">Sản phẩm / Biến thể</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Giá bán (đ)</th>
                  <th className="px-6 py-4">Tồn kho</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {displayedVariants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded overflow-hidden flex items-center justify-center text-gray-400 shrink-0">
                          {variant.images && variant.images.length > 0 ? (
                            <img src={variant.images[0].url} alt="Variant" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold block text-gray-900">
                            {variant.product?.name || "N/A"}
                          </span>
                          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {variant.color} - {variant.size}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                      {variant.sku}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => setVariants(variants.map(v => v.id === variant.id ? { ...v, price: Number(e.target.value) } : v))}
                        onBlur={(e) => handleInlineUpdate(variant.id, 'price', e.target.value)}
                        className="w-28 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={variant.stockQuantity || 0}
                        onChange={(e) => setVariants(variants.map(v => v.id === variant.id ? { ...v, stockQuantity: Number(e.target.value) } : v))}
                        onBlur={(e) => handleInlineUpdate(variant.id, 'stockQuantity', e.target.value)}
                        className="w-24 border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => {
                            setEditingVariant(variant);
                            setOpenModal(true);
                          }}
                          title="Sửa ảnh & chi tiết"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDeleteVariant(variant.id)}
                          title="Xóa biến thể"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayedVariants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Không có biến thể nào được tìm thấy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <VariantFormModal
          open={openModal}
          mode={editingVariant ? "edit" : "create"}
          initialData={editingVariant}
          products={products}
          onSubmit={handleSubmitVariant}
          onClose={() => setOpenModal(false)}
        />
      </div>
    </div>
  );
};

export default VariantManagement;
