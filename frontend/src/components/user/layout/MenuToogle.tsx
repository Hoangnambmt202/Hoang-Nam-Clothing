"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, X, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function MenuToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <button
        className="flex items-center gap-4 text-sm text-white hover:opacity-60 hover:cursor-pointer justify-end grow-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="#fff"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>
 
      {isOpen && (
        <div className="fixed inset-0 z-51 bg-black/50">
          <nav className="fixed top-0 right-0 flex flex-col h-screen text-black uppercase bg-white shadow-lg w-96 transform transition-transform duration-700 ease-in-out">
            <div className="flex justify-end w-full h-20 py-6 px-14 flex-shrink-0">
              <button onClick={() => setIsOpen(false)}>
                <X size={20} color="black" />
              </button>
            </div>

            <ul className="w-full space-y-2 px-14 flex-1 overflow-y-auto">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-base text-gray-600 md:hidden lg:hidden h-9"
                >
                  <Home size={24} color="gray" />
                  <span>Trang Chủ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-base text-gray-600 h-9 hover:text-blue-500"
                >
                  <span>New Arrivals</span>
                  <ChevronRight size={24} color="gray" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-base text-gray-600 h-9 hover:text-blue-500"
                >
                  <span>Sản Phẩm</span>
                  <ChevronRight size={24} color="gray" />
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-base text-gray-600 h-9 hover:text-blue-500"
                >
                  <span>Collection</span>
                  <ChevronRight size={24} color="gray" />
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-between text-base text-gray-600 h-9 hover:text-blue-500"
                >
                  <span>Khuyến Mãi</span>
                  <ChevronRight size={24} color="gray" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-between text-base text-gray-600 h-9 hover:text-blue-500"
                >
                  <span>ShowRoom</span>
                  <ChevronRight size={24} color="gray" />
                </a>
              </li>
            </ul>

            <nav className="w-full flex flex-col items-center gap-4 px-14 py-8 border-t border-zinc-100 mt-auto flex-shrink-0">
              {user ? (
                <div className="w-full space-y-4 text-center">
                  <div className="text-sm font-montserrat text-slate-500 font-light flex items-center justify-center gap-2 normal-case">
                    <User size={16} className="text-slate-400" />
                    <span>
                      Xin chào, <span className="font-semibold text-slate-800">{user.firstName || user.name || user.email}</span>
                    </span>
                  </div>
                  <div className="flex gap-4 w-full justify-center">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-montserrat font-medium text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
                    >
                      Tài Khoản
                    </Link>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={async () => {
                        await logout();
                        setIsOpen(false);
                      }}
                      className="text-xs font-montserrat font-medium text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider hover:cursor-pointer"
                    >
                      Đăng Xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-6 w-full justify-center text-sm font-montserrat font-medium text-slate-700">
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-blue-600 transition-colors tracking-wider"
                  >
                    Đăng Nhập
                  </Link>
                  <span className="text-slate-300">|</span>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-blue-600 transition-colors tracking-wider"
                  >
                    Đăng Ký
                  </Link>
                </div>
              )}
            </nav>
          </nav>
        </div>
      )}
    </>
  );
}
