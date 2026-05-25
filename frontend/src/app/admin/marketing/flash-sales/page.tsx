"use client";

import FlashSaleModal from "@/components/admin/marketing/flash-sale/FlashSaleModal";
import FlashSaleTable from "@/components/admin/marketing/flash-sale/FlashSaleTable";
import { Plus, Zap } from "lucide-react";
import { useState } from "react";

export default function FlashSalePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <Zap className="text-red-500" /> Quản lý Flash Sale
          </h1>
          <p className="text-sm text-slate-600">
            Tạo và quản lý các chương trình giảm giá nhanh
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus size={16} /> Tạo Flash Sale
        </button>
      </div>

      {/* Table */}
      <FlashSaleTable />

      {/* Modal */}
      <FlashSaleModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
