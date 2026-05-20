"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { showToast } from "nextjs-toast-notify";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return (setError("Vui lòng nhập email"), false);
    if (!emailRegex.test(email)) return (setError("Email không hợp lệ"), false);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.requestOtp(email);
      showToast.success("Mã OTP đã được gửi vào email của bạn!", {
        duration: 3000,
      });
      // Store email in session for next step
      sessionStorage.setItem("reset_email", email);
      router.push("/auth/verify-otp");
    } catch (err: any) {
      showToast.error(err?.message || "Không thể gửi OTP, thử lại sau.", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Decorative lock icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <ShieldCheck size={44} className="text-white" strokeWidth={1.5} />
          </div>
        </motion.div>

        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-cormorant font-semibold mb-4 leading-tight"
          >
            Khôi phục <br /> tài khoản.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-montserrat font-light tracking-wide text-white/75 max-w-md"
          >
            Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập chỉ trong
            vài bước đơn giản.
          </motion.p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <Link
          href="/auth/sign-in"
          className="absolute top-8 left-8 text-zinc-500 hover:text-zinc-900 transition-colors duration-200 flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span className="font-montserrat text-sm uppercase tracking-wider">
            Đăng nhập
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] mt-6"
        >
          {/* Icon header */}
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-8">
            <Mail size={26} className="text-[#1E293B]" strokeWidth={1.5} />
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-cormorant font-semibold text-[#1E293B] mb-2 tracking-tight">
              Quên mật khẩu?
            </h2>
            <p className="font-montserrat text-sm text-[#475569] font-light leading-relaxed">
              Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã xác thực OTP để
              đặt lại mật khẩu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="example@gmail.com"
                className={`w-full px-5 py-4 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 transition-all duration-200 font-montserrat text-sm text-gray-500 ${
                  error
                    ? "border-red-400 focus:border-red-400"
                    : "border-zinc-200 focus:border-[#2563EB]"
                }`}
              />
              {error && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-montserrat">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center py-4 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors duration-200 overflow-hidden group font-montserrat font-medium cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="relative z-10">Gửi mã OTP</span>
              )}
            </button>
          </form>

          {/* Info note */}
          <div className="mt-6 p-4 bg-blue-50/80 border border-blue-100 rounded-2xl">
            <p className="text-xs font-montserrat text-[#475569] leading-relaxed">
              Kiểm tra cả hộp thư{" "}
              <span className="font-medium text-[#1E293B]">Spam / Junk</span>{" "}
              nếu bạn không nhận được email trong vòng 2 phút.
            </p>
          </div>

          <p className="mt-6 text-center text-sm font-montserrat text-[#64748B]">
            Nhớ ra mật khẩu?{" "}
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

export default ForgotPasswordPage;
