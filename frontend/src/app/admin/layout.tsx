import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import HeaderAdmin from "@/components/admin/layouts/HeaderAdmin";
import SidebarAdmin from "@/components/admin/layouts/SidebarAdmin";
import Breadcrumbs from "@/components/ui/Breadcrumb";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quản trị | Hoàng Nam",
  description: "Trang quản trị hệ thống Hoàng Nam Clothing",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <SidebarAdmin />
            <div className="flex-1 flex flex-col overflow-hidden">
              <HeaderAdmin />
              <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                <Breadcrumbs />
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
