"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Trash2,
  Eye,
  UserPlus,
  Ticket,
  Star,
  UserCheck,
  UserX,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers, toggleUserActive } from "@/store/features/usersSlice";

export default function CustomerManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, total, loading } = useSelector((state: RootState) => state.users);
  const { accessToken: token } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  // filterTier could be mapped to search or a special tier logic if implemented in backend

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers({ token, role: "CUSTOMER", search: searchTerm }));
    }
  }, [dispatch, token, searchTerm]);

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    if (token) {
      dispatch(toggleUserActive({ token, id, isActive: !currentStatus }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || "C";
  };

  const getColor = (index: number) => {
    const colors = ["bg-slate-900", "bg-yellow-500", "bg-slate-400", "bg-emerald-500", "bg-blue-500"];
    return colors[index % colors.length];
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
              <h3 className="text-4xl font-black">{total}</h3>
              <span className="text-emerald-500 text-sm font-bold">Live</span>
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
              placeholder="Tìm khách hàng theo tên, email, số điện thoại..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-black transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
            </div>
          )}
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                  Ngày tham gia
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
              {users.map((customer, index) => (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {customer.avatarUrl ? (
                         <img src={customer.avatarUrl} alt={customer.firstName} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                         <div
                          className={`w-10 h-10 rounded-lg ${getColor(index)} flex items-center justify-center text-white font-bold`}
                        >
                          {getInitials(customer.firstName)}
                        </div>
                      )}
                      
                      <div>
                        <p className="font-bold">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-slate-400">
                          ID: {customer.id.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-medium text-sm text-slate-700">{customer.email}</p>
                     <p className="text-xs text-slate-400">{customer.phone || "Chưa cập nhật SDT"}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                        customer.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.isActive ? "ACTIVE" : "BLOCKED"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-black transition-all"
                        onClick={() => handleToggleStatus(customer.id, customer.isActive)}
                        title={customer.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                      >
                        {customer.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
