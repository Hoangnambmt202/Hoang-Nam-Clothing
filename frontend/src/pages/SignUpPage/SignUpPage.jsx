import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import UserService from "../../services/UserService";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import ToastMessageComponent from "../../components/ToastMessageComponent/ToastMessageComponent";

export const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({}); // State để lưu lỗi của từng input
  const [toast, setToast] = useState({ show: false, message: "", color: "" });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: UserService.registerUser,
    onSuccess: (data) => {
      if (data.status === "err") {
        setToast({ show: true, message: data.message, color: "red" });
      } else {
        setToast({ show: true, message: "Đăng ký thành công!", color: "green" });
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      }
    },
    onError: (error) => {
      setToast({ show: true, message: "Đã xảy ra lỗi", color: "red" });
      console.log(error);
    },
  });

  const validateField = (name, value) => {
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
    if (Object.values(errors).every((err) => err === "")) {
      mutation.mutate({ email, phone, password, confirmPassword });
    }
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

      {mutation.isPending && <LoadingComponent />}
      
      <div className="grid grid-cols-4 py-8">
        <div className="flex flex-col justify-center items-center col-start-2 col-span-2 px-4">
          <h2 className="uppercase font-Dosis text-3xl mb-4"> Đăng Ký Thành Viên </h2>
          <p className="italic font-thin mb-4">
            Đăng ký để tích điểm và hưởng ưu đãi thành viên khi mua hàng.
          </p>

          <div className="form mb-4">
            {/* Email */}
            <InputFormComponent 
              placeholder="Nhập email" 
              value={email} 
              onChange={(value) => {
                setEmail(value);
                validateField("email", value);
              }} 
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            
            {/* Số điện thoại */}
            <InputFormComponent 
              placeholder="Nhập số điện thoại" 
              value={phone} 
              onChange={(value) => {
                setPhone(value);
                validateField("phone", value);
              }} 
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
            
            {/* Mật khẩu */}
            <InputFormComponent 
              placeholder="Nhập mật khẩu" 
              type="password" 
              value={password} 
              onChange={(value) => {
                setPassword(value);
                validateField("password", value);
              }} 
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
            
            {/* Nhập lại mật khẩu */}
            <InputFormComponent 
              placeholder="Nhập lại mật khẩu" 
              type="password" 
              value={confirmPassword} 
              onChange={(value) => {
                setConfirmPassword(value);
                validateField("confirmPassword", value);
              }} 
            />
            {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}

            <button
              className="uppercase mb-4 bg-gray-500 py-4 w-full hover:bg-black text-white font-Dosis"
              onClick={handleSignUp}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Đang đăng ký...' : 'Tiếp Tục'}
            </button>
            
            <p className="mb-4 text-base italic">
              Bằng việc đăng ký, bạn đã đồng ý với{' '}
              <Link className="hover:underline text-blue-500">Điều khoản dịch vụ</Link> &{' '}
              <Link className="hover:underline text-blue-500">Chính sách bảo mật</Link> của Hoàng Nam
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
