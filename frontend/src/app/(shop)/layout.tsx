import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant, Montserrat } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import Header from "@/components/user/layout/Header";
import Footer from "@/components/user/layout/Footer";
import { NextIntlClientProvider } from "next-intl";
import BackToTopButton from "@/components/shared/BackToTopButton";
import BottomNavigation from "@/components/user/layout/BottomNavigation";
import SearchOverlay from "@/components/user/features/search/SearchOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  title: "Hoang Nam ",
  description:
    "Hoang Nam Clothing | Shop Hoang Nam | Cửa hàng quần áo Hoàng Nam | Thời trang nam Hoàng Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${montserrat.variable} antialiased`}
      >
        <Providers>
          <NextIntlClientProvider>
            {" "}
            <Header />
            <div className="bg-[#f6f6f8] font-['Manrope',sans-serif] text-[#0e121b] transition-colors duration-300">
              <main className="relative">{children}</main>
              <BottomNavigation />
              <SearchOverlay />
              <BackToTopButton />
            </div>
            <Footer />{" "}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
