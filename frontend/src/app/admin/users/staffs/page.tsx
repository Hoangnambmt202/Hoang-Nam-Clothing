"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search, Shield, User, UserX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUsers, toggleUserActive } from "@/store/features/usersSlice";

export default function StaffManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, total, loading } = useSelector((state: RootState) => state.users);
  const { accessToken: token } = useSelector((state: RootState) => state.auth);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers({ token, role: "STAFF", search }));
    }
  }, [dispatch, token, search]);

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    if (token) {
      dispatch(toggleUserActive({ token, id, isActive: !currentStatus }));
    }
  };

  const activeStaffsCount = users.filter((u) => u.isActive).length;
  const inactiveStaffsCount = users.filter((u) => !u.isActive).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

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
        <StatCard title="Tổng nhân viên" value={total} icon={<User />} />
        <StatCard title="Admin" value={adminCount} icon={<Shield />} />
        <StatCard title="Đã vô hiệu" value={inactiveStaffsCount} icon={<UserX />} warning />
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        )}
        
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
              <th className="px-6 py-4 text-left">Vai trò</th>
              <th className="px-6 py-4 text-left">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                     {staff.avatarUrl ? (
                         <img src={staff.avatarUrl} alt={staff.firstName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                         <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                           {staff.firstName?.charAt(0)}
                         </div>
                      )}
                    <div>
                      <div className="font-medium">{staff.firstName} {staff.lastName}</div>
                      <div className="text-xs text-gray-400">{staff.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={staff.role} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={staff.isActive ? "ACTIVE" : "INACTIVE"} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 text-xs font-semibold hover:underline mr-4">
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(staff.id, staff.isActive)}
                    className="text-red-600 text-xs font-semibold hover:underline"
                  >
                    {staff.isActive ? "Vô hiệu" : "Kích hoạt"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Không tìm thấy nhân viên nào.
                  </td>
                </tr>
            )}
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
        warning ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
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
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[role] || "bg-gray-100 text-gray-600"}`}
    >
      {role}
    </span>
  );
};

const StatusBadge = ({ status }: any) => {
  const map: any = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {status === "ACTIVE" ? "Đang hoạt động" : "Đã khóa"}
    </span>
  );
};
