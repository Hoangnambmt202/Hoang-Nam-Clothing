"use client";

import { VariantFormData } from "@/types/variantForm";
import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: VariantFormData;
  onSubmit: (data: VariantFormData) => void;
  onClose: () => void;
};

export default function VariantFormModal({
  open,
  mode,
  initialData,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<VariantFormData>({
    color: "",
    size: "",
    sku: "",
    price: 0,
    stockQuantity: 0,
    status: "ACTIVE",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  if (!open) return null;

  const update = (key: keyof VariantFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-semibold text-lg">
            {mode === "create" ? "Thêm biến thể" : "Cập nhật biến thể"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Màu sắc"
              value={form.color}
              onChange={(v: string) => update("color", v)}
            />
            <Input
              label="Kích thước"
              value={form.size}
              onChange={(v: string) => update("size", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá bán"
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

          <div>
            <label className="text-xs font-semibold uppercase text-gray-400 mb-1 block">
              Trạng thái
            </label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as any)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black"
          >
            Huỷ
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="px-5 py-2 bg-black text-white text-sm rounded-lg flex items-center"
          >
            <Save size={16} className="mr-2" />
            {mode === "create" ? "Tạo biến thể" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="text-xs font-semibold uppercase text-gray-400 mb-1 block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
    />
  </div>
);
