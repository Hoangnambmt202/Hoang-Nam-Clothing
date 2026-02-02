"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

import { useRouter } from "next/navigation";
import InputForm from "@/components/ui/InputForm";
import ToastMessageComponent from "@/components/shared/ToastMessage";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { ChevronLeft, Home } from "lucide-react";

const SignInPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", color: "" });

  const handleOnChangePhone = (value: any) => setPhone(value);
  const handleOnChangePassword = (value: any) => setPassword(value);

  const handleLogin = async () => {
    // login(phone, password)
    ToastMessageComponent({
      message: "Đang đăng nhập...",
      color: "blue",
      onClose: () => setToast({ ...toast, show: false }),
    });
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
      <Button className="mt-4 rounded-full">
        <Link href="/">
          {" "}
          <Home size={16} className="inline-block " />{" "}
        </Link>
      </Button>
      <div className="grid grid-cols-4 py-8">
        <div className="flex flex-col justify-center items-center col-start-2 col-span-2 px-4">
          <h2 className="uppercase font-Dosis text-black text-3xl mb-4">
            {" "}
            Đăng Nhập{" "}
          </h2>
          <p className="italic font-thin text-gray-600 mb-4">
            Đăng nhập để tích điểm và hưởng ưu đãi thành viên khi mua hàng. Nhập
            số điện thoại để tiếp tục đăng nhập hoặc đăng ký thành viên.
          </p>
          <div className="flex flex-col  mb-4">
            <form onSubmit={handleLogin} className="flex flex-col space-y-2">
              <InputForm
                name="phone"
                type="text"
                onChange={handleOnChangePhone}
                placeholder="Vui lòng nhập số điện thoại của bạn"
                value={phone}
                className="text-gray-500 "
              />
              <InputForm
                name="password"
                type="password"
                onChange={handleOnChangePassword}
                value={password}
                placeholder="Mật khẩu"
                className="text-gray-500 "
              />
              <button
                className="uppercase mb-4 bg-gray-500 py-4 w-full hover:bg-black text-white font-Dosis"
                onClick={handleLogin}
              >
                Đăng Nhập
              </button>
            </form>

            <p className="mb-4 text-base text-center text-gray-500">
              hoặc đăng nhập với
            </p>
            <div className="flex justify-center items-center mb-4">
              <Link href="/sign-in/facebook" className="mr-8">
                <FaFacebook size={20} color="blue" />
              </Link>
              <Link href={"/sign-in/google"}>
                <FaGoogle size={20} color="red" />
              </Link>
            </div>
            <p className="mb-4 text-base italic text-black text-center">
              Bằng việc đăng nhập, bạn đã đồng ý với <br />
              <Link
                href={"/dieu-khoan"}
                className="hover:underline text-blue-500"
              >
                Điều khoản dịch vụ
              </Link>{" "}
              &{" "}
              <Link
                href={"/chinh-sach"}
                className="hover:underline text-blue-500"
              >
                Chính sách bảo mật
              </Link>{" "}
              của Hoàng Nam
            </p>
          </div>
          <p className="mb-4 text-base text-black">
            Hoặc bạn có thể Đăng Ký{" "}
            <span>
              <Link href="/auth/sign-up" className="underline text-blue-500">
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
