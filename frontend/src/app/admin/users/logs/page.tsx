"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchSystemLogs } from "@/store/features/systemLogsSlice";

export default function ActivityLogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, total, loading } = useSelector((state: RootState) => state.systemLogs);
  const { accessToken: token } = useSelector((state: RootState) => state.auth);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchSystemLogs({ token, search, type: filterType || undefined }));
    }
  }, [dispatch, token, search, filterType]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Nhật ký hoạt động</h1>
        <p className="text-sm text-gray-500">
          Theo dõi toàn bộ thao tác người dùng trong hệ thống ({total} bản ghi)
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

          <select 
            className="px-3 py-2 border border-gray-200 rounded-md text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Tất cả hành động</option>
            <option value="CREATE">Tạo mới</option>
            <option value="UPDATE">Cập nhật</option>
            <option value="DELETE">Xoá</option>
            <option value="SECURITY">Bảo mật</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        )}
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left">Thời gian</th>
              <th className="px-6 py-4 text-left">Người dùng</th>
              <th className="px-6 py-4 text-left">Hành động</th>
              <th className="px-6 py-4 text-left">Đối tượng</th>
              <th className="px-6 py-4">Loại</th>
              <th className="px-6 py-4">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-left">
                  {new Date(log.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="font-medium text-slate-800">{log.userEmail}</div>
                  <div className="text-xs text-slate-400">{log.userId?.substring(0, 8)}</div>
                </td>
                <td className="px-6 py-4 text-left">{log.action}</td>
                <td className="px-6 py-4 text-left">{log.target || "-"}</td>
                <td className="px-6 py-4 text-center"><ActionBadge type={log.type} /></td>
                <td className="px-6 py-4 text-center text-xs text-slate-500">{log.ip || "Unknown"}</td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Không tìm thấy nhật ký nào.
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

const ActionBadge = ({ type }: { type: string }) => {
  const map: { [key: string]: string } = {
    CREATE: "bg-green-100 text-green-700",
    UPDATE: "bg-blue-100 text-blue-700",
    DELETE: "bg-red-100 text-red-700",
    SECURITY: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${map[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </span>
  );
};
