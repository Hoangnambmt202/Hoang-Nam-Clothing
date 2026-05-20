"use client";

import { useState } from "react";
import { Search, Filter, Clock, User, ShieldCheck } from "lucide-react";

const activityLogsMock = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    action: "Tạo sản phẩm",
    target: "Áo Polo Nam",
    ip: "192.168.1.10",
    createdAt: "2026-02-05 10:15",
    type: "CREATE",
  },
  {
    id: 2,
    user: "Trần Thị B",
    action: "Cập nhật tồn kho",
    target: "HN-POLO-BLK-L",
    ip: "192.168.1.22",
    createdAt: "2026-02-05 09:40",
    type: "UPDATE",
  },
  {
    id: 3,
    user: "Nguyễn Văn A",
    action: "Vô hiệu nhân viên",
    target: "Lê Văn C",
    ip: "192.168.1.10",
    createdAt: "2026-02-04 18:30",
    type: "SECURITY",
  },
];

export default function ActivityLogPage() {
  const [search, setSearch] = useState("");

  const filtered = activityLogsMock.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.toLowerCase().includes(search.toLowerCase()) ||
      log.createdAt.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Nhật ký hoạt động</h1>
        <p className="text-sm text-gray-500">
          Theo dõi toàn bộ thao tác người dùng trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="relative w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo user, hành động, đối tượng"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <select className="px-3 py-2 border border-gray-200 rounded-md text-sm">
            <option value="">Tất cả hành động</option>
            <option value="CREATE">Tạo</option>
            <option value="UPDATE">Cập nhật</option>
            <option value="DELETE">Xoá</option>
            <option value="SECURITY">Bảo mật</option>
          </select>

          <select className="px-3 py-2 border border-gray-200 rounded-md text-sm">
            <option value="">Tất cả người dùng</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left">Thời gian</th>
              <th className="px-6 py-4 text-left">Người dùng</th>
              <th className="px-6 py-4 text-left">Hành động</th>
              <th className="px-6 py-4 text-left">Đối tượng</th>
              <th className="px-6 py-4">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-left">{log.createdAt}</td>
                <td className="px-6 py-4 text-left">{log.user}</td>
                <td className="px-6 py-4 text-left">{log.action}</td>
                <td className="px-6 py-4 text-left">{log.target}</td>
                <td className="px-6 py-4 text-left">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

const ActionBadge = ({ type }: any) => {
  const map: any = {
    CREATE: "bg-green-100 text-green-700",
    UPDATE: "bg-blue-100 text-blue-700",
    DELETE: "bg-red-100 text-red-700",
    SECURITY: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${map[type]}`}>
      {type}
    </span>
  );
};
