"use client";

import { useState } from "react";
import { Package, AlertTriangle, TrendingUp, Search } from "lucide-react";

const inventoryMock = [
  {
    id: 1,
    product: "Áo Polo Nam",
    variant: "Black / L",
    sku: "HN-POLO-BLK-L",
    stock: 50,
    status: "IN_STOCK",
  },
  {
    id: 2,
    product: "Áo Polo Nam",
    variant: "Black / XL",
    sku: "HN-POLO-BLK-XL",
    stock: 3,
    status: "LOW_STOCK",
  },
  {
    id: 3,
    product: "Áo Thun Basic",
    variant: "White / M",
    sku: "ATB-WHT-M",
    stock: 0,
    status: "OUT_OF_STOCK",
  },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const filtered = inventoryMock.filter(
    (i) =>
      i.product.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý kho hàng</h1>
        <p className="text-sm text-gray-500">
          Theo dõi tồn kho sản phẩm & biến thể
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Tổng sản phẩm" value="128" icon={<Package />} />
        <StatCard
          title="Sắp hết hàng"
          value="12"
          icon={<AlertTriangle />}
          warning
        />
        <StatCard title="Biến thể đang bán" value="342" icon={<TrendingUp />} />
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc SKU"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left">Sản phẩm</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Tồn kho</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium">{item.product}</div>
                  <div className="text-xs text-gray-400">{item.variant}</div>
                </td>
                <td className="px-6 py-4 font-mono text-gray-500">
                  {item.sku}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    defaultValue={item.stock}
                    className="w-20 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline text-xs font-semibold">
                    Lưu
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

const StatCard = ({ title, value, icon, warning }: any) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-xs text-gray-500 uppercase font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div
      className={`p-3 rounded-lg ${
        warning ? "bg-red-50 text-red-600" : "bg-gray-100"
      }`}
    >
      {icon}
    </div>
  </div>
);

const StatusBadge = ({ status }: any) => {
  const map: any = {
    IN_STOCK: {
      label: "Còn hàng",
      class: "bg-green-100 text-green-700",
    },
    LOW_STOCK: {
      label: "Sắp hết",
      class: "bg-yellow-100 text-yellow-700",
    },
    OUT_OF_STOCK: {
      label: "Hết hàng",
      class: "bg-red-100 text-red-700",
    },
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status].class}`}
    >
      {map[status].label}
    </span>
  );
};
