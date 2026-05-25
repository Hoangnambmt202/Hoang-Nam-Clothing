"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "nextjs-toast-notify";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const SignUpPage = () => {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName) newErrors.fullName = "Vui lòng nhập họ và tên";

    if (!email) newErrors.email = "Vui lòng nhập email";
    else if (!emailRegex.test(email)) newErrors.email = "Email không hợp lệ";

    if (!phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (phone.length < 10) newErrors.phone = "Số điện thoại quá ngắn";

    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    if (!confirmPassword)
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Mật khẩu không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const nameParts = fullName.trim().split(/\s+/);
    let firstName = "Khách";
    let lastName = "Hàng";
    if (nameParts.length > 0) {
      if (nameParts.length === 1) {
        lastName = nameParts[0];
        firstName = "";
      } else {
        lastName = nameParts[nameParts.length - 1];
        firstName = nameParts.slice(0, nameParts.length - 1).join(" ");
      }
    }

    setLoading(true);
    try {
      await register({ email, phone, password, firstName, lastName });
      showToast.success("Đăng ký thành công! Vui lòng đăng nhập.", {
        duration: 2000,
      });
      router.push("/auth/sign-in");
    } catch (error: any) {
      showToast.error(error?.message || "Đăng ký thất bại", { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Left side Image - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-cormorant font-semibold mb-4 leading-tight"
          >
            Định hình <br /> phong cách.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-montserrat font-light tracking-wide text-white/80 max-w-md"
          >
            Gia nhập cộng đồng Hoàng Nam Clothing để tận hưởng các đặc quyền mua
            sắm và xu hướng thời trang mới nhất.
          </motion.p>
        </div>
      </div>

      {/* Right side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <Link
          href="/"
          className="absolute top-8 left-8 text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2 group z-20"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-montserrat text-sm uppercase tracking-wider">
            Trang chủ
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
        >
          <div className="mb-8 mt-4">
            <h2 className="text-4xl font-cormorant font-semibold text-[#1E293B] mb-2 tracking-tight">
              Đăng ký
            </h2>
            <p className="font-montserrat text-sm text-[#475569] font-light">
              Tạo tài khoản để trải nghiệm tốt nhất
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Họ và tên */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: "" });
                }}
                placeholder="Nguyễn Văn A"
                className={`w-full px-5 py-3.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 transition-all text-gray-500 font-montserrat ${errors.fullName ? "border-red-400 focus:border-red-400 " : "border-zinc-200 focus:border-[#2563EB]"}`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-montserrat">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="example@gmail.com"
                className={`w-full px-5 py-3.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 transition-all text-gray-500 font-montserrat ${errors.email ? "border-red-400 focus:border-red-400 " : "border-zinc-200 focus:border-[#2563EB]"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-montserrat">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                placeholder="0912 345 678"
                className={`w-full px-5 py-3.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 transition-all text-gray-500 font-montserrat ${errors.phone ? "border-red-400 focus:border-red-400 " : "border-zinc-200 focus:border-[#2563EB]"}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-montserrat">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                placeholder="••••••••"
                className={`w-full px-5 py-3.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 transition-all text-gray-500 font-montserrat ${errors.password ? "border-red-400 focus:border-red-400 " : "border-zinc-200 focus:border-[#2563EB]"}`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-montserrat">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
                placeholder="••••••••"
                className={`w-full px-5 py-3.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 transition-all text-gray-500 font-montserrat ${errors.confirmPassword ? "border-red-400 focus:border-red-400 " : "border-zinc-200 focus:border-[#2563EB]"}`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-montserrat">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center py-4 mt-2 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors overflow-hidden group font-montserrat font-medium"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="relative z-10">Tạo tài khoản</span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-montserrat text-[#64748B]">
            Đã có tài khoản?{" "}
            <Link
              href="/auth/sign-in"
              className="text-[#2563EB] font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
