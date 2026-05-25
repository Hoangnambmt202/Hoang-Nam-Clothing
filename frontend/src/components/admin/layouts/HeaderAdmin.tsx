"use client";

import Link from "next/link";
import { Bell, User, LogOut, Settings, Moon } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import NotificationBell from "@/components/shared/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function HeaderAdmin() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/sign-in");
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
    }
  };

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Admin User";

  const displayRole = user
    ? user.role === "ADMIN"
      ? "Quản trị viên"
      : user.role === "STAFF"
      ? "Nhân viên"
      : user.role
    : "Super Admin";

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "AD"
    : "AD";

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        {/* Theme light/dark */}
        <button
          type="button"
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-100 text-gray-500 cursor-pointer"
        >
          <Moon size={20} className="text-black" />
        </button>
        {/* Notification */}
        <NotificationBell />

        {/* Account */}
        <div className="relative group">
          <div className="flex items-center gap-3 pl-4 border-l cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{displayName}</p>
              <p className="text-xs text-gray-500">{displayRole}</p>
            </div>

            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center overflow-hidden font-semibold text-sm border border-blue-100">
              {userInitials}
            </div>
          </div>

          {/* DROPDOWN */}
          <div
            className="
              absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200
            "
          >
            <ul className="py-1 text-sm">
              <li>
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-50"
                >
                  <User size={16} />
                  Hồ sơ
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-50"
                >
                  <Settings size={16} />
                  Cài đặt
                </Link>
              </li>
              <li className="border-t mt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
