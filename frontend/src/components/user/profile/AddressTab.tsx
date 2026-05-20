"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { userApi } from "@/lib/api/user";
import { showToast } from "nextjs-toast-notify";
import {
  MapPin,
  Plus,
  Trash2,
  Loader2,
  Home,
  Briefcase,
  Star,
  X,
} from "lucide-react";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault?: boolean;
};

const LABEL_ICONS: Record<string, React.ReactNode> = {
  Nhà: <Home size={14} />,
  "Công ty": <Briefcase size={14} />,
  Khác: <MapPin size={14} />,
};

const AddressCard = ({
  addr,
  onDelete,
}: {
  addr: Address;
  onDelete: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.97 }}
    layout
    className={`relative p-5 rounded-xl border transition-colors ${
      addr.isDefault
        ? "border-[#1E293B] bg-[#1E293B]/[0.02]"
        : "border-zinc-200 bg-white hover:border-zinc-300"
    }`}
  >
    {addr.isDefault && (
      <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-montserrat font-semibold text-[#1E293B] bg-zinc-100 px-2 py-0.5 rounded-full">
        <Star size={9} /> Mặc định
      </span>
    )}

    <div className="flex items-center gap-2 mb-2">
      <span className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-[#475569]">
        {LABEL_ICONS[addr.label] ?? <MapPin size={14} />}
      </span>
      <span className="text-sm font-montserrat font-semibold text-[#1E293B]">{addr.label}</span>
    </div>

    <p className="text-sm font-montserrat text-[#1E293B] font-medium">{addr.fullName}</p>
    <p className="text-xs font-montserrat text-[#64748B] mt-0.5">{addr.phone}</p>
    <p className="text-xs font-montserrat text-[#64748B] mt-1 leading-relaxed">{addr.address}</p>

    <button
      onClick={() => onDelete(addr.id)}
      className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
      aria-label="Xóa địa chỉ"
    >
      <Trash2 size={14} />
    </button>
  </motion.div>
);

const AddressTab = () => {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // New address form state
  const [form, setForm] = useState({
    label: "Nhà",
    fullName: "",
    phone: "",
    address: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await userApi.getAddresses(token);
        setAddresses(data?.addresses ?? []);
      } catch {
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      showToast.error("Vui lòng điền đầy đủ thông tin.", { duration: 2000 });
      return;
    }
    if (!token) return;
    setSaving(true);
    try {
      const newAddr = await userApi.addAddress(token, form);
      setAddresses((prev) => [...prev, newAddr]);
      setShowForm(false);
      setForm({ label: "Nhà", fullName: "", phone: "", address: "", isDefault: false });
      showToast.success("Đã thêm địa chỉ!", { duration: 2000 });
    } catch (err: any) {
      showToast.error(err?.message || "Không thể thêm địa chỉ.", { duration: 2000 });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await userApi.deleteAddress(token, id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast.success("Đã xoá địa chỉ.", { duration: 2000 });
    } catch {
      showToast.error("Không thể xoá địa chỉ.", { duration: 2000 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-cormorant font-semibold text-[#1E293B] tracking-tight">
            Sổ địa chỉ
          </h3>
          <p className="text-sm font-montserrat text-[#64748B] mt-1">
            Quản lý địa chỉ giao hàng của bạn
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1E293B] text-white rounded-xl text-sm font-montserrat font-medium hover:bg-[#0F172A] transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Thêm địa chỉ
        </button>
      </div>

      {/* Address list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="animate-spin text-zinc-300" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-zinc-200 rounded-2xl">
          <MapPin size={32} className="mx-auto text-zinc-300 mb-3" strokeWidth={1.5} />
          <p className="font-montserrat text-sm text-[#64748B]">Chưa có địa chỉ nào</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-sm font-montserrat font-medium text-[#2563EB] hover:underline cursor-pointer"
          >
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {addresses.map((addr) => (
              <AddressCard key={addr.id} addr={addr} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add address modal/drawer */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto z-50 bg-white rounded-t-3xl lg:rounded-2xl border border-zinc-200 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-lg font-cormorant font-semibold text-[#1E293B]">
                  Thêm địa chỉ mới
                </h4>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <X size={18} className="text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                {/* Label selector */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                    Loại địa chỉ
                  </label>
                  <div className="flex gap-2">
                    {["Nhà", "Công ty", "Khác"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm({ ...form, label: opt })}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-montserrat transition-colors cursor-pointer ${
                          form.label === opt
                            ? "border-[#1E293B] bg-[#1E293B] text-white"
                            : "border-zinc-200 text-[#475569] hover:border-zinc-400"
                        }`}
                      >
                        {LABEL_ICONS[opt]}
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    [
                      { key: "fullName", label: "Họ tên", placeholder: "Nguyễn Văn A" },
                      { key: "phone", label: "Số điện thoại", placeholder: "0912 345 678" },
                    ] as const
                  ).map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] transition-all font-montserrat text-sm"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                    Địa chỉ cụ thể
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] transition-all font-montserrat text-sm resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-[#1E293B] rounded"
                  />
                  <span className="text-sm font-montserrat text-[#475569]">
                    Đặt làm địa chỉ mặc định
                  </span>
                </label>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 border border-zinc-200 rounded-xl text-sm font-montserrat text-[#475569] hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] text-white rounded-xl text-sm font-montserrat font-medium hover:bg-[#0F172A] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Lưu địa chỉ
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddressTab;
