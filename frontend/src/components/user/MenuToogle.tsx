"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, X } from "lucide-react";

export default function MenuToggle() {
  const [isOpen, setIsOpen] = useState(false);

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
          <nav className="fixed top-0 right-0 flex flex-col items-center h-screen text-black uppercase bg-white shadow-lg w-96 transform transition-transform duration-700 ease-in-out">
            <div className="flex justify-end w-full h-20 py-6 px-14">
              <button onClick={() => setIsOpen(false)}>
                <X size={20} color="black" />
              </button>
            </div>

            <ul className="w-full space-y-2 px-14">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-base text-gray-600 md:hidden lg:hidden h-9"
                >
                  <Home size={24} color="gray" />
                  <span>Trang Chủ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/new-arrivals"
                  className="flex items-center justify-between text-base text-gray-600 h-9 hover:text-blue-500"
                >
                  <span>New Arrivals</span>
                  <ChevronRight size={24} color="gray" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="flex items-center justify-between text-base text-gray-600 h-9 hover:text-blue-500"
                >
                  <span>Sản Phẩm</span>
                  <ChevronRight size={24} color="gray" />
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
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
          </nav>
        </div>
      )}
    </>
  );
}
