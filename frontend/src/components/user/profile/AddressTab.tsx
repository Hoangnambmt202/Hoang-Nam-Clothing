"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { userApi } from "@/lib/api/user";
import { checkoutApi } from "@/lib/api/checkout";
import { showToast } from "nextjs-toast-notify";
import {
  MapPin,
  Plus,
  Trash2,
  Loader2,
  Star,
  X,
  ChevronDown,
} from "lucide-react";

type Address = {
  id: string;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault?: boolean;
};

const AddressCard = ({
  addr,
  onDelete,
  onSetDefault,
  isSettingDefault,
}: {
  addr: Address;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isSettingDefault: boolean;
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
        <MapPin size={14} />
      </span>
      <span className="text-sm font-montserrat font-semibold text-[#1E293B]">
        {addr.recipientName}
      </span>
    </div>

    <p className="text-xs font-montserrat text-[#64748B] mt-0.5">{addr.phoneNumber}</p>
    <p className="text-xs font-montserrat text-[#64748B] mt-1 leading-relaxed line-clamp-2">
      {[addr.street, addr.ward, addr.district, addr.province]
        .filter((part) => part && part.trim() !== "")
        .join(", ")}
    </p>

    <div className="absolute bottom-3 right-3 flex items-center gap-1">
      {!addr.isDefault && (
        <button
          onClick={() => onSetDefault(addr.id)}
          disabled={isSettingDefault}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 transition-colors cursor-pointer disabled:opacity-40"
          title="Đặt làm mặc định"
        >
          {isSettingDefault ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} />}
        </button>
      )}
      <button
        onClick={() => onDelete(addr.id)}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        title="Xóa địa chỉ"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </motion.div>
);

const AddressTab = () => {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // New address form state
  const [form, setForm] = useState({
    recipientName: "",
    phoneNumber: "",
    province: "",
    provinceCode: "",
    ward: "",
    wardCode: "",
    street: "",
    isDefault: false,
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await userApi.getAddresses(token);
        const list = Array.isArray(data) ? data : (data?.data || []);
        setAddresses(list);
      } catch {
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    checkoutApi.getProvinces().then(setProvinces).catch(console.error);
  }, []);

  const handleProvinceChange = async (code: string, name: string) => {
    setForm((p) => ({
      ...p,
      province: name,
      provinceCode: code,
      ward: "",
      wardCode: "",
    }));
    setWards([]);
    if (code) {
      try {
        const w = await checkoutApi.getWards(Number(code));
        setWards(w);
      } catch {
        setWards([]);
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipientName || !form.phoneNumber || !form.province || !form.ward || !form.street) {
      showToast.error("Vui lòng điền đầy đủ thông tin giao hàng.", { duration: 2000 });
      return;
    }
    if (!token) return;
    setSaving(true);
    try {
      const payload = {
        recipientName: form.recipientName,
        phoneNumber: form.phoneNumber,
        province: form.province,
        district: "", // 2-level UI
        ward: form.ward,
        street: form.street,
        isDefault: form.isDefault || addresses.length === 0,
      };

      const newAddr = await userApi.addAddress(token, payload);
      
      const updatedList = payload.isDefault || addresses.length === 0
        ? addresses.map((a) => ({ ...a, isDefault: false }))
        : [...addresses];

      setAddresses([...updatedList, newAddr]);
      setShowForm(false);
      setForm({
        recipientName: "",
        phoneNumber: "",
        province: "",
        provinceCode: "",
        ward: "",
        wardCode: "",
        street: "",
        isDefault: false,
      });
      setWards([]);
      showToast.success("Đã thêm địa chỉ thành công!", { duration: 2000 });
    } catch (err: any) {
      showToast.error("Không thể thêm địa chỉ. Vui lòng thử lại.", { duration: 2000 });
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!token) return;
    setSettingDefaultId(id);
    try {
      await userApi.updateAddress(token, id, { isDefault: true });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      showToast.success("Đã đặt địa chỉ mặc định!", { duration: 2000 });
    } catch {
      showToast.error("Không thể cập nhật địa chỉ mặc định.", { duration: 2000 });
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await userApi.deleteAddress(token, id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast.success("Đã xoá địa chỉ.", { duration: 2000 });
    } catch {
      showToast.error("Không thể xoá địa chỉ.", { duration: 2000 });
    }
  };

  const inputCls =
    "w-full px-4 py-3 bg-[#F8FAFC] border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] transition-all font-montserrat text-sm";
  const selectCls = inputCls + " appearance-none cursor-pointer";

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
              <AddressCard 
                key={addr.id} 
                addr={addr} 
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
                isSettingDefault={settingDefaultId === addr.id}
              />
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
              className="fixed bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto lg:absolute lg:top-0 lg:bottom-auto z-50 bg-white rounded-t-3xl lg:rounded-2xl border border-zinc-200 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-lg font-cormorant font-semibold text-[#1E293B]">
                  Thêm địa chỉ mới
                </h4>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <X size={18} className="text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                      Họ và tên người nhận *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.recipientName}
                      onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                      Số điện thoại *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                      placeholder="0901 234 567"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Province */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                    Tỉnh / Thành phố *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.provinceCode}
                      onChange={(e) =>
                        handleProvinceChange(
                          e.target.value,
                          e.target.options[e.target.selectedIndex].text
                        )
                      }
                      className={selectCls}
                    >
                      <option value="">Chọn Tỉnh / Thành phố</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Ward */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                    Quận/Huyện, Phường/Xã *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.wardCode}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          ward: e.target.options[e.target.selectedIndex].text,
                          wardCode: e.target.value,
                        }))
                      }
                      disabled={!wards.length}
                      className={selectCls + " disabled:bg-zinc-100 disabled:text-zinc-400"}
                    >
                      <option value="">
                        {form.provinceCode ? "Chọn Quận/Huyện, Phường/Xã" : "Chọn Tỉnh trước"}
                      </option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-montserrat text-[#64748B] font-medium">
                    Địa chỉ chi tiết (Số nhà, đường) *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    placeholder="Ví dụ: Số 12, Ngõ 34, Đường Trần Phú"
                    className={inputCls}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-[#1E293B] rounded cursor-pointer"
                  />
                  <span className="text-sm font-montserrat text-[#475569]">
                    Đặt làm địa chỉ mặc định
                  </span>
                </label>

                <div className="flex gap-3 justify-end pt-2 border-t border-zinc-100 mt-4">
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
