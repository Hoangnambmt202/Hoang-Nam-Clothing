"use client";

import { useState, useEffect } from "react";
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
import { Loader2, ArrowLeft, Check, CreditCard, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const auth = useSelector((state: RootState) => state.auth);
  const checkoutState = useSelector((state: RootState) => state.checkout);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // API Data
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: auth.user?.firstName || "",
    lastName: auth.user?.lastName || "",
    phone: auth.user?.phone || "",
    email: auth.user?.email || "",
    province: "",
    provinceCode: "", // Lưu thêm mã tỉnh để khôi phục danh sách xã khi reload
    district: "",
    ward: "",
    detail: "",
  });

  const [loading, setLoading] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Fetch addresses for logged in user
  useEffect(() => {
    if (auth.accessToken) {
      userApi.getAddresses(auth.accessToken).then(data => {
        setAddresses(data || []);
        if (data && data.length > 0) {
          const defaultAddr = data.find((a: any) => a.isDefault) || data[0];
          setSelectedAddressId(defaultAddr.id);
          setShowAddressForm(false);
        } else {
          setShowAddressForm(true);
        }
      }).catch(console.error);
    } else {
      setShowAddressForm(true);
    }
  }, [auth.accessToken]);

  // 1. Khôi phục thông tin form từ localStorage khi mount
  useEffect(() => {
    const savedForm = localStorage.getItem("checkout_form");
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          firstName: parsed.firstName || auth.user?.firstName || "",
          lastName: parsed.lastName || auth.user?.lastName || "",
          phone: parsed.phone || auth.user?.phone || "",
          email: parsed.email || auth.user?.email || "",
        }));

        // Khôi phục Phường/Xã
        if (parsed.provinceCode) {
          checkoutApi.getWards(Number(parsed.provinceCode))
            .then(setWards)
            .catch(console.error);
        }
      } catch (e) {
        console.error("Error parsing saved checkout form", e);
      }
    }
  }, [auth.user]);

  // 2. Tự động lưu thông tin form vào localStorage khi thay đổi
  useEffect(() => {
    if (formData.firstName || formData.lastName || formData.phone || formData.detail || formData.province || formData.ward) {
      localStorage.setItem("checkout_form", JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  useEffect(() => {
    // Fetch provinces
    checkoutApi.getProvinces().then(setProvinces).catch(console.error);

    // Fetch shipping and payment methods
    shippingApi.getAll(true).then((data) => {
      setShippingMethods(data);
      if (data && data.length > 0) setSelectedShipping(data[0]);
    }).catch(console.error);

    paymentApi.getAll(true).then((data) => {
      setPaymentMethods(data);
      if (data && data.length > 0 && !checkoutState.paymentMethod) {
        dispatch(setPaymentMethod(data[0].provider));
      }
    }).catch(console.error);
  }, []);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, province: name, provinceCode: code, district: "", ward: "" });
    setWards([]);
    if (code) {
      try {
        const ws = await checkoutApi.getWards(Number(code));
        setWards(ws);
      } catch (err) {
        console.error(err);
        setWards([]);
      }
    } else {
      setWards([]);
    }
  };

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const subtotal = calculateSubtotal();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = selectedShipping ? Number(selectedShipping.baseCost) : 0;
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.accessToken || showAddressForm) {
      if (!formData.firstName || !formData.phone || !formData.detail || !formData.province) {
        showToast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
      }
    } else {
      if (!selectedAddressId) {
        showToast.error("Vui lòng chọn địa chỉ giao hàng!");
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
      // If user is logged in and creating a new address, save it first
      let currentSelectedAddrId = selectedAddressId;
      if (auth.accessToken && showAddressForm) {
        try {
          const newAddr = await userApi.addAddress(auth.accessToken, {
            recipientName: `${formData.lastName} ${formData.firstName}`.trim(),
            phoneNumber: formData.phone,
            province: formData.province,
            district: formData.province, // simple mapping 
            ward: formData.ward,
            street: formData.detail,
            isDefault: true
          });
          setAddresses([...addresses, newAddr]);
          currentSelectedAddrId = newAddr.id;
          setSelectedAddressId(newAddr.id);
          setShowAddressForm(false);
        } catch (err) {
          console.error("Lỗi lưu địa chỉ", err);
        }
      }

      // Construct Shipping Info
      let finalShippingInfo: any = {};
      if (!auth.accessToken || showAddressForm) {
        finalShippingInfo = {
          recipientName: `${formData.lastName} ${formData.firstName}`.trim(),
          phone: formData.phone,
          addressLine: formData.detail,
          ward: formData.ward,
          district: formData.province,
          province: formData.province,
        };
      } else {
        const addr = addresses.find(a => a.id === currentSelectedAddrId);
        finalShippingInfo = {
          recipientName: addr?.recipientName || "Khách",
          phone: addr?.phoneNumber || "",
          addressLine: addr?.street || "",
          ward: addr?.ward || "",
          district: addr?.district || "",
          province: addr?.province || "",
        };
      }
      const payload = {
        items: cartItems.map(item => ({
          productId: item.variantId || item.id, // Variant ID
          quantity: item.quantity,
        })),
        shippingAddress: finalShippingInfo,
        guestInfo: !auth.accessToken ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
        } : undefined,
        shippingMethodId: selectedShipping.id,
        paymentMethod: checkoutState.paymentMethod,
      };

      const res = await checkoutApi.checkout(payload, auth.accessToken || undefined);

      if (res?.id) {
        localStorage.removeItem("checkout_form");
        dispatch(clearCart());
        router.push(`/checkout/success/${res.id}`);
      } else {
        throw new Error("Checkout failed");
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.message || "";
      if (errMsg.includes("shippingMethodId")) {
        showToast.error("Phương thức vận chuyển không hợp lệ. Vui lòng tải lại trang!");
      } else {
        showToast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            Quay lại Giỏ hàng
          </Link>
          <h1 className="text-3xl font-cormorant font-bold text-slate-900 mt-4">
            Thanh toán
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Thông tin giao hàng */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold font-montserrat mb-6">Thông tin nhận hàng</h2>
              
              {!auth.accessToken && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 text-sm">
                  Bạn đang đặt hàng với tư cách khách.{" "}
                  <Link href="/auth/login" className="font-bold underline">
                    Đăng nhập
                  </Link>{" "}
                  để lưu địa chỉ và theo dõi đơn hàng dễ dàng hơn.
                </div>
              )}

              {auth.accessToken && addresses.length > 0 && (
                <div className="mb-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">Sổ địa chỉ của bạn</h3>
                    {!showAddressForm && (
                      <button type="button" onClick={() => setShowAddressForm(true)} className="text-sm text-blue-600 hover:underline">
                        + Thêm địa chỉ mới
                      </button>
                    )}
                  </div>
                  {!showAddressForm && (
                    <div className="space-y-3">
                      {addresses.map(addr => (
                        <label key={addr.id} className={`block p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                          <div className="flex gap-3 items-start">
                            <input 
                              type="radio" 
                              name="savedAddress" 
                              checked={selectedAddressId === addr.id}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1 w-4 h-4 text-black focus:ring-black"
                            />
                            <div className="flex-1 text-sm">
                              <div className="font-bold text-slate-800">
                                {addr.recipientName} {addr.isDefault && <span className="ml-2 text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Mặc định</span>}
                              </div>
                              <div className="text-slate-600 mt-1">{addr.phoneNumber}</div>
                              <div className="text-slate-600 mt-1">{addr.street}, {addr.ward}, {addr.district}, {addr.province}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  {showAddressForm && (
                    <button type="button" onClick={() => setShowAddressForm(false)} className="text-sm text-slate-500 hover:text-black">
                      Huỷ thêm địa chỉ (Dùng địa chỉ đã lưu)
                    </button>
                  )}
                </div>
              )}

              {showAddressForm && (
                <div className="space-y-4">
                  {/* New Address Form Fields */}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Họ *</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên *</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tỉnh/Thành phố *</label>
                  <select
                    required
                    value={formData.provinceCode}
                    onChange={handleProvinceChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                  >
                    <option value="">Chọn Tỉnh/Thành</option>
                    {(provinces || []).map((p) => (
                      <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phường/Xã *</label>
                  <select
                    required
                    value={(wards || []).find((w) => w.name === formData.ward)?.code || ""}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.options[e.target.selectedIndex].text })}
                    disabled={!(wards || []).length}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white disabled:bg-slate-50"
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {(wards || []).map((w) => (
                      <option key={w.code} value={w.code}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ chi tiết (Số nhà, đường) *</label>
                <input
                  required
                  type="text"
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  placeholder="Ví dụ: Số 12, Ngõ 34, Đường Trần Phú"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>
              </div>
              )}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
              <h2 className="text-xl font-bold font-montserrat mb-6">Phương thức vận chuyển</h2>
              <div className="space-y-4">
                {shippingMethods.map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedShipping?.id === method.id ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={selectedShipping?.id === method.id}
                      onChange={() => setSelectedShipping(method)}
                      className="w-5 h-5 text-black focus:ring-black"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <Truck className="text-slate-600" />
                      <div>
                        <h3 className="font-semibold text-slate-900">{method.name}</h3>
                        <p className="text-sm text-slate-500">{method.description}</p>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900">
                      {Number(method.baseCost) === 0 ? "Miễn phí" : `${Number(method.baseCost).toLocaleString("vi-VN")}đ`}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold font-montserrat mb-6">Phương thức thanh toán</h2>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${checkoutState.paymentMethod === method.provider ? 'border-black bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={checkoutState.paymentMethod === method.provider}
                      onChange={() => dispatch(setPaymentMethod(method.provider))}
                      className="w-5 h-5 text-black focus:ring-black"
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-slate-600" />
                      <div>
                        <h3 className="font-semibold text-slate-900">{method.name}</h3>
                        <p className="text-sm text-slate-500">{method.description || `Thanh toán qua ${method.provider}`}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 sticky top-32">
              <h2 className="text-xl font-bold font-montserrat mb-6">
                Tóm tắt đơn hàng ({totalItems} sản phẩm)
              </h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.variantId}-${index}`} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                      <div className="absolute -top-2 -right-2 bg-slate-800 text-white w-5 h-5 flex justify-center items-center rounded-full text-xs font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.color} {item.size && `| ${item.size}`}
                      </p>
                      <p className="font-semibold text-sm mt-1">{item.price.toLocaleString("vi-VN")}đ</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-slate-900">{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-slate-900">{shippingFee.toLocaleString("vi-VN")}đ</span>
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
                className="w-full bg-black text-white py-4 rounded-xl font-bold font-montserrat hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                ĐẶT HÀNG
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">
                Bằng cách đặt hàng, bạn đồng ý với Điều khoản và chính sách của chúng tôi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
