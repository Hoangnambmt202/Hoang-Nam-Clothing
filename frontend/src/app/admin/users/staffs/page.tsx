"use client";

import { useState } from "react";
import { UserPlus, Search, Shield, User, UserX } from "lucide-react";

const staffMock = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a.nguyen@shop.com",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b.tran@shop.com",
    role: "STAFF",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c.le@shop.com",
    role: "STAFF",
    status: "INACTIVE",
  },
];

export default function StaffManagementPage() {
  const [search, setSearch] = useState("");

  const filtered = staffMock.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý nhân viên
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý tài khoản và phân quyền nhân sự
          </p>
        </div>
        <button className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-medium hover:bg-gray-800">
          <UserPlus size={18} className="mr-2" />
          Thêm nhân viên
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Tổng nhân viên" value="24" icon={<User />} />
        <StatCard title="Admin" value="3" icon={<Shield />} />
        <StatCard title="Đã vô hiệu" value="2" icon={<UserX />} warning />
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
              placeholder="Tìm theo tên hoặc email"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left">Nhân viên</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium">{staff.name}</div>
                  <div className="text-xs text-gray-400">{staff.email}</div>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={staff.role} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={staff.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 text-xs font-semibold hover:underline mr-4">
                    Sửa
                  </button>
                  <button className="text-red-600 text-xs font-semibold hover:underline">
                    {staff.status === "ACTIVE" ? "Vô hiệu" : "Kích hoạt"}
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

const RoleBadge = ({ role }: any) => {
  const map: any = {
    ADMIN: "bg-purple-100 text-purple-700",
    STAFF: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[role]}`}
    >
      {role}
    </span>
  );
};

const StatusBadge = ({ status }: any) => {
  const map: any = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-200 text-gray-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {status === "ACTIVE" ? "Đang hoạt động" : "Vô hiệu"}
    </span>
  );
};
