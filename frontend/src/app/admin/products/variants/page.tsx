"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  ArrowLeft,
} from "lucide-react";
import { VariantFormData } from "@/types/variantForm";
import VariantFormModal from "@/components/admin/product/VariantFormModal";

const VariantManagement = () => {
  const [variants, setVariants] = useState([
    {
      id: 1,
      color: "Black",
      size: "L",
      price: 250000,
      stock: 50,
      status: "ACTIVE",
      sku: "HN-POLO-BLK-L",
    },
    {
      id: 2,
      color: "Black",
      size: "XL",
      price: 250000,
      stock: 30,
      status: "INACTIVE",
      sku: "HN-POLO-BLK-XL",
    },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);

  const handleSubmitVariant = async (data: VariantFormData) => {
    if (editingVariant) {
      // await api.patch(`/admin/variants/${editingVariant.id}`, data);
    } else {
      // await api.post(`/admin/variants`, {
      //   productId,
      //   ...data,
      // });
    }
    setOpenModal(false);
    // reloadVariants();
  };
  // const handleSaveAll = async () => {
  //   const dirtyVariants = variants.filter((v) => v.isDirty);

  //   await Promise.all(
  //     dirtyVariants.map((v) =>
  //       api.patch(`/admin/variants/${v.id}`, {
  //         price: v.price,
  //         stockQuantity: v.stock,
  //         status: v.status,
  //       }),
  //     ),
  //   );
  // };

  const products = [
    {
      id: 1,
      name: "Product 1",
    },
    {
      id: 2,
      name: "Product 2",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý Biến thể
          </h1>
          <p className="text-gray-500 text-sm">
            Thiết lập giá, kho và SKU cho từng kết hợp thuộc tính.
          </p>
        </div>
        <button className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-medium hover:bg-gray-800 transition-all shadow-sm">
          <Save size={18} className="mr-2" /> Lưu thay đổi
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Attribute Selector Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Thuộc tính sản phẩm</h2>
          <div className="flex gap-4 mb-4">
            <select
              className="px-4 py-2 border-1 outline-none focus:outline-none"
              name="categories"
              id=""
            >
              <option value="">Tìm theo danh mục sản phẩm</option>
              <option value="">Áo</option>
              <option value="">Quần</option>
              <option value="">Giày</option>
              <option value="">Phụ kiện</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                Sản phẩm
              </label>
              <div className="flex flex-wrap gap-2">
                <select name="" id="">
                  <option value="">Chọn sản phẩm</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <button className="p-1 border border-dashed border-gray-300 rounded-md text-gray-400 hover:text-black hover:border-black">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                Màu sắc
              </label>
              <div className="flex flex-wrap gap-2">
                {["Black", "White", "Navy"].map((v) => (
                  <span
                    key={v}
                    className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-sm font-medium"
                  >
                    {v}
                  </span>
                ))}
                <button className="p-1 border border-dashed border-gray-300 rounded-md text-gray-400 hover:text-black hover:border-black">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                Kích thước
              </label>
              <div className="flex flex-wrap gap-2">
                {["M", "L", "XL"].map((v) => (
                  <span
                    key={v}
                    className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-sm font-medium"
                  >
                    {v}
                  </span>
                ))}
                <button className="p-1 border border-dashed border-gray-300 rounded-md text-gray-400 hover:text-black hover:border-black">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <button className="px-4 py-2 border-lg bg-blue-300 text-white">
                Tạo biến thể sản phẩm
              </button>
            </div>
          </div>
        </div>

        {/* Variants Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-bottom border-gray-200 text-xs font-bold uppercase text-gray-500">
                <th className="px-6 py-4">Biến thể</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Giá bán (đ)</th>
                <th className="px-6 py-4">Tồn kho</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {variants.map((variant) => (
                <tr
                  key={variant.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <span className="font-semibold block">
                          {variant.color} / {variant.size}
                        </span>
                        <span className="text-xs text-gray-400">
                          2 thuộc tính
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500">
                    {variant.sku}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      defaultValue={variant.price}
                      className="w-28 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      defaultValue={variant.stock}
                      className="w-20 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center"
              onClick={() => {
                setEditingVariant(null);
                setOpenModal(true);
              }}
            >
              <Plus size={16} className="mr-1" /> Thêm biến thể thủ công
            </button>
          </div>
          <VariantFormModal
            open={openModal}
            mode={editingVariant ? "edit" : "create"}
            initialData={editingVariant}
            onSubmit={handleSubmitVariant}
            onClose={() => setOpenModal(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default VariantManagement;
