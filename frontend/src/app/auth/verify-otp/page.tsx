"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { showToast } from "nextjs-toast-notify";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, KeyRound, RefreshCw } from "lucide-react";

const OTP_LENGTH = 6;

const VerifyOtpPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_email");
    if (!storedEmail) {
      router.replace("/auth/forgot-password");
      return;
    }
    setEmail(storedEmail);
    inputRefs.current[0]?.focus();
  }, [router]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // take last char only
    setOtp(newOtp);

    // Auto advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    inputRefs.current[nextEmpty !== -1 ? nextEmpty : OTP_LENGTH - 1]?.focus();
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    try {
      await authApi.requestOtp(email);
      showToast.success("Mã OTP mới đã được gửi!", { duration: 2500 });
      setCountdown(60);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      showToast.error(err?.message || "Không thể gửi lại OTP.", { duration: 2500 });
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      showToast.error("Vui lòng nhập đủ 6 chữ số OTP.", { duration: 2500 });
      return;
    }
    setLoading(true);
    try {
      await authApi.verifyOtp(email, code);
      // Store OTP for next step
      sessionStorage.setItem("reset_otp", code);
      showToast.success("Xác thực thành công!", { duration: 2000 });
      router.push("/auth/reset-password");
    } catch (err: any) {
      showToast.error(err?.message || "Mã OTP không đúng hoặc đã hết hạn.", { duration: 2500 });
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const isFilled = otp.every((v) => v !== "");

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
              "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Decorative icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <KeyRound size={44} className="text-white" strokeWidth={1.5} />
          </div>
          {/* Fake OTP preview dots */}
          <div className="flex gap-2 mt-2">
            {Array(6).fill(0).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="w-3 h-3 rounded-full bg-white/40"
              />
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-cormorant font-semibold mb-4 leading-tight"
          >
            Xác thực <br /> danh tính.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-montserrat font-light tracking-wide text-white/75 max-w-md"
          >
            Mã OTP đã được gửi đến email của bạn. Có hiệu lực trong vòng 5 phút.
          </motion.p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <Link
          href="/auth/forgot-password"
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
            <KeyRound size={26} className="text-[#1E293B]" strokeWidth={1.5} />
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-cormorant font-semibold text-[#1E293B] mb-2 tracking-tight">
              Nhập mã OTP
            </h2>
            <p className="font-montserrat text-sm text-[#475569] font-light leading-relaxed">
              Mã 6 chữ số đã gửi đến{" "}
              <span className="font-medium text-[#1E293B]">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            {/* OTP Inputs */}
            <div className="flex gap-3 justify-between">
              {otp.map((digit, i) => (
                <motion.input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className={`w-12 h-14 text-center text-xl font-semibold font-montserrat rounded-xl border-2 bg-white/60 focus:outline-none transition-all duration-200 cursor-text ${
                    digit
                      ? "border-[#1E293B] bg-white shadow-sm"
                      : "border-zinc-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/30"
                  }`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || !isFilled}
              className={`w-full relative flex items-center justify-center py-4 rounded-xl overflow-hidden group font-montserrat font-medium transition-all duration-200 cursor-pointer ${
                isFilled
                  ? "bg-[#1E293B] text-white hover:bg-[#0F172A]"
                  : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
              }`}
            >
              {isFilled && (
                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              )}
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="relative z-10">Xác thực</span>
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-sm font-montserrat text-[#64748B]">Không nhận được mã?</span>
            <button
              onClick={handleResend}
              disabled={!canResend || resending}
              className={`flex items-center gap-1.5 text-sm font-montserrat font-medium transition-all duration-200 cursor-pointer ${
                canResend ? "text-[#2563EB] hover:underline" : "text-zinc-400 cursor-not-allowed"
              }`}
            >
              {resending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} className={canResend ? "" : "opacity-50"} />
              )}
              {canResend ? "Gửi lại" : `Gửi lại (${countdown}s)`}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
