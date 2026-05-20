"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { showToast } from "nextjs-toast-notify";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const SignInPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      showToast.error("Vui lòng nhập đầy đủ thông tin", { duration: 2000 });
      return;
    }

    setLoading(true);
    try {
      const res = await login(emailOrPhone, password);
      showToast.success("Đăng nhập thành công!", { duration: 2000 });
      
      const role = res?.user?.role;
      if (role === "ADMIN" || role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      showToast.error(error?.message || "Đăng nhập thất bại", {
        duration: 2000,
      });
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
              "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')",
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
            Nơi vẻ đẹp <br /> được tôn vinh.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-montserrat font-light tracking-wide text-white/80 max-w-md"
          >
            Khám phá bộ sưu tập thời trang tinh tế, mang đậm phong cách đương
            đại tại Hoàng Nam Clothing.
          </motion.p>
        </div>
      </div>

      {/* Right side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <Link
          href="/"
          className="absolute top-6 left-8 text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2 group"
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
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] mt-5"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-cormorant font-semibold text-[#1E293B] mb-2 tracking-tight">
              Đăng nhập
            </h2>
            <p className="font-montserrat text-sm text-[#475569] font-light">
              Chào mừng bạn trở lại với Hoàng Nam
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Email hoặc Số điện thoại
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="example@gmail.com hoặc 0912 345 678"
                className="w-full px-5 py-4 bg-white/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all font-montserrat text-gray-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                  Mật khẩu
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-montserrat text-[#2563EB] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all font-montserrat text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center py-4 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors overflow-hidden group font-montserrat font-medium"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="relative z-10">Đăng Nhập</span>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-zinc-200 w-full" />
            <span className="text-xs text-zinc-400 font-montserrat uppercase tracking-wider whitespace-nowrap">
              Hoặc tiếp tục với
            </span>
            <div className="h-px bg-zinc-200 w-full" />
          </div>

          <div className="mt-6 flex gap-4">
            <button className="flex-1 flex justify-center items-center py-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <FaGoogle size={18} className="text-[#DB4437]" />
            </button>
            <button className="flex-1 flex justify-center items-center py-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <FaFacebook size={18} className="text-[#4267B2]" />
            </button>
          </div>

          <p className="mt-8 text-center text-sm font-montserrat text-[#64748B]">
            Chưa có tài khoản?{" "}
            <Link
              href="/auth/sign-up"
              className="text-[#2563EB] font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;
