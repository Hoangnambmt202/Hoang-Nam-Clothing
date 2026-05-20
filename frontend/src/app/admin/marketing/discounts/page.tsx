"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  TicketPercent,
  Calendar,
  PauseCircle,
  Ticket,
} from "lucide-react";

const discountsMock = [
  {
    id: 1,
    code: "SALE10",
    type: "PERCENT",
    value: 10,
    usage: "45 / 100",
    startAt: "2026-02-01",
    endAt: "2026-02-10",
    status: "ACTIVE",
  },
  {
    id: 2,
    code: "TET50K",
    type: "FIXED",
    value: 50000,
    usage: "120 / 120",
    startAt: "2026-01-20",
    endAt: "2026-01-30",
    status: "EXPIRED",
  },
  {
    id: 3,
    code: "VIP20",
    type: "PERCENT",
    value: 20,
    usage: "8 / ∞",
    startAt: "2026-02-01",
    endAt: "—",
    status: "INACTIVE",
  },
];

export default function DiscountManagementPage() {
  const [search, setSearch] = useState("");

  const filtered = discountsMock.filter((d) =>
    d.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Quản lý mã giảm giá{" "}
            <Ticket size={30} color="blue" className="inline-block" />
          </h1>
          <p className="text-sm text-gray-500">
            Tạo và quản lý chương trình khuyến mãi
          </p>
        </div>
        <button className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-medium hover:bg-gray-800">
          <Plus size={18} className="mr-2" />
          Tạo mã giảm giá
        </button>
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
              placeholder="Tìm theo mã giảm giá"
              className="w-full pl-9 pr-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left">Mã</th>
              <th className="px-6 py-4">Giảm</th>
              <th className="px-6 py-4">Sử dụng</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-mono font-semibold">{d.code}</td>
                <td className="px-6 py-4">
                  {d.type === "PERCENT"
                    ? `${d.value}%`
                    : `${d.value.toLocaleString()}₫`}
                </td>
                <td className="px-6 py-4 text-gray-500">{d.usage}</td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {d.startAt} → {d.endAt}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 text-xs font-semibold hover:underline mr-4">
                    Sửa
                  </button>
                  {d.status === "ACTIVE" && (
                    <button className="text-yellow-600 text-xs font-semibold hover:underline">
                      Tạm dừng
                    </button>
                  )}
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

const StatusBadge = ({ status }: any) => {
  const map: any = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-200 text-gray-600",
    EXPIRED: "bg-red-100 text-red-700",
  };

  const label: any = {
    ACTIVE: "Đang hoạt động",
    INACTIVE: "Tạm dừng",
    EXPIRED: "Hết hạn",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {label[status]}
    </span>
  );
};
