"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { showToast } from "nextjs-toast-notify";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, LockKeyhole, Eye, EyeOff, CircleCheck } from "lucide-react";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_email");
    const storedOtp = sessionStorage.getItem("reset_otp");
    if (!storedEmail || !storedOtp) {
      router.replace("/auth/forgot-password");
      return;
    }
    setEmail(storedEmail);
    setOtp(storedOtp);
  }, [router]);

  // Password strength calculation
  const getStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score === 1) return { level: 1, label: "Yếu", color: "bg-red-400" };
    if (score === 2) return { level: 2, label: "Trung bình", color: "bg-amber-400" };
    if (score === 3) return { level: 3, label: "Mạnh", color: "bg-emerald-400" };
    if (score >= 4) return { level: 4, label: "Rất mạnh", color: "bg-emerald-500" };
    return { level: 0, label: "", color: "" };
  };

  const strength = getStrength(password);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu mới";
    else if (password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (!confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Mật khẩu không khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.resetPassword(email, otp, password);
      // Clean up sessionStorage
      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_otp");
      setDone(true);
    } catch (err: any) {
      showToast.error(err?.message || "Không thể đặt lại mật khẩu.", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (done) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC] items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
          >
            <CircleCheck size={44} className="text-emerald-600" strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-3xl font-cormorant font-semibold text-[#1E293B] mb-3 tracking-tight">
            Đặt lại thành công!
          </h2>
          <p className="font-montserrat text-sm text-[#475569] font-light mb-8 leading-relaxed">
            Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center justify-center w-full py-4 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors duration-200 font-montserrat font-medium"
          >
            Đăng nhập ngay
          </Link>
        </motion.div>
      </div>
    );
  }

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
              "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Decorative icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <LockKeyhole size={44} className="text-white" strokeWidth={1.5} />
          </div>
        </motion.div>

        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-cormorant font-semibold mb-4 leading-tight"
          >
            Mật khẩu <br /> mới.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-montserrat font-light tracking-wide text-white/75 max-w-md"
          >
            Tạo mật khẩu mạnh để bảo vệ tài khoản Hoàng Nam Clothing của bạn.
          </motion.p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <Link
          href="/auth/verify-otp"
          className="absolute top-8 left-8 text-zinc-500 hover:text-zinc-900 transition-colors duration-200 flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-montserrat text-sm uppercase tracking-wider">Quay lại</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
        >
          {/* Icon header */}
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-8">
            <LockKeyhole size={26} className="text-[#1E293B]" strokeWidth={1.5} />
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-cormorant font-semibold text-[#1E293B] mb-2 tracking-tight">
              Đặt lại mật khẩu
            </h2>
            <p className="font-montserrat text-sm text-[#475569] font-light leading-relaxed">
              Tạo mật khẩu mới cho tài khoản{" "}
              <span className="font-medium text-[#1E293B]">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New password */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  placeholder="••••••••"
                  className={`w-full px-5 py-4 pr-12 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 transition-all duration-200 font-montserrat text-sm ${
                    errors.password
                      ? "border-red-400"
                      : "border-zinc-200 focus:border-[#2563EB]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-montserrat">{errors.password}</p>
              )}

              {/* Password strength bar */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 space-y-1.5"
                  >
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((seg) => (
                        <div key={seg} className="h-1 flex-1 rounded-full bg-zinc-200 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: strength.level >= seg ? "100%" : "0%" }}
                            transition={{ duration: 0.3 }}
                            className={`h-full ${strength.level >= seg ? strength.color : ""}`}
                          />
                        </div>
                      ))}
                    </div>
                    <p className={`text-xs font-montserrat ml-1 ${strength.level <= 1 ? "text-red-500" : strength.level === 2 ? "text-amber-500" : "text-emerald-600"}`}>
                      {strength.label}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                  placeholder="••••••••"
                  className={`w-full px-5 py-4 pr-12 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 transition-all duration-200 font-montserrat text-sm ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-zinc-200 focus:border-[#2563EB]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-montserrat">{errors.confirmPassword}</p>
              )}
              {/* Match indicator */}
              {confirmPassword && confirmPassword === password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-montserrat text-emerald-600 ml-1 flex items-center gap-1"
                >
                  <CircleCheck size={13} /> Mật khẩu khớp
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center py-4 mt-2 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors duration-200 overflow-hidden group font-montserrat font-medium cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="relative z-10">Xác nhận đặt lại</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
