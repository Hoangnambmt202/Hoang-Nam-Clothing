import { useState } from "react";

import {  useLocation,Link } from "react-router-dom";
import Modal from "../../components/ModalComponent/ModalComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
const CheckoutPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const location = useLocation();


  const [orderDetails, setOrderDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
const cartItems = location.state?.cartItems || [];
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmitOrder = () => {
    if (!orderDetails.name || !orderDetails.phone || !orderDetails.address) {
      alert("Vui lòng nhập đầy đủ thông tin đặt hàng!");
      return;
    }

    // Giả lập xử lý gửi đơn hàng
    console.log("Đơn hàng:", {
      customer: orderDetails,
      items: cartItems,
      total: calculateTotal(),
    });

   
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-semibold">Xác Nhận Đơn Hàng</h2>
      <div className="grid gap-6">
        {/* Form Thông Tin */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-xl font-semibold">Thông Tin Đặt Hàng</h3>
          <form className="grid gap-4">
            <div>
              <label htmlFor="name" className="block font-medium">
                Họ và Tên
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-4 py-2 border rounded"
                value={orderDetails.name}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block font-medium">
                Số Điện Thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full px-4 py-2 border rounded"
                value={orderDetails.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label htmlFor="address" className="block font-medium">
                Địa Chỉ Giao Hàng
              </label>
              <textarea
                id="address"
                name="address"
                className="w-full px-4 py-2 border rounded"
                value={orderDetails.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
              />
            </div>
          </form>
        </div>

        {/* Danh Sách Sản Phẩm */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-xl font-semibold">Sản Phẩm</h3>
          <ul>
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-16 h-16 mr-4 rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                </div>
                <span>
                  {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-semibold">
            <span>Tổng Cộng:</span>
            <span>{calculateTotal().toLocaleString("vi-VN")} VND</span>
          </div>
        </div>

        {/* Nút Xác Nhận */}
        <button
          className="w-full py-3 text-white bg-black rounded-lg hover:bg-gray-800"
          onClick={() => {setIsModalOpen(true);handleSubmitOrder()}}
        >
          Xác Nhận Đơn Hàng
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title=""
        >
          <div className="container px-4 py-8 mx-auto text-center">
            <FontAwesomeIcon
              className="text-2xl bg-green-600 rounded-full"
              icon={faCircleCheck}
            />
            <h2 className="mb-4 text-2xl font-semibold">
              Đặt Hàng Thành Công!
            </h2>
            <p className="mb-6">
              Chúng tôi sẽ liên hệ bạn sớm để xác nhận đơn hàng.
            </p>
            <Link to="/" className="text-blue-500 hover:underline">
              Quay lại trang chủ
            </Link>
          </div>
        </Modal>
      </div>
    </div>
  );
};


export default CheckoutPage;

