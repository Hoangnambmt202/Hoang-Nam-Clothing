import {
  Users,
  Package,
  DollarSign,
  ShoppingBag,
  Settings,
  Menu,
  ChartBarStacked,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      icon: <Package />,
      Link: "/admin/products",
      label: "Sản phẩm",
      count: "245",
    },
    {
      icon: <ChartBarStacked />,
      Link: "/admin/categories",
      label: "Danh mục",
      count: "5",
    },
    {
      icon: <Users />,
      Link: "/admin/users",
      label: "Khách hàng",
      count: "1,200",
    },
    {
      icon: <ShoppingBag />,
      Link: "/admin/orders",
      label: "Đơn hàng",
      count: "54",
    },
    { icon: <DollarSign />, Link: "", label: "Doanh thu", count: null },
    { icon: <Settings />, Link: "", label: "Cài đặt", count: null },
  ];

  return (
    <aside
      className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold">
              {" "}
              <Link href="/admin"> Hoang Nam Admin</Link>
            </h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link
            href={item.Link}
            key={index}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
          >
            <span className="p-2">{item.icon}</span>
            {isSidebarOpen && (
              <div className="flex flex-1 items-center justify-between">
                <span>{item.label}</span>
                {item.count && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
