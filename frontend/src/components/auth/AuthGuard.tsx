"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "ADMIN" || user.role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center space-y-6 max-w-sm w-full bg-white/40 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.04)]"
        >
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
            <Loader2 className="h-12 w-12 text-slate-800 animate-spin relative z-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-montserrat font-medium text-slate-800 tracking-wide">
              Đang xác thực thông tin
            </h3>
            <p className="text-xs font-montserrat text-slate-500 font-light">
              Vui lòng chờ trong giây lát khi chúng tôi xử lý yêu cầu của bạn...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
