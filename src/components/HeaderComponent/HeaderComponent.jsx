import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faBagShopping,
  faXmark,
  faChevronRight,
  faHouse
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="w-full h-24 header-top">
        <img
          className="w-full h-full"
          src="https://file.hstatic.net/1000003969/file/khtt.jpg"
          alt=""
        />
      </div>
      <div className="container relative sticky top-0 flex justify-between px-4 py-4 mx-auto lg:flex md:flex md:justify-around lg:items-center lg:justify-around">
        {/* Logo */}
        <button
          className="flex items-center gap-4 text-sm text-gray-600 hover:text-blue-500"
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
        <Link to="/">
          <div className="text-3xl font-bold text-blue-500">HOÀNG NAM</div>
        </Link>

        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <nav
              className={`fixed top-0 left-0 flex flex-col items-center h-screen text-black uppercase bg-white shadow-lg w-96 transform transition-transform duration-1000 ease-in-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex justify-end w-full h-20 py-6 px-14">
                <button onClick={() => setIsMenuOpen(false)}>
                  <FontAwesomeIcon icon={faXmark} className="text-xl" />
                </button>
              </div>

              <ul className="w-full px-14">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-600  md:hidden lg:hidden h-9"
                  >
                    <FontAwesomeIcon icon={faHouse} />
                    <span>Trang Chủ</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/new-arrivals"
                    className="flex items-center justify-between text-sm text-gray-600 h-9 hover:text-blue-500"
                  >
                    <span>Hàng Mới</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-sm"
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="flex items-center justify-between text-sm text-gray-600 h-9 hover:text-blue-500"
                  >
                    <span>Sản Phẩm</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-sm"
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collection"
                    className="flex items-center justify-between text-sm text-gray-600 h-9 hover:text-blue-500"
                  >
                    <span>Bộ Sưu Tập</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-sm"
                    />
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-between text-sm text-gray-600 h-9 hover:text-blue-500"
                  >
                    <span>Khuyến Mãi</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-sm"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-between text-sm text-gray-600 h-9 hover:text-blue-500"
                  >
                    <span>ShowRoom</span>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-sm"
                    />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}

        <ul className="items-center hidden lg:flex md:flex sm:flex">
          <li>
            <div className="flex items-center px-4 search">
              <input
                type="text"
                className="px-4 py-3 border-b focus:outline-none hover:border-b-gray-600"
                placeholder="Tìm kiếm"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="text-lg text-gray-500 "
              />
            </div>
          </li>
          <li className="relative">
            <Link
              to="/user"
              className="relative group after:w-full after:h-[30px] after:absolute after:top-[20px] after:left-0 after:bg-transparent"
            >
              <FontAwesomeIcon
                icon={faUser}
                className="px-2 text-lg text-gray-500 "
              />
              <div className="absolute w shadow-xl rounded top-[40px] right-[-20px] hidden w-44  group-hover:block">
                <ul className="flex flex-col items-center justify-center bg-white">
                  <li>
                    <Link
                      to="/user"
                      className="block px-4 py-2 hover:text-blue-500"
                    >
                      Tài Khoản
                    </Link>
                  </li>
                  <li>
                    <Link className="block px-4 py-2 hover:text-blue-500">
                      Đơn Mua
                    </Link>
                  </li>
                  <li>
                    <Link className="block px-4 py-2 hover:text-blue-500">
                      Đăng Xuất
                    </Link>
                  </li>
                </ul>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/cart">
              <FontAwesomeIcon
                icon={faBagShopping}
                className="px-2 text-lg text-gray-500"
              />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
