import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser ,faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../ModalComponent/ModalComponent";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
                    <Link to="/products/female">
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

          <Link
            to="/collection"
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
          </Link>
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
            <button onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon
                icon={faUser}
                className="px-2 text-xl text-gray-500"
              />
            </button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title=" Đăng Nhập Và Trải Nghiệm Mua Sắm Tại HOÀNG NAM COLLECTION "
            >
              <div className="mt-4">
                <label className="block mb-2 text-xl font-bold text-gray-700">
                  Email Address
                </label>
                <input
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                  type="email"
                  required
                />
              </div>
              <div className="flex flex-col justify-between mt-4">
                <div className="flex justify-between">
                  <label className="block mb-2 text-xl font-bold text-gray-700">
                    Password
                  </label>
                </div>
                <input
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded focus:outline-2 focus:outline-blue-700"
                  type="password"
                />
                <a
                  href="#"
                  className="w-full mt-2 text-xl text-gray-500 hover:text-gray-900 text-end"
                >
                  Forget Password?
                </a>
              </div>
              <div className="mt-8">
                <button className="w-full px-4 py-2 text-xl font-bold text-white bg-blue-700 rounded hover:bg-blue-600">
                  Login
                </button>
              </div>
              <a
                href="#"
                className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
              >
                <div className="flex justify-center w-full px-5 py-3">
                  <div className="min-w-[30px]">
                    <svg className="w-6 h-6" viewBox="0 0 40 40">
                      <path
                        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                        fill="#FFC107"
                      />
                      <path
                        d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                        fill="#FF3D00"
                      />
                      <path
                        d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                        fill="#4CAF50"
                      />
                      <path
                        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                        fill="#1976D2"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-center w-full">
                    <h1 className="font-bold text-gray-600 whitespace-nowrap">
                      Sign in with Google
                    </h1>
                  </div>
                </div>
              </a>
              <div className="flex items-center w-full mt-4 text-center">
                <p
                  className="w-full text-xl text-center text-gray-500 capitalize"
                >
                  Don&apos;t have any account yet?
                  <button className="text-blue-700"> Sign Up</button>
                </p>
              </div>
            </Modal>
          </li>
          <li>
            <Link to="/cart"> 
              <FontAwesomeIcon
                icon={faBagShopping}
                className="px-2 text-xl text-gray-500"
              />
            </Link>
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
