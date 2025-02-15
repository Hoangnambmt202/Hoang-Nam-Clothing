import {

  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

import Sidebar from "../components/AdminComponent/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
 

  // const products = [
  //   { id: 1, name: 'Áo thun nam basic', category: 'Áo thun', price: '199,000đ', stock: 50 },
  //   { id: 2, name: 'Quần jean slim fit', category: 'Quần jean', price: '459,000đ', stock: 35 },
  //   { id: 3, name: 'Áo sơ mi trắng', category: 'Áo sơ mi', price: '359,000đ', stock: 45 }
  // ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-2">
                <img
                  src="/api/placeholder/32/32"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">Admin</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
