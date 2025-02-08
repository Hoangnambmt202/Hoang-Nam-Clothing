import { faGoogle, faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux"; // Import Redux hook
import { setUser } from "../../redux/slides/userSlice"; // Import action

import InputFormComponent from "../../components/InputFormComponent/InputFormComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent.jsx";
import UserService from "../../services/UserService.js";

const SignInPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch(); // Khởi tạo dispatch

  const handleOnChangePhone = (value) => setPhone(value);
  const handleOnChangePassword = (value) => setPassword(value);

  const mutation = useMutation({
    mutationFn: UserService.loginUser,
    onSuccess: (data) => {
      if (data.status === "err") {
        setMessage(data.message);
        setMessageType("error");
      } else {
        setMessage(data.message || "Đăng nhập thành công!");
        setMessageType("success");
        
        // Lưu thông tin user vào Redux
        dispatch(setUser(data.data));
        // Lưu vào Cookies
        Cookies.set("user", JSON.stringify(data.data), { expires: 7 });

        // Chuyển hướng về trang chủ
        navigate("/");
      }
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || "Đã xảy ra lỗi!");
      setMessageType("error");
      console.log(error);
    },
  });

  const handleLogin = async () => {
    mutation.mutate({ phone, password });
  };

  return (
    <div className="container min-h-screen px-4 mx-auto bg-white">
      <div className="grid grid-cols-4 py-8">
        <div className="flex flex-col justify-center items-center col-start-2 col-span-2 px-4">
          {mutation.isLoading && <LoadingComponent />}
          <h2 className="uppercase font-Dosis text-3xl mb-4"> Đăng Nhập </h2>
          <p className="italic font-thin mb-4">
            Đăng nhập để tích điểm và hưởng ưu đãi thành viên khi mua hàng. Nhập
            số điện thoại để tiếp tục đăng nhập hoặc đăng ký thành viên.
          </p>
          <div className="form mb-4">
            <InputFormComponent
              onChange={handleOnChangePhone}
              placeholder="Vui lòng nhập số điện thoại của bạn"
              value={phone}
            />
            <InputFormComponent
              onChange={handleOnChangePassword}
              value={password}
              placeholder="Mật khẩu"
            />
            <button
              className="uppercase mb-4 bg-gray-500 py-4 w-full hover:bg-black text-white font-Dosis"
              disabled={mutation.isLoading}
              onClick={handleLogin}
            >
              {mutation.isLoading ? "Đang đăng nhập..." : "Tiếp Tục"}
            </button>
            {message && (
              <span
                className={`block mb-4 text-sm ${
                  messageType === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </span>
            )}
            <p className="mb-4 text-base text-center">hoặc đăng nhập với</p>
            <div className="flex justify-center items-center mb-4">
              <Link>
                <FontAwesomeIcon
                  className="text-3xl text-blue-500"
                  icon={faSquareFacebook}
                />
              </Link>
              <Link>
                <FontAwesomeIcon
                  className="text-3xl text-red-500 ml-8"
                  icon={faGoogle}
                />
              </Link>
            </div>
            <p className="mb-4 text-base italic">
              Bằng việc đăng nhập, bạn đã đồng ý với{" "}
              <Link className="hover:underline text-blue-500">
                Điều khoản dịch vụ
              </Link>{" "}
              &{" "}
              <Link className="hover:underline text-blue-500">
                Chính sách bảo mật
              </Link>{" "}
              của Hoàng Nam
            </p>
          </div>
          <p className="mb-4 text-base">
            Hoặc bạn có thể Đăng Ký{" "}
            <span>
              <Link to="/sign-up" className="underline text-blue-500">
                Tại Đây
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
