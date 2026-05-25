"use client";

import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, Loader2, ArrowLeft, LogIn, UserX } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-sm w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="h-14 w-14 text-blue-400 animate-spin relative z-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white tracking-wide">
              Đang xác thực thông tin
            </h3>
            <p className="text-sm text-slate-400 font-light">
              Vui lòng chờ trong giây lát khi chúng tôi bảo mật phiên làm việc của bạn...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check authorization
  const isAuthorized = user && (user.role === "ADMIN" || user.role === "STAFF");

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_12px_40px_0_rgba(0,0,0,0.4)] text-center space-y-8"
        >
          {/* Warning Icon Banner */}
          <div className="flex justify-center">
            <div className="relative p-5 bg-red-500/10 rounded-2xl border border-red-500/20">
              <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-lg animate-pulse" />
              {user ? (
                <UserX className="h-12 w-12 text-red-400 relative z-10" />
              ) : (
                <ShieldAlert className="h-12 w-12 text-red-400 relative z-10" />
              )}
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Truy cập bị từ chối
            </h2>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent w-3/4 mx-auto" />
            
            {user ? (
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium text-red-300 bg-red-500/10 py-1.5 px-3 rounded-lg inline-block border border-red-500/20">
                  Tài khoản không đủ thẩm quyền
                </p>
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                  Tài khoản của bạn có vai trò là <strong className="text-white font-semibold">{user.role}</strong>. Chỉ tài khoản <strong className="text-blue-400">ADMIN</strong> hoặc <strong className="text-blue-400">STAFF</strong> mới được phép truy cập khu vực này.
                </p>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium text-amber-300 bg-amber-500/10 py-1.5 px-3 rounded-lg inline-block border border-amber-500/20">
                  Yêu cầu đăng nhập
                </p>
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                  Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập bằng tài khoản quản trị để tiếp tục vào trang quản lý.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/auth/sign-in"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200"
            >
              <LogIn size={18} />
              <span>
                {user ? "Đăng nhập tài khoản khác" : "Đăng nhập ngay"}
              </span>
            </Link>

            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl font-medium active:scale-[0.98] transition-all duration-200"
            >
              <ArrowLeft size={18} />
              <span>Quay lại Trang chủ</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
