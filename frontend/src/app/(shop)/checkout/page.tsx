"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { checkoutApi } from "@/lib/api/checkout";
import { shippingApi } from "@/lib/api/shipping";
import { paymentApi } from "@/lib/api/payment";
import {
  setShippingAddress,
  setPaymentMethod,
} from "@/store/features/checkoutSlice";
import { clearCart } from "@/store/features/cartSlice";
import { userApi } from "@/lib/api/user";
import { showToast } from "nextjs-toast-notify";
import {
  Loader2,
  ArrowLeft,
  Check,
  CreditCard,
  Truck,
  Plus,
  MapPin,
  Trash2,
  Star,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────── Types ───────────────────────────────
interface Address {
  id: string;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

interface AddressFormData {
  recipientName: string;
  phoneNumber: string;
  province: string;
  provinceCode: string;
  district: string;
  districtCode: string;
  ward: string;
  wardCode: string;
  street: string;
  isDefault: boolean;
}

const DEFAULT_ADDRESS_FORM: AddressFormData = {
  recipientName: "",
  phoneNumber: "",
  province: "",
  provinceCode: "",
  district: "",
  districtCode: "",
  ward: "",
  wardCode: "",
  street: "",
  isDefault: false,
};

// ──────────────────────────── Sub-components ──────────────────────────────

function AddressCard({
  address,
  selected,
  onSelect,
  onSetDefault,
  onDelete,
  isSettingDefault,
  isDeleting,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
  isSettingDefault: boolean;
  isDeleting: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
        selected
          ? "border-slate-900 bg-slate-50 shadow-sm"
          : "border-slate-200 hover:border-slate-300 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Radio */}
        <div
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            selected ? "border-slate-900 bg-slate-900" : "border-slate-300"
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-slate-900 text-sm">
              {address.recipientName}
            </span>
            {address.isDefault && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Mặc định
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-1">{address.phoneNumber}</p>
          <p className="text-sm text-slate-600 line-clamp-2">
            {[address.street, address.ward, address.district, address.province]
              .filter((part) => part && part.trim() !== "")
              .join(", ")}
          </p>
        </div>

        {/* Actions – stop propagation so clicks don't toggle radio */}
        <div
          className="flex items-center gap-1 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {!address.isDefault && (
            <button
              type="button"
              onClick={onSetDefault}
              disabled={isSettingDefault}
              title="Đặt làm mặc định"
              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors disabled:opacity-40"
            >
              {isSettingDefault ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Star size={14} />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            title="Xóa địa chỉ"
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────── Address Form Component ────────────────────────

function AddressFormPanel({
  formData,
  setFormData,
  provinces,
  wards,
  onProvinceChange,
  onSave,
  onCancel,
  isSaving,
  canCancel,
  title,
}: {
  formData: AddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  provinces: any[];
  wards: any[];
  onProvinceChange: (code: string, name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  canCancel: boolean;
  title: string;
}) {
  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm bg-white";
  const selectCls = inputCls + " appearance-none cursor-pointer";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="border border-slate-200 rounded-2xl p-5 bg-slate-50/60 space-y-4"
    >
      <p className="text-sm font-semibold text-slate-700">{title}</p>

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Họ và tên người nhận *
          </label>
          <input
            type="text"
            required
            placeholder="Nguyễn Văn A"
            value={formData.recipientName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, recipientName: e.target.value }))
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Số điện thoại *
          </label>
          <input
            type="tel"
            required
            placeholder="0901 234 567"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((p) => ({ ...p, phoneNumber: e.target.value }))
            }
            className={inputCls}
          />
        </div>
      </div>

      {/* Province */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          Tỉnh / Thành phố *
        </label>
        <div className="relative">
          <select
            required
            value={formData.provinceCode}
            onChange={(e) =>
              onProvinceChange(
                e.target.value,
                e.target.options[e.target.selectedIndex].text,
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
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Ward */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          Quận/Huyện, Phường/Xã *
        </label>
        <div className="relative">
          <select
            required
            value={formData.wardCode}
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                ward: e.target.options[e.target.selectedIndex].text,
                wardCode: e.target.value,
              }))
            }
            disabled={!wards.length}
            className={
              selectCls + " disabled:bg-slate-100 disabled:text-slate-400"
            }
          >
            <option value="">
              {formData.provinceCode
                ? "Chọn Quận/Huyện, Phường/Xã"
                : "Chọn Tỉnh trước"}
            </option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Street */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          Địa chỉ chi tiết (Số nhà, Tên đường) *
        </label>
        <input
          type="text"
          required
          placeholder="Ví dụ: Số 12, Ngõ 34, Đường Trần Phú"
          value={formData.street}
          onChange={(e) =>
            setFormData((p) => ({ ...p, street: e.target.value }))
          }
          className={inputCls}
        />
      </div>

      {/* Default checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <div
          onClick={() =>
            setFormData((p) => ({ ...p, isDefault: !p.isDefault }))
          }
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            formData.isDefault
              ? "bg-slate-900 border-slate-900"
              : "border-slate-300 group-hover:border-slate-400"
          }`}
        >
          {formData.isDefault && <Check size={12} className="text-white" />}
        </div>
        <span className="text-sm text-slate-600">Đặt làm địa chỉ mặc định</span>
      </label>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          Lưu địa chỉ
        </button>
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <X size={14} />
            Huỷ
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────── Main Page ────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  // Sắp xếp ổn định (stable sorting) theo createdAt để đồng bộ với trang giỏ hàng
  const sortedCartItems = [...cartItems].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    
    if (dateA !== dateB) return dateA - dateB;
    
    const keyA = a.cartItemId || `${a.id}-${a.variantId}`;
    const keyB = b.cartItemId || `${b.id}-${b.variantId}`;
    return keyA.localeCompare(keyB);
  });
  const auth = useSelector((state: RootState) => state.auth);
  const checkoutState = useSelector((state: RootState) => state.checkout);

  // ── Location data ──
  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // ── Methods ──
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);

  // ── Address State ──
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] =
    useState<AddressFormData>(DEFAULT_ADDRESS_FORM);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Guest form ──
  const [guestForm, setGuestForm] = useState({
    firstName: auth.user?.firstName || "",
    lastName: auth.user?.lastName || "",
    phone: auth.user?.phone || "",
    email: auth.user?.email || "",
    province: "",
    provinceCode: "",
    district: "",
    districtCode: "",
    ward: "",
    wardCode: "",
    street: "",
  });
  const [guestWards, setGuestWards] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // ── Redirect if cart empty ──
  useEffect(() => {
    if (cartItems.length === 0) router.push("/cart");
  }, [cartItems, router]);

  // ── Fetch provinces + methods ──
  useEffect(() => {
    checkoutApi.getProvinces().then(setProvinces).catch(console.error);

    shippingApi
      .getAll(true)
      .then((data) => {
        setShippingMethods(data);
        if (data?.length > 0) setSelectedShipping(data[0]);
      })
      .catch(console.error);

    paymentApi
      .getAll(true)
      .then((data) => {
        setPaymentMethods(data);
        if (data?.length > 0 && !checkoutState.paymentMethod) {
          dispatch(setPaymentMethod(data[0].provider));
        }
      })
      .catch(console.error);
  }, [checkoutState.paymentMethod, dispatch]);

  // ── Fetch saved addresses ──
  const fetchAddresses = useCallback(async () => {
    if (!auth.accessToken) return;
    setAddressesLoading(true);
    try {
      const data = await userApi.getAddresses(auth.accessToken);
      const list: Address[] = Array.isArray(data) ? data : data?.data || [];
      setAddresses(list);
      if (list.length > 0) {
        const def = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(def.id);
        setShowAddressForm(false);
      } else {
        // First-time buyer: show form
        setShowAddressForm(true);
      }
    } catch (e) {
      console.error(e);
      setShowAddressForm(true);
    } finally {
      setAddressesLoading(false);
    }
  }, [auth.accessToken]);

  useEffect(() => {
    if (auth.accessToken) {
      fetchAddresses();
    } else {
      setShowAddressForm(true);
    }
  }, [auth.accessToken, fetchAddresses]);

  // ── Province / Ward handlers (for new address form) ──
  const handleProvinceChange = async (code: string, name: string) => {
    setAddressForm((p) => ({
      ...p,
      province: name,
      provinceCode: code,
      district: "",
      districtCode: "",
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

  // ── Guest Province / Ward handlers ──
  const handleGuestProvinceChange = async (code: string, name: string) => {
    setGuestForm((p) => ({
      ...p,
      province: name,
      provinceCode: code,
      district: "",
      districtCode: "",
      ward: "",
      wardCode: "",
    }));
    setGuestWards([]);
    if (code) {
      try {
        const w = await checkoutApi.getWards(Number(code));
        setGuestWards(w);
      } catch {
        setGuestWards([]);
      }
    }
  };

  // ── Save new address ──
  const handleSaveAddress = async () => {
    if (
      !addressForm.recipientName ||
      !addressForm.phoneNumber ||
      !addressForm.province ||
      !addressForm.ward ||
      !addressForm.street
    ) {
      showToast.error("Vui lòng điền đầy đủ thông tin địa chỉ!");
      return;
    }
    if (!auth.accessToken) return;

    setIsSavingAddress(true);
    try {
      const saved = await userApi.addAddress(auth.accessToken, {
        recipientName: addressForm.recipientName,
        phoneNumber: addressForm.phoneNumber,
        province: addressForm.province,
        district: "", // Keep empty since UI only uses 2 levels
        ward: addressForm.ward,
        street: addressForm.street,
        isDefault: addressForm.isDefault || addresses.length === 0,
      });

      // If marked as default, update existing list
      const updatedList =
        addressForm.isDefault || addresses.length === 0
          ? addresses.map((a) => ({ ...a, isDefault: false }))
          : [...addresses];

      setAddresses([...updatedList, saved]);
      setSelectedAddressId(saved.id);
      setShowAddressForm(false);
      setAddressForm(DEFAULT_ADDRESS_FORM);
      setWards([]);
      showToast.success("Đã lưu địa chỉ thành công!");
    } catch (e: any) {
      showToast.error("Không thể lưu địa chỉ. Vui lòng thử lại!");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // ── Set default address ──
  const handleSetDefault = async (address: Address) => {
    if (!auth.accessToken) return;
    setSettingDefaultId(address.id);
    try {
      await userApi.updateAddress(auth.accessToken, address.id, {
        isDefault: true,
      });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === address.id })),
      );
      showToast.success("Đã đặt địa chỉ mặc định!");
    } catch {
      showToast.error("Không thể cập nhật địa chỉ mặc định!");
    } finally {
      setSettingDefaultId(null);
    }
  };

  // ── Delete address ──
  const handleDeleteAddress = async (address: Address) => {
    if (!auth.accessToken) return;
    if (!confirm(`Xóa địa chỉ của "${address.recipientName}"?`)) return;
    setDeletingId(address.id);
    try {
      await userApi.deleteAddress(auth.accessToken, address.id);
      const remaining = addresses.filter((a) => a.id !== address.id);
      setAddresses(remaining);
      if (selectedAddressId === address.id) {
        setSelectedAddressId(remaining[0]?.id || null);
      }
      if (remaining.length === 0) setShowAddressForm(true);
      showToast.success("Đã xóa địa chỉ!");
    } catch {
      showToast.error("Không thể xóa địa chỉ. Vui lòng thử lại!");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Cart calculations ──
  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const shippingFee = selectedShipping ? Number(selectedShipping.baseCost) : 0;
  const totalAmount = subtotal + shippingFee;

  // ── Submit order ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate address
    if (auth.accessToken) {
      if (addresses.length === 0 || showAddressForm) {
        showToast.error("Vui lòng lưu địa chỉ giao hàng trước khi đặt hàng!");
        return;
      }
      if (!selectedAddressId) {
        showToast.error("Vui lòng chọn địa chỉ giao hàng!");
        return;
      }
    } else {
      if (
        !guestForm.firstName ||
        !guestForm.phone ||
        !guestForm.province ||
        !guestForm.ward ||
        !guestForm.street
      ) {
        showToast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
      }
    }

    if (!selectedShipping?.id) {
      showToast.error("Vui lòng chọn phương thức vận chuyển!");
      return;
    }
    if (!checkoutState.paymentMethod) {
      showToast.error("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    setLoading(true);
    try {
      let shippingAddress: any;
      if (auth.accessToken) {
        const addr = addresses.find((a) => a.id === selectedAddressId);
        shippingAddress = {
          recipientName: addr?.recipientName || "",
          phone: addr?.phoneNumber || "",
          addressLine: addr?.street || "",
          ward: addr?.ward || "",
          district: "", // Keep empty since UI only uses 2 levels
          province: addr?.province || "",
        };
      } else {
        shippingAddress = {
          recipientName: `${guestForm.lastName} ${guestForm.firstName}`.trim(),
          phone: guestForm.phone,
          addressLine: guestForm.street,
          ward: guestForm.ward,
          district: "", // Keep empty since UI only uses 2 levels
          province: guestForm.province,
        };
      }

      const payload = {
        items: cartItems.map((item) => ({
          productId: item.variantId || item.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        guestInfo: !auth.accessToken
          ? {
              firstName: guestForm.firstName,
              lastName: guestForm.lastName,
              phone: guestForm.phone,
              email: guestForm.email,
            }
          : undefined,
        shippingMethodId: selectedShipping.id,
        paymentMethod: checkoutState.paymentMethod,
      };

      const res = await checkoutApi.checkout(
        payload,
        auth.accessToken || undefined,
      );

      if (res?.id) {
        dispatch(clearCart());
        router.push(`/checkout/success/${res.id}`);
      } else {
        throw new Error("Checkout failed");
      }
    } catch (error: any) {
      const errMsg = error?.message || "";
      if (errMsg.includes("shippingMethodId")) {
        showToast.error(
          "Phương thức vận chuyển không hợp lệ. Vui lòng tải lại trang!",
        );
      } else {
        showToast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all text-sm bg-white";
  const selectCls = inputCls + " appearance-none cursor-pointer";

  // ─────────────────────────── Render ───────────────────────────────
  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Quay lại Giỏ hàng
          </Link>
          <h1 className="text-3xl font-cormorant font-bold text-slate-900 mt-4">
            Thanh toán
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* ─── Left Column ─── */}
          <div className="lg:col-span-7 space-y-6">
            {/* ── Shipping Address Block ── */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold font-montserrat">
                  Địa chỉ giao hàng
                </h2>
              </div>

              {/* ── Guest notice ── */}
              {!auth.accessToken && (
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl mb-6 text-sm">
                  <span className="text-lg mt-0.5">ℹ️</span>
                  <span>
                    Bạn đang đặt hàng với tư cách khách.{" "}
                    <Link href="/auth/login" className="font-bold underline">
                      Đăng nhập
                    </Link>{" "}
                    để lưu địa chỉ và theo dõi đơn hàng dễ dàng hơn.
                  </span>
                </div>
              )}

              {/* ── Loading addresses ── */}
              {auth.accessToken && addressesLoading && (
                <div className="flex items-center gap-3 py-6 text-slate-500">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Đang tải địa chỉ đã lưu...</span>
                </div>
              )}

              {/* ── Logged-in: Address list ── */}
              {auth.accessToken && !addressesLoading && (
                <>
                  {/* Saved addresses */}
                  {addresses.length > 0 && !showAddressForm && (
                    <div className="space-y-3 mb-4">
                      <AnimatePresence>
                        {addresses.map((addr) => (
                          <AddressCard
                            key={addr.id}
                            address={addr}
                            selected={selectedAddressId === addr.id}
                            onSelect={() => setSelectedAddressId(addr.id)}
                            onSetDefault={() => handleSetDefault(addr)}
                            onDelete={() => handleDeleteAddress(addr)}
                            isSettingDefault={settingDefaultId === addr.id}
                            isDeleting={deletingId === addr.id}
                          />
                        ))}
                      </AnimatePresence>

                      {/* Add new address button */}
                      <button
                        type="button"
                        onClick={() => {
                          setAddressForm(DEFAULT_ADDRESS_FORM);
                          setWards([]);
                          setShowAddressForm(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <Plus size={16} />
                        Thêm địa chỉ mới
                      </button>
                    </div>
                  )}

                  {/* New address form (logged-in) */}
                  <AnimatePresence>
                    {showAddressForm && (
                      <AddressFormPanel
                        formData={addressForm}
                        setFormData={setAddressForm}
                        provinces={provinces}
                        wards={wards}
                        onProvinceChange={handleProvinceChange}
                        onSave={handleSaveAddress}
                        onCancel={() => {
                          setShowAddressForm(false);
                          setAddressForm(DEFAULT_ADDRESS_FORM);
                          setWards([]);
                        }}
                        isSaving={isSavingAddress}
                        canCancel={addresses.length > 0}
                        title={
                          addresses.length === 0
                            ? "Nhập địa chỉ giao hàng"
                            : "Thêm địa chỉ mới"
                        }
                      />
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* ── Guest: full form ── */}
              {!auth.accessToken && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Họ *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Nguyễn"
                        value={guestForm.lastName}
                        onChange={(e) =>
                          setGuestForm((p) => ({
                            ...p,
                            lastName: e.target.value,
                          }))
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Tên *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Văn A"
                        value={guestForm.firstName}
                        onChange={(e) =>
                          setGuestForm((p) => ({
                            ...p,
                            firstName: e.target.value,
                          }))
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Số điện thoại *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="0901 234 567"
                        value={guestForm.phone}
                        onChange={(e) =>
                          setGuestForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={guestForm.email}
                        onChange={(e) =>
                          setGuestForm((p) => ({ ...p, email: e.target.value }))
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Tỉnh / Thành phố *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={guestForm.provinceCode}
                        onChange={(e) =>
                          handleGuestProvinceChange(
                            e.target.value,
                            e.target.options[e.target.selectedIndex].text,
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
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Ward */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Quận/Huyện, Phường/Xã *
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={guestForm.wardCode}
                        onChange={(e) =>
                          setGuestForm((p) => ({
                            ...p,
                            ward: e.target.options[e.target.selectedIndex].text,
                            wardCode: e.target.value,
                          }))
                        }
                        disabled={!guestWards.length}
                        className={
                          selectCls +
                          " disabled:bg-slate-100 disabled:text-slate-400"
                        }
                      >
                        <option value="">
                          {guestForm.provinceCode
                            ? "Chọn Quận/Huyện, Phường/Xã"
                            : "Chọn Tỉnh trước"}
                        </option>
                        {guestWards.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Địa chỉ chi tiết *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Số 12, Ngõ 34, Đường Trần Phú"
                      value={guestForm.street}
                      onChange={(e) =>
                        setGuestForm((p) => ({ ...p, street: e.target.value }))
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Shipping Methods ── */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold font-montserrat">
                  Phương thức vận chuyển
                </h2>
              </div>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedShipping?.id === method.id
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={selectedShipping?.id === method.id}
                      onChange={() => setSelectedShipping(method)}
                      className="w-5 h-5 text-black focus:ring-black"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {method.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      {Number(method.baseCost) === 0
                        ? "Miễn phí"
                        : `${Number(method.baseCost).toLocaleString("vi-VN")}đ`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Payment Methods ── */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCard size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-bold font-montserrat">
                  Phương thức thanh toán
                </h2>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      checkoutState.paymentMethod === method.provider
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={checkoutState.paymentMethod === method.provider}
                      onChange={() =>
                        dispatch(setPaymentMethod(method.provider))
                      }
                      className="w-5 h-5 text-black focus:ring-black"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {method.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {method.description ||
                          `Thanh toán qua ${method.provider}`}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right Column: Order Summary ─── */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-32">
              <h2 className="text-xl font-bold font-montserrat mb-6">
                Tóm tắt đơn hàng ({totalItems} sản phẩm)
              </h2>

              <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1 pt-2">
                {sortedCartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.variantId}-${index}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="w-full h-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white w-5 h-5 flex justify-center items-center rounded-full text-[10px] font-bold shadow-md border-2 border-white z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2 text-slate-900">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.color} {item.size && `| ${item.size}`}
                      </p>
                      <p className="font-semibold text-sm mt-0.5">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-slate-900">
                    {subtotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-slate-900">
                    {shippingFee === 0
                      ? "Miễn phí"
                      : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mb-8">
                <span className="font-bold text-lg">Tổng cộng</span>
                <span className="text-2xl font-bold font-montserrat text-slate-900">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold font-montserrat hover:bg-slate-700 transition-colors flex justify-center items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Check size={20} />
                )}
                ĐẶT HÀNG
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">
                Bằng cách đặt hàng, bạn đồng ý với Điều khoản và Chính sách của
                chúng tôi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
