'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import avatar from "../../assets/imgs/pexels-hikaique-307847.jpg"
import { ChevronRight, Home, Search, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const { user, logout } = useAuth();
    const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="w-full h-24 header-top">
        <img
          className="w-full h-full"
          src="https://file.hstatic.net/1000003969/file/khtt.jpg"
          alt=""
        />
      </div>
      <div className="container sticky top-0 flex justify-between px-4 py-4 mx-auto lg:flex md:flex md:justify-around lg:items-center lg:justify-between">

        <button
          className="flex items-center gap-4 text-sm text-gray-600 hover:text-blue-500 justify-end grow-3"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
          <span className="hidden lg:inline-block md:inline-block">MENU</span>
        </button>
          {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50">
            <nav
              className={`fixed top-0 left-0 flex flex-col items-center h-screen text-black uppercase bg-white shadow-lg w-96 transform transition-transform duration-1000 ease-in-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex justify-end w-full h-20 py-6 px-14">
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={20} color="black" />
                </button>
              </div>

              <ul className="w-full space-y-2 px-14">
                <li>
                  <Link
                    href="/"
                    className="text-base text-gray-600  md:hidden lg:hidden h-9"
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
                    <span>Hàng Mới</span>
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
                    <span>Bộ Sưu Tập</span>
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

        <Link className="grow-7 flex justify-center" href="/">
          <span className="text-3xl font-Dosis font-bold text-blue-500">HOÀNG NAM</span>
        </Link>

    
        <div className=" gap-4 items-center mr-4 lg:flex md:flex sm:flex">
        
            <div className="flex items-center search">
              <input
                type="text"
                className="px-4 py-2 text-gray-500 border-b border-b-gray-400 focus:outline-none focus:border-b-gray-600"
                placeholder="Tìm kiếm"
              />
              <Search size={16} color="gray"  />
            </div>
    
          <div className="relative flex">
            {
              user ? (<>
              {/* <button onClick={handleLogout} >Đăng xuất</button> */}
              <button  className="relative px-4 group after:w-full after:h-[30px] after:absolute after:top-[20px] after:left-0 after:bg-transparent" >
                <Image src={avatar} className="rounded-full w-7 h-7" alt={user.name} />
                <div className="absolute w shadow-xl rounded top-[40px] right-[-20px] hidden w-44  group-hover:block">
                <ul className="flex flex-col items-center justify-center bg-white">
                
                  <li>
                    <Link href="/user/account/profile"  className="block px-4 py-2 hover:text-blue-500">
                      Tài Khoản
                    </Link>
                  </li>
                  <li>
                    <Link href="/orders" className="block px-4 py-2 hover:text-blue-500">
                      Đơn Mua
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="block px-4 py-2 hover:text-blue-500">
                      Danh sách yêu thích
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="block px-4 py-2 hover:text-blue-500">
                      Đăng Xuất
                    </button>
                  </li>
                </ul>
              </div>
              </button>
              </>) : (<>
              <button             
              className="relative group after:w-full after:h-[30px] after:absolute after:top-[20px] after:left-0 after:bg-transparent"
            >
              
              <User size={16} color="gray" className="" />
              <div className="absolute w shadow-xl rounded top-[40px] right-[-20px] hidden w-44  group-hover:block">
                <ul className="flex flex-col items-center justify-center bg-white">
                
                  <li>
                    <Link href="/sign-in"  className="block text-black px-4 py-2 hover:text-blue-500">
                      Đăng Nhập
                    </Link>
                  </li>
                  <li>
                    <Link href="/sign-up" className="block text-black px-4 py-2 hover:text-blue-500">
                      Đăng Ký
                    </Link>
                  </li>
                </ul>
              </div>
            </button>
                </>)
            }
            
          </div>
          <div>
            <Link href="/cart">
              <ShoppingCart size={16} color="gray" className="" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
