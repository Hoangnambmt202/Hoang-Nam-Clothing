"use client";

import { useState } from "react";
import {
  Search,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Download,
  Trash2,
  Edit,
  Eye,
  Users,
  UserPlus,
  Ticket,
  Star,
  History,
} from "lucide-react";

export default function CustomerManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");

  const MOCK_CUSTOMERS = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana.nguyen@example.com",
      phone: "0901234567",
      tier: "Kim cương",
      status: "active",
      totalSpent: 45200000,
      totalOrders: 28,
      lastOrder: "02/02/2026",
      avatar: "NA",
      color: "bg-slate-900", // Dark for premium
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      phone: "0902345678",
      tier: "Vàng",
      status: "active",
      totalSpent: 12500000,
      totalOrders: 12,
      lastOrder: "28/01/2026",
      avatar: "TB",
      color: "bg-yellow-500",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      phone: "0903456789",
      tier: "Thành viên",
      status: "blocked",
      totalSpent: 0,
      totalOrders: 0,
      lastOrder: "Chưa có",
      avatar: "LC",
      color: "bg-slate-400",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header - Minimalist Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter ">
              Danh sách khách hàng
            </h1>
            <p className="text-slate-500 font-medium">
              Danh sách và phân hạng khách hàng hệ thống Hoang Nam
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold text-sm">
              <Download size={16} /> Xuất báo cáo
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-slate-800 transition-all font-semibold text-sm">
              <UserPlus size={16} /> Thêm khách hàng
            </button>
          </div>
        </div>

        {/* Quick Stats - Solid Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-slate-200 rounded-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Tổng khách hàng
            </p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-4xl font-black">1.24K</h3>
              <span className="text-emerald-500 text-sm font-bold">+12%</span>
            </div>
          </div>
          <div className="p-6 border border-slate-200 rounded-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Chi tiêu trung bình
            </p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-4xl font-black">2.4M</h3>
              <span className="text-blue-500 text-sm font-bold">VND</span>
            </div>
          </div>
          <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Tỷ lệ quay lại
            </p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-4xl font-black">64%</h3>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-black transition-all"
            />
          </div>
          <select
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none font-medium"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          >
            <option value="all">Tất cả hạng</option>
            <option value="diamond">Kim cương</option>
            <option value="gold">Vàng</option>
            <option value="member">Thành viên</option>
          </select>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Phân hạng
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Tổng chi tiêu
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Đơn cuối
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CUSTOMERS.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${customer.color} flex items-center justify-center text-white font-bold`}
                      >
                        {customer.avatar}
                      </div>
                      <div>
                        <p className="font-bold">{customer.name}</p>
                        <p className="text-xs text-slate-400">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={14}
                        className={
                          customer.tier === "Kim cương"
                            ? "text-slate-900 fill-slate-900"
                            : "text-yellow-500"
                        }
                      />
                      <span className="text-sm font-bold">{customer.tier}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {customer.totalOrders} đơn hàng
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {customer.lastOrder}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                        customer.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                        title="Gửi mã giảm giá"
                      >
                        <Ticket size={18} />
                      </button>
                      <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-black transition-all">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-red-600 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
