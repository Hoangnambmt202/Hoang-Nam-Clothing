import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import AuthGuard from "@/components/auth/AuthGuard";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hoàng Nam Clothing - Đăng nhập",
  description: "Trang đăng nhập Hoàng Nam Clothing",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${cormorant.variable} ${montserrat.variable} antialiased`}
      >
        <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
