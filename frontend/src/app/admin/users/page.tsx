"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Shield,
  UserCheck,
  UserX,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
  Users,
  UserPlus,
} from "lucide-react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const MOCK_USERS = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0901234567",
      role: "customer",
      status: "active",
      spent: 12500000,
      orders: 12,
      joinDate: "01/01/2024",
      avatar: "NA",
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Admin User",
      email: "admin@hoangnam.com",
      phone: "0999999999",
      role: "admin",
      status: "active",
      spent: 0,
      orders: 0,
      joinDate: "01/01/2023",
      avatar: "AD",
      color: "bg-purple-500",
    },
    {
      id: 3,
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      phone: "0902345678",
      role: "customer",
      status: "blocked",
      spent: 450000,
      orders: 2,
      joinDate: "15/01/2024",
      avatar: "TB",
      color: "bg-pink-500",
    },
    {
      id: 4,
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      phone: "0903456789",
      role: "customer",
      status: "active",
      spent: 8900000,
      orders: 8,
      joinDate: "20/01/2024",
      avatar: "LC",
      color: "bg-green-500",
    },
    {
      id: 5,
      name: "Sale Staff",
      email: "staff@hoangnam.com",
      phone: "0988888888",
      role: "staff",
      status: "active",
      spent: 0,
      orders: 0,
      joinDate: "05/01/2024",
      avatar: "ST",
      color: "bg-orange-500",
    },
  ];

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Quản lý tài khoản
            </h1>
            <p className="text-slate-600 mt-1">
              Quản lý khách hàng và nhân viên hệ thống
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm">
              <Download size={18} />
              <span>Xuất Excel</span>
            </button>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25">
              <UserPlus size={18} />
              <span>Thêm tài khoản</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-medium text-sm">
                  Tổng thành viên
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  1,245
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-emerald-600 font-semibold">
              <span>+12%</span>
              <span className="text-slate-400 font-normal">
                so với tháng trước
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-medium text-sm">
                  Khách hàng mới
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">56</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <UserPlus size={24} className="text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-emerald-600 font-semibold">
              <span>+5.2%</span>
              <span className="text-slate-400 font-normal">trong tuần này</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-medium text-sm">
                  Đang hoạt động
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">892</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <UserCheck size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-slate-400">
              <span>72% tổng số user</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-medium text-sm">Bị chặn</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">3</h3>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <UserX size={24} className="text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-red-600 font-semibold">
              <span>+1</span>
              <span className="text-slate-400 font-normal">hôm qua</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 focus:bg-white min-w-[160px]"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="customer">Khách hàng</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </select>

              <select
                className="px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-slate-50 focus:bg-white min-w-[160px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="blocked">Đã chặn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Thành viên
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Chi tiêu
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-white font-bold shadow-sm`}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: #{1000 + user.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="flex-shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="flex-shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize 
                             ${
                               user.role === "admin"
                                 ? "bg-purple-100 text-purple-700 ring-1 ring-purple-200"
                                 : user.role === "staff"
                                   ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200"
                                   : "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                             }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900">
                        {formatCurrency(user.spent)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.orders} đơn hàng
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === "active" ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit ring-1 ring-emerald-200">
                        <UserCheck size={12} />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit ring-1 ring-red-200">
                        <UserX size={12} />
                        Đã chặn
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t-2 border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Hiển thị <span className="font-bold text-slate-900">1-5</span>{" "}
              trong số <span className="font-bold text-slate-900">1,245</span>{" "}
              thành viên
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border-2 border-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-600 disabled:opacity-50">
                Trước
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                1
              </button>
              <button className="px-3 py-1.5 border-2 border-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-600">
                2
              </button>
              <button className="px-3 py-1.5 border-2 border-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-600">
                3
              </button>
              <button className="px-3 py-1.5 border-2 border-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-600">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
