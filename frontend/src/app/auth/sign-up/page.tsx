'use client'

import { useState } from "react";
import Link from "next/link";

import InputForm from "@/components/ui/InputForm";
import ToastMessageComponent from "@/components/ToastMessageComponent/ToastMessageComponent";
import { ChevronLeft, Home } from "lucide-react";
import Button from "@/components/ui/Button";

const SignUpPage = () => {

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // State để lưu lỗi của từng input
  const [toast, setToast] = useState({ show: false, message: "", color: "" });


  const validateField = (name: string, value: any) => {
    let error = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (name) {
      case "email":
        if (!value) error = "Vui lòng nhập email";
        else if (!emailRegex.test(value)) error = "Email không hợp lệ";
        break;

      case "phone":
        if (!value) error = "Vui lòng nhập số điện thoại";
        else if (value.length < 10) error = "Số điện thoại quá ngắn";
        break;

      case "password":
        if (!value) error = "Vui lòng nhập mật khẩu";
        else if (value.length < 6) error = "Mật khẩu phải có ít nhất 6 ký tự";
        break;

      case "confirmPassword":
        if (!value) error = "Vui lòng nhập lại mật khẩu";
        else if (value !== password) error = "Mật khẩu không khớp";
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSignUp = () => {
    // Kiểm tra tất cả các trường trước khi gửi
    validateField("email", email);
    validateField("phone", phone);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);
  
  };

  return (
    <div className="container min-h-screen px-4 mx-auto bg-white">
      {toast.show && (
        <ToastMessageComponent
          message={toast.message}
          color={toast.color}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
  <ChevronLeft size={16} className="inline-block mr-2 text-black" />
        <Button  className="mt-4 rounded-full">
          <Link href="/"> <Home size={16} className="inline-block " /> </Link>
        </Button>
      <div className="grid grid-cols-4 py-8">
        <div className="flex flex-col justify-center items-center col-start-2 col-span-2 px-4">
          <h2 className="uppercase font-Dosis text-3xl mb-4 text-black">
            
            Đăng Ký Thành Viên
          </h2>
          <p className="italic font-thin mb-4 text-gray-600">
            Đăng ký để tích điểm và hưởng ưu đãi thành viên khi mua hàng.
          </p>

          <div className="form mb-4">
            {/* Email */}
            <InputForm
              name="email"
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(value: any) => {
                setEmail(value);
                validateField("email", value);
              }}
              className="text-gray-500"
            />
            {/* {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>} */}

            {/* Số điện thoại */}
            <InputForm
              name="phone"
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(value: any) => {
                setPhone(value);
                validateField("phone", value);
              }}
                className="text-gray-500"
            />
            {/* {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>} */}

            {/* Mật khẩu */}
            <InputForm
              name="password"
              placeholder="Nhập mật khẩu"
              type="password"
              value={password}
              onChange={(value: any) => {
                setPassword(value);
                validateField("password", value);
              }}
                className="text-gray-500"
            />
            {/* {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>} */}

            {/* Nhập lại mật khẩu */}
            <InputForm
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(value: any) => {
                setConfirmPassword(value);
                validateField("confirmPassword", value);
              }}
                className="text-gray-500"
            />
            {/* {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>} */}

            <button
              className="uppercase mb-4 bg-gray-500 py-4 w-full hover:bg-black text-white font-Dosis"
              onClick={handleSignUp}
            >
              {/* {mutation.isPending ? 'Đang đăng ký...' : 'Tiếp Tục'} */}
              Tiếp Tục
            </button>

            <p className="mb-4 text-base italic text-gray-600 text-center">
              Bằng việc đăng ký, bạn đã đồng ý với <br />
              <Link href={"/"} className="hover:underline text-blue-500">
                Điều khoản dịch vụ
              </Link>{" "}
              &{" "}
              <Link href={"/"} className="hover:underline text-blue-500">
                Chính sách bảo mật
              </Link>{" "}
              của Hoàng Nam
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;