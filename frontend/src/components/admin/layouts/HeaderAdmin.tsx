import Link from "next/link";
import { Bell, User } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";

export default function HeaderAdmin() {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <User className="text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
