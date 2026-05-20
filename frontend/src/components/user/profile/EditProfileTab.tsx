"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateProfileField } from "@/store/features/profileSlice";
import { userApi } from "@/lib/api/user";
import { showToast } from "nextjs-toast-notify";
import { Save, Loader2, User, Phone, Mail } from "lucide-react";

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}

const FormField = ({ label, icon, value, onChange, type = "text", placeholder, error }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium flex items-center gap-1.5">
      {icon}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] transition-all duration-200 font-montserrat text-sm text-[#1E293B] ${
        error ? "border-red-300" : "border-zinc-200"
      }`}
    />
    {error && <p className="text-red-500 text-xs font-montserrat ml-1">{error}</p>}
  </div>
);

const EditProfileTab = () => {
  const dispatch = useDispatch();
  const profile = useSelector((s: RootState) => s.profile.profile);
  const token = useSelector((s: RootState) => s.auth.accessToken);

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (phone && phone.length < 10) newErrors.phone = "Số điện thoại không hợp lệ";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Email không hợp lệ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !token) return;
    setLoading(true);
    try {
      const updated = await userApi.updateProfile(token, { name, phone, email });
      dispatch(updateProfileField(updated));
      showToast.success("Cập nhật thông tin thành công!", { duration: 2500 });
    } catch (err: any) {
      showToast.error(err?.message || "Không thể cập nhật.", { duration: 2500 });
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
      <div>
        <h3 className="text-xl font-cormorant font-semibold text-[#1E293B] tracking-tight">
          Thông tin cá nhân
        </h3>
        <p className="text-sm font-montserrat text-[#64748B] mt-1">
          Cập nhật thông tin hồ sơ của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          label="Họ và tên"
          icon={<User size={12} />}
          value={name}
          onChange={setName}
          placeholder="Nguyễn Văn A"
          error={errors.name}
        />
        <FormField
          label="Số điện thoại"
          icon={<Phone size={12} />}
          value={phone}
          onChange={setPhone}
          placeholder="0912 345 678"
          error={errors.phone}
        />
        <FormField
          label="Email"
          icon={<Mail size={12} />}
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="example@gmail.com"
          error={errors.email}
        />
      </div>

      {/* Info note */}
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-xs font-montserrat text-amber-700">
          Thông tin của bạn sẽ được bảo mật theo chính sách bảo mật của Hoàng Nam.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors duration-200 font-montserrat font-medium text-sm cursor-pointer disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Lưu thay đổi
        </button>
      </div>
    </motion.div>
  );
};

export default EditProfileTab;
