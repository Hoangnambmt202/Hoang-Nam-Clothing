import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser ,faBagShopping } from "@fortawesome/free-solid-svg-icons";
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
      <div className="container relative sticky top-0 flex items-center justify-between px-4 py-4 mx-auto">
        {/* Logo */}
        <Link to="/">
          <div className="text-3xl font-bold text-blue-500">HOÀNG NAM</div>
        </Link>

        {/* Navigation Links */}
        <nav className="items-center space-x-10 uppercase md:flex">
          <Link
            to="/new-arrivals"
            className="px-4 text-lg text-gray-600 hover:text-blue-500"
          >
            Hàng Mới
          </Link>
          <Link
            to="/products"
            className="px-4 text-lg text-gray-600 after:absolute group after:top-[60%] after:left-[400px] hover:text-blue-500 after:block after:w-[150px] after:h-11 after:bg-transparent"
          >
            Sản Phẩm
            <div className="absolute hidden top-[102%] left-0 w-full  h-[500px] bg-white shadow-lg group-hover:block z-20">
              {/* Nội dung menu con */}
              <div className="container flex h-full mx-auto">
                <div className="w-1/3 p-6 text-gray-700 border-r">
                <div className="mb-2 male">
                  <Link to="/products/male">
                    <h3 className="mb-4 text-xl font-bold">QUẦN ÁO NAM</h3>
                  </Link>
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-100 hover:translate-x-4 hover:ease hover:text-blue-500 "
                      >
                        Sản phẩm 1
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500 "
                      >
                        Sản phẩm 2
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500 "
                      >
                        Sản phẩm 3
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="female">
                  <Link to="/products/female" >
                    <h3 className="mb-4 text-xl font-bold">QUẦN ÁO NỮ</h3>
                  
                  </Link>
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-100 hover:translate-x-4 hover:ease hover:text-blue-500 "
                      >
                        Sản phẩm 1
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500 "
                      >
                        Sản phẩm 2
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500 "
                      >
                        Sản phẩm 3
                      </a>
                    </li>
                  </ul>
                </div>
                </div>
                <div className="w-1/3 p-6 text-gray-700 border-r">
                  <h3 className="mb-4 text-xl font-bold">GIÀY</h3>
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500"
                      >
                        Sản phẩm A
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500"
                      >
                        Sản phẩm B
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="w-1/3 p-6 text-gray-700">
                  <h3 className="mb-4 text-xl font-bold">PHỤ KIỆN</h3>
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500"
                      >
                        Sản phẩm E
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500"
                      >
                        Sản phẩm F
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Link>

          <a
            href="#"
            className="px-4 text-lg text-gray-600 after:absolute group after:top-[60%] after:left-[600px] hover:text-blue-500 after:block after:w-[150px] after:h-11 after:bg-transparent"
          >
            Bộ Sưu Tập
            <div className="absolute hidden top-[102%] left-[600px] bg-white shadow-lg group-hover:block z-20">
              {/* Nội dung menu con */}
              <div className="container flex h-full mx-auto">
                <div className="p-6 text-gray-700 border-r ">
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500"
                      >
                        BST Xuân Hè 2024
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500"
                      >
                        BST Thu Đông 2024
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 transition duration-100 ease-in-out delay-150 hover:translate-x-4 hover:ease hover:text-blue-500"
                      >
                        BST Đặc Biệt
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </a>
          <a
            href="#"
            className="px-4 text-lg text-gray-600 hover:text-blue-500"
          >
            Khuyến Mãi
          </a>
          <a
            href="#"
            className="px-4 text-lg text-gray-600 hover:text-blue-500"
          >
            ShowRoom
          </a>
        </nav>

        <ul className="flex items-center">
          <li>
            <div className="flex items-center px-4 search">
              <input
                type="text"
                className="px-4 py-3 border-b focus:outline-none hover:border-b-gray-600"
                placeholder="Tìm kiếm"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="text-xl text-gray-500 "
              />
            </div>
          </li>
          <li>
            <Link>
              <FontAwesomeIcon
                icon={faUser}
                className="px-2 text-xl text-gray-500"
              />
            </Link>
          </li>
          <li>
            <FontAwesomeIcon
              icon={faBagShopping}
              className="px-2 text-xl text-gray-500"
            />
          </li>
        </ul>

        {/* Hamburger Menu for Mobile */}
        <button
          className="text-gray-600 md:hidden hover:text-blue-500"
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
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 flex flex-col items-center w-full py-4 space-y-4 bg-white shadow-md top-full md:hidden">
            <a href="#" className="text-gray-600 hover:text-blue-500">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500">
              Products
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-500">
              Contact
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
