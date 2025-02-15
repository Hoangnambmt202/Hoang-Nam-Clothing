
import Header from "../components/HeaderComponent/HeaderComponent";
import Footer from "../components/FooterComponent/FooterComponent";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// import "../../styles/UserPage.module.scss";  
function UserLayout() {

   const [user, setUser] = useState("");
    const [activeDropdown, setActiveDropdown] = useState(null);
  
    useEffect(() => {
      const storedUser = Cookies.get("user"); // Lấy user từ cookies
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Lỗi khi phân tích JSON:", error);
          Cookies.remove("user"); // Xóa nếu lỗi
        }
      }
    }, []);
  
    const toggleDropdown = (menu) => {
      setActiveDropdown(activeDropdown === menu ? null : menu);
    };
  
  return (

    
  <>
  <Header/>
  <div className="container flex px-4 mx-auto py-4">
      <aside className="px-4 basis-3/12 h-auto bg-neutral-100 py-4">
        <div className="flex flex-col items-center justify-center header-account">
          <img
            src="https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg"
            alt="user avt"
            className="rounded-full w-14 h-14 account-img"
          />
          <div className="account-name">{user.name}</div>
        </div>
        <div className="aside-menu-section mt-4">
          <ul className="space-y-2">
            {/* Tài khoản của tôi */}
            <li>
              <button
                className="w-full flex justify-between text-sm items-center px-3 py-2 bg-white shadow rounded-md"
                onClick={() => toggleDropdown("account")}
              >
                Tài khoản của tôi
                <FontAwesomeIcon
                  icon={activeDropdown === "account" ? faChevronUp : faChevronDown}
                />
              </button>
              {activeDropdown === "account" && (
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <Link to="account/profile" className="block py-1 text-sm hover:text-blue-500">
                    <FontAwesomeIcon icon={faChevronRight} className="mr-4"/>
                      Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/account/password" className="block py-1 text-sm hover:text-blue-500">
                      Đổi mật khẩu
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/account/password" className="block py-1 text-sm hover:text-blue-500">
                      Địa chỉ
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/account/password" className="block py-1 text-sm hover:text-blue-500">
                      Phương thức thanh toán
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Yêu Thích */}
            <li>
              <button
                className="w-full flex justify-between items-center px-3 py-2 text-sm bg-white shadow rounded-md"
                onClick={() => toggleDropdown("wishlist")}
              >
                Sản Phẩm Yêu Thích
                <FontAwesomeIcon
                  icon={activeDropdown === "wishlist" ? faChevronUp : faChevronDown}
                />
              </button>
              
                 
                
          
            </li>

            {/* Đơn Mua */}
            <li>
              <button
                className="w-full flex justify-between items-center px-3 py-2 text-sm bg-white shadow rounded-md"
                onClick={() => toggleDropdown("orders")}
              >
                Đơn Mua
                <FontAwesomeIcon
                  icon={activeDropdown === "orders" ? faChevronUp : faChevronDown}
                />
              </button>
              {activeDropdown === "orders" && (
                <ul className="pl-6 mt-2 space-y-1">
                  <li>
                    <Link to="/user/orders" className="block py-1 text-sm hover:text-blue-500">
                      Đơn hàng
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/order-tracking" className="block py-1 text-sm hover:text-blue-500">
                      Theo dõi đơn hàng
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Voucher */}
            <li>
              <Link to="/user/my-vouchers"
                className="w-full flex justify-between items-center px-3 py-2 text-sm bg-white shadow rounded-md"
               
              >
                Voucher của tôi
               
              </Link>
             
            </li>

            {/* Thông báo */}
            <li>
              <Link to="/user/notification"
                className="w-full flex justify-between items-center px-3 py-2 text-sm bg-white shadow rounded-md"
                onClick={() => toggleDropdown("notifications")}
              >
                Thông báo
                {/* <FontAwesomeIcon
                  icon={activeDropdown === "notifications" ? faChevronUp : faChevronDown}
                /> */}
              </Link>
              {/* {activeDropdown === "notifications" && (
                <ul className="pl-6 mt-2 space-y-1">
                  <li>
                    <Link to="/user/notifications/system" className="block py-1 text-sm hover:text-blue-500">
                      Thông báo hệ thống
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/notifications/orders" className="block py-1 text-sm hover:text-blue-500">
                      Thông báo đơn hàng
                    </Link>
                  </li>
                </ul>
              )} */}
            </li>
          </ul>
        </div>
      </aside>

      {/* Nội dung trang */}
      <div className="flex-1 flex flex-col px-4 bg-white shadow-xl basis-9/12 min-h-screen">
        <Outlet/>
      </div>
    </div>
    
  <Footer/>
  </>
  );
}

export default UserLayout;
