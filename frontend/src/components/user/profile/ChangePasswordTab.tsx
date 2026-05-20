"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { userApi } from "@/lib/api/user";
import { showToast } from "nextjs-toast-notify";
import { ShieldCheck, Eye, EyeOff, Loader2, CircleCheck } from "lucide-react";

interface PasswordField {
  label: string;
  value: string;
  show: boolean;
  onChange: (val: string) => void;
  onToggle: () => void;
  placeholder?: string;
  error?: string;
}

const PasswordInput = ({ label, value, show, onChange, onToggle, placeholder, error }: PasswordField) => (
  <div className="space-y-1.5">
    <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium ml-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "••••••••"}
        className={`w-full px-4 py-3 pr-12 bg-[#F8FAFC] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] transition-all duration-200 font-montserrat text-sm ${
          error ? "border-red-300" : "border-zinc-200"
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
        aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {error && <p className="text-red-500 text-xs font-montserrat ml-1">{error}</p>}
  </div>
);

const getStrength = (pwd: string) => {
  if (!pwd) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  const map = [
    { level: 0, label: "", color: "" },
    { level: 1, label: "Yếu", color: "bg-red-400" },
    { level: 2, label: "Trung bình", color: "bg-amber-400" },
    { level: 3, label: "Mạnh", color: "bg-emerald-400" },
    { level: 4, label: "Rất mạnh", color: "bg-emerald-500" },
  ];
  return map[score] || map[0];
};

const ChangePasswordTab = () => {
  const token = useSelector((s: RootState) => s.auth.accessToken);

  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [shows, setShows] = useState({ current: false, newPwd: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const strength = getStrength(newPwd);

  const toggle = (key: keyof typeof shows) =>
    setShows((s) => ({ ...s, [key]: !s[key] }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!current) e.current = "Nhập mật khẩu hiện tại";
    if (!newPwd) e.newPwd = "Nhập mật khẩu mới";
    else if (newPwd.length < 6) e.newPwd = "Tối thiểu 6 ký tự";
    if (!confirm) e.confirm = "Nhập lại mật khẩu mới";
    else if (confirm !== newPwd) e.confirm = "Mật khẩu không khớp";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;
    setLoading(true);
    try {
      await userApi.changePassword(token, { currentPassword: current, newPassword: newPwd });
      showToast.success("Đổi mật khẩu thành công!", { duration: 2500 });
      setCurrent(""); setNewPwd(""); setConfirm("");
    } catch (err: any) {
      showToast.error(err?.message || "Không thể đổi mật khẩu.", { duration: 2500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
          <ShieldCheck size={20} className="text-[#1E293B]" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-cormorant font-semibold text-[#1E293B] tracking-tight">
            Đổi mật khẩu
          </h3>
          <p className="text-sm font-montserrat text-[#64748B]">Cập nhật mật khẩu để bảo vệ tài khoản</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <PasswordInput
          label="Mật khẩu hiện tại"
          value={current}
          show={shows.current}
          onChange={(v) => { setCurrent(v); if (errors.current) setErrors({ ...errors, current: "" }); }}
          onToggle={() => toggle("current")}
          error={errors.current}
        />

        <div className="space-y-2">
          <PasswordInput
            label="Mật khẩu mới"
            value={newPwd}
            show={shows.newPwd}
            onChange={(v) => { setNewPwd(v); if (errors.newPwd) setErrors({ ...errors, newPwd: "" }); }}
            onToggle={() => toggle("newPwd")}
            error={errors.newPwd}
          />
          {/* Strength bar */}
          <AnimatePresence>
            {newPwd && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5 pl-1"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((seg) => (
                    <div key={seg} className="h-1 flex-1 rounded-full bg-zinc-200 overflow-hidden">
                      <motion.div
                        animate={{ width: strength.level >= seg ? "100%" : "0%" }}
                        transition={{ duration: 0.3 }}
                        className={`h-full ${strength.level >= seg ? strength.color : ""}`}
                      />
                    </div>
                  ))}
                </div>
                {strength.label && (
                  <p className={`text-xs font-montserrat ${strength.level <= 1 ? "text-red-500" : strength.level === 2 ? "text-amber-500" : "text-emerald-600"}`}>
                    {strength.label}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <PasswordInput
            label="Xác nhận mật khẩu mới"
            value={confirm}
            show={shows.confirm}
            onChange={(v) => { setConfirm(v); if (errors.confirm) setErrors({ ...errors, confirm: "" }); }}
            onToggle={() => toggle("confirm")}
            error={errors.confirm}
          />
          <AnimatePresence>
            {confirm && confirm === newPwd && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-emerald-600 text-xs font-montserrat flex items-center gap-1 mt-1.5 ml-1"
              >
                <CircleCheck size={13} /> Mật khẩu khớp
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors duration-200 font-montserrat font-medium text-sm cursor-pointer disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            Cập nhật mật khẩu
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChangePasswordTab;
