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
  Newspaper,
  TableOfContents,
  Layers,
  Flag,
  ChartArea,
  TrendingUp,
  Warehouse,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import MenuItem from "@/types/menu";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebar,
  toggleMenu,
  setOpenMenus,
} from "@/store/ui/sidebar.slice";
import { AppDispatch, RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";

const SidebarAdmin = () => {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen: isSidebarOpen, openMenus } = useSelector(
    (state: RootState) => state.sidebar,
  );
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "AD"
    : "AD";
  const singleInitial = initials[0] || "A";
  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Admin";
  const displayEmail = user?.email || "admin@hn.com";

  /* ================= MENU DATA ================= */
  const menuItems: MenuItem[] = [
    {
      key: "sale",
      label: "Bán hàng",
      icon: <ShoppingBag size={20} />,
      children: [
        {
          key: "orders",
          label: "Đơn hàng",
          icon: <ShoppingBag size={18} />,
          link: "/admin/orders",
        },
        {
          key: "returns",
          label: "Trả hàng / Hoàn tiền",
          icon: <ShoppingBag size={18} />,
          link: "/admin/orders/returns",
        },
        {
          key: "transactions",
          label: "Giao dịch",
          icon: <ShoppingBag size={18} />,
          link: "/admin/orders/transactions",
        },
      ],
    },
    {
      key: "products",
      label: "Sản phẩm",
      icon: <Container size={20} />,
      children: [
        {
          key: "products-all",
          label: "Quản lý sản phẩm",
          icon: <Package size={18} />,
          link: "/admin/products",
        },
        {
          key: "categories",
          label: "Danh mục",
          icon: <ChartBarStacked size={18} />,
          link: "/admin/categories",
        },
        {
          key: "variants",
          label: "Thuộc tính",
          icon: <ChartBarStacked size={18} />,
          link: "/admin/products/variants",
        },
        {
          key: "inventory",
          label: "Kho hàng",
          icon: <ChartBarStacked size={18} />,
          link: "/admin/inventory",
        },
      ],
    },
    {
      key: "users",
      label: "Người dùng",
      icon: <Users size={20} />,
      children: [
        {
          key: "users-customers",
          label: "Danh sách khách hàng",
          icon: <Users size={18} />,
          link: "/admin/users/customers",
        },
        {
          key: "users-reviews",
          label: "Đánh giá",
          icon: <Users size={18} />,
          link: "/admin/users/reviews",
        },
        {
          key: "users-staffs",
          label: "Nhân viên",
          icon: <Users size={18} />,
          link: "/admin/users/staffs",
        },
        {
          key: "users-logs",
          label: "Nhật ký hoạt động",
          icon: <Users size={18} />,
          link: "/admin/users/logs",
        },
      ],
    },
    {
      key: "reports",
      label: "Báo cáo & Thống kê",
      icon: <ChartArea size={20} />,
      children: [
        {
          key: "report-revenue",
          label: "Doanh thu",
          icon: <DollarSign size={18} />,
          link: "/admin/reports/revenue",
        },
        {
          key: "report-bestseller",
          label: "Sản phẩm bán chạy",
          icon: <TrendingUp size={18} />,
          link: "/admin/reports/bestseller",
        },
        {
          key: "report-inventory",
          label: "Báo cáo tồn kho",
          icon: <Warehouse size={18} />,
          link: "/admin/reports/inventory",
        },
      ],
    },
    {
      key: "marketing",
      label: "Marketing",
      icon: <Users size={20} />,
      children: [
        {
          key: "discounts",
          label: "Mã giảm giá",
          icon: <Users size={18} />,
          link: "/admin/marketing/discounts",
        },
        {
          key: "flash-sale",
          label: "Flash sale",
          icon: <FileClock size={18} />,
          link: "/admin/marketing/flash-sales",
        },
        {
          key: "email-marketing",
          label: "Email marketing",
          icon: <Map size={18} />,
          link: "/admin/marketing/email",
        },
      ],
    },
    {
      key: "content",
      label: "SEO & Nội dung",
      icon: <TableOfContents size={20} />,
      children: [
        {
          key: "news",
          label: "Tin tức / Bài viết",
          icon: <Newspaper size={18} />,
          link: "/admin/content/news",
        },
        {
          key: "pages",
          label: "Trang tĩnh",
          icon: <Layers size={18} />,
          link: "/admin/content/pages",
        },
        {
          key: "banners",
          label: "Banner / Slider",
          icon: <Flag size={18} />,
          link: "/admin/content/banners",
        },
      ],
    },
    {
      key: "payment",
      label: "Thanh toán",
      icon: <WalletCards size={20} />,
      children: [
        {
          key: "payment-methods",
          label: "Phương thức thanh toán",
          icon: <WalletCards size={18} />,
          link: "/admin/payment/methods",
        },
      ],
    },
    {
      key: "shipping",
      label: "Vận chuyển",
      icon: <Truck size={20} />,
      children: [
        {
          key: "shipping-partners",
          label: "Đối tác vận chuyển",
          icon: <Truck size={18} />,
          link: "/admin/shipping/partners",
        },
        {
          key: "shipping-payments",
          label: "Lịch sử thanh toán",
          icon: <Truck size={18} />,
          link: "/admin/shipping/payments",
        },
      ],
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <Settings size={20} />,
      link: "/admin/settings/general",
    },
  ];

  /* ================= HELPERS ================= */
  const isLinkActive = (link?: string) =>
    !!link && (pathname === link || pathname.startsWith(link + "/"));

  const isParentActive = (item: MenuItem) =>
    item.children?.some((child) => isLinkActive(child.link));

  /* ================= AUTO OPEN MENU ================= */
  useEffect(() => {
    const initialOpen: Record<string, boolean> = {};

    menuItems.forEach((item) => {
      if (item.children?.some((child) => isLinkActive(child.link))) {
        initialOpen[item.key] = true;
      }
    });

    dispatch(setOpenMenus(initialOpen));
  }, [pathname]);

  /* ================= RENDER ================= */
  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full`}
    >
      {/* ===== HEADER ===== */}
      <div className="h-16 px-4 flex items-center justify-between border-b">
        {isSidebarOpen && (
          <Link href="/admin" className="text-xl font-bold text-blue-600">
            Hoang Nam
          </Link>
        )}
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ===== MENU ===== */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const parentActive = isParentActive(item);
            const hasChildren = !!item.children?.length;

            return (
              <li key={item.key}>
                {/* ===== PARENT ===== */}
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => dispatch(toggleMenu(item.key))}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition
                      ${
                        parentActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }
                    `}
                    data-tooltip-id="sidebar-tooltip"
                    data-tooltip-content={item.label}
                  >
                    <span>{item.icon}</span>

                    {isSidebarOpen && (
                      <div className="ml-3 flex flex-1 items-center justify-between">
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            openMenus[item.key] ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.link!}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition
                      ${
                        isLinkActive(item.link)
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="ml-3 text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </Link>
                )}

                {/* ===== CHILDREN ===== */}
                {hasChildren && openMenus[item.key] && isSidebarOpen && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.children!.map((child) => (
                      <li key={child.key}>
                        <Link
                          href={child.link!}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                            ${
                              isLinkActive(child.link)
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50"
                            }
                          `}
                        >
                          <span>{child.icon}</span>
                          <span>{child.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ===== FOOTER ===== */}
      <div className="border-t p-4 mt-auto">
        {isSidebarOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
            {singleInitial}
          </div>
        )}
      </div>

      {!isSidebarOpen && (
        <Tooltip
          id="sidebar-tooltip"
          place="right"
          className="!bg-gray-800 !text-white !text-sm !px-3 !py-2 !rounded-md"
        />
      )}
    </aside>
  );
};

export default SidebarAdmin;
