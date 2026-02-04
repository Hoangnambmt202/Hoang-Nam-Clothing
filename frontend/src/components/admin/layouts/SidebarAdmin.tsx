"use client";

import {
  Users,
  Package,
  DollarSign,
  ShoppingBag,
  Settings,
  Menu,
  ChartBarStacked,
  ChevronDown,
  WalletCards,
  Truck,
  Container,
  FileClock,
  Map,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import MenuItem from "@/types/menu";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      icon: <ShoppingBag size={20} />,
      label: "Bán hàng",
      count: "54",
      children: [
        {
          icon: <ShoppingBag size={20} />,
          link: "/admin/orders",
          label: "Đơn hàng",
          count: "54",
        },
        {
          icon: <ShoppingBag size={20} />,
          link: "/admin/orders/returns",
          label: "Trả hàng / Hoàn tiền",
          count: "54",
        },
        {
          icon: <ShoppingBag size={20} />,
          link: "/admin/orders/transactions",
          label: "Giao dịch",
          count: "54",
        },
      ],
    },
    {
      icon: <Container size={20} />,
      label: "Sản phẩm",
      count: "245",
      children: [
        {
          icon: <Package size={20} />,
          link: "/admin/products",
          label: "Quản lý sản phẩm",
          count: "245",
        },
        {
          icon: <ChartBarStacked size={20} />,
          link: "/admin/categories",
          label: "Danh mục",
          count: "5",
        },
        {
          icon: <ChartBarStacked size={20} />,
          link: "/admin/products/variants",
          label: "Thuộc tính",
          count: "5",
        },
        {
          icon: <ChartBarStacked size={20} />,
          link: "/admin/inventory",
          label: "Kho hàng",
          count: "5",
        },
      ],
    },

    {
      icon: <Users size={20} />,
      label: "Khách hàng",
      count: "1,200",
      children: [
        {
          icon: <Users size={20} />,
          link: "/admin/customers",
          label: "Danh sách khách hàng",
          count: "1,200",
        },
        {
          icon: <Users size={20} />,
          link: "/admin/customers/groups",
          label: "Nhóm khách hàng",
          count: "1,200",
        },
        {
          icon: <FileClock size={20} />,
          link: "/admin/customers/history",
          label: "Lịch sử mua hàng",
          count: "1,200",
        },
        {
          icon: <Map size={20} />,
          link: "/admin/customers/addresses",
          label: "Địa chỉ giao hàng",
          count: "1,200",
        },
        {
          icon: <Users size={20} />,
          link: "/admin/customers/reviews",
          label: "Đánh giá",
          count: "1,200",
        },
      ],
    },

    {
      icon: <DollarSign size={20} />,
      label: "Báo cáo & Thống kê",
      count: null,
      children: [
        {
          icon: <ChartBarStacked size={20} />,
          link: "/admin/reports/revenue",
          label: "Doanh thu",
          count: null,
        },
        {
          icon: <ChartBarStacked size={20} />,
          link: "/admin/reports/bestseller",
          label: "Sản phẩm bán chạy",
          count: null,
        },
        {
          icon: <ChartBarStacked size={20} />,
          link: "/admin/reports/inventory",
          label: "Báo cáo tồn kho",
          count: null,
        },
      ],
    },
    {
      icon: <Users size={20} />,
      label: "Marketing",
      count: "1,200",
      children: [
        {
          icon: <Users size={20} />,
          link: "/admin/marketing/discounts",
          label: "Mã giảm giá",
          count: "1,200",
        },
        {
          icon: <FileClock size={20} />,
          link: "/admin/marketing/flash-sale",
          label: "Flash sale",
          count: "1,200",
        },
        {
          icon: <Map size={20} />,
          link: "/admin/marketing/email",
          label: "Email marketing",
          count: "1,200",
        },
      ],
    },
    {
      icon: <Truck size={20} />,
      label: "SEO & Nội dung",
      count: null,
      children: [
        {
          icon: <Truck size={20} />,
          link: "/admin/content/news",
          label: "Tin tức/ Bài viết",
          count: "2",
        },
        {
          icon: <Truck size={20} />,
          link: "/admin/content/pages",
          label: "Trang tĩnh", //Giới thiệu, Chính sách bảo mật, Hướng dẫn chọn size.
          count: "2",
        },
        {
          icon: <Truck size={20} />,
          link: "/admin/content/banners",
          label: "Banner/Slider",
          count: "2",
        },
      ],
    },
    {
      icon: <WalletCards size={20} />,
      label: "Thanh toán",
      count: null,
      children: [
        {
          icon: <WalletCards size={20} />,
          link: "/admin/payment/methods",
          label: "Phương thức thanh toán",
          count: "2",
        },
      ],
    },
    {
      icon: <Truck size={20} />,
      label: "Vận chuyển",
      count: null,
      children: [
        {
          icon: <Truck size={20} />,
          link: "/admin/shipping/partners",
          label: "Đối tác vân chuyển",
          count: "2",
        },
        {
          icon: <Truck size={20} />,
          link: "/admin/shipping/payments",
          label: "Lịch sử thanh toán",
          count: "2",
        },
      ],
    },
    {
      icon: <Settings size={20} />,
      link: "/admin/settings/general",
      label: "Cài đặt",
      count: null,
    },
  ];
  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (link: string) =>
    pathname === link || pathname.startsWith(link + "/");

  return (
    <aside
      className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full`}
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between h-16">
        {isSidebarOpen && (
          <Link
            href="/admin"
            className="text-xl font-bold text-blue-600 truncate"
          >
            Hoang Nam
          </Link>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const active = isActive(item.link || "");
            const hasChildren = item.children?.length;

            return (
              <li key={item.link}>
                {/* ===== PARENT ===== */}
                <button
                  onClick={() => hasChildren && toggleMenu(item.link || "")}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors
          ${active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}
        `}
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content={item.label}
                >
                  <span>{item.icon}</span>

                  {isSidebarOpen && (
                    <div className="flex flex-1 items-center justify-between ml-3">
                      <span className="text-sm font-medium">{item.label}</span>
                      {hasChildren && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            openMenus[item.link || ""] ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </div>
                  )}
                </button>

                {/* ===== CHILDREN ===== */}
                {hasChildren && openMenus[item.link || ""] && isSidebarOpen && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.children!.map((child) => {
                      const childActive = pathname === child.link;

                      return (
                        <li key={child.link}>
                          <Link
                            href={child.link || ""}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg
                    ${
                      childActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                          >
                            <span>{child.icon}</span>
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        {isSidebarOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">
                Admin
              </p>
              <p className="text-xs text-gray-500 truncate">admin@hn.com</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
            A
          </div>
        )}
      </div>
      {!isSidebarOpen && (
        <Tooltip
          id="sidebar-tooltip"
          place="right"
          className="!bg-gray-800 !text-white !text-base !px-4 !py-2 !rounded-md"
        />
      )}
    </aside>
  );
};

export default Sidebar;
