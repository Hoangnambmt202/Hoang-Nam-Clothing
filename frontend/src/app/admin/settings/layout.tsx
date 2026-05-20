"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Globe, Mail, CreditCard, Shield } from "lucide-react";

const menus = [
  { label: "General", href: "/admin/settings/general", icon: Settings },
  {
    label: "Notifications",
    href: "/admin/settings/notifications",
    icon: Globe,
  },
  { label: "Social", href: "/admin/settings/socials", icon: Shield },
  { label: "Security", href: "/admin/settings/security", icon: Shield },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-3 bg-white border rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-black">Settings</h2>
            <p className="text-xs text-gray-500">Cấu hình hệ thống</p>
          </div>

          <nav className="p-4 space-y-1">
            {menus.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all \
                    ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="col-span-9">{children}</main>
      </div>
    </div>
  );
}
