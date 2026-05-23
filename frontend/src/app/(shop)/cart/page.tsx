"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  removeItem,
  updateQuantity,
  updateItemVariant,
  updateCartItemDb,
  removeCartItemDb,
  CartItem
} from "@/store/features/cartSlice";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Gift,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productApi } from "@/lib/api/product";

// Giao diện quà tặng tĩnh
const GIFTS = [
  {
    id: "g1",
    name: "Túi Tote Canvas Hoang-Nam",
    price: 150000,
    image:
      "https://images.unsplash.com/photo-1597484661643-2f5fef640df1?q=80&w=200",
    note: "Dành cho hóa đơn từ 500k",
  },
  {
    id: "g2",
    name: "Mũ Lưỡi Trai Thể Thao",
    price: 200000,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=200",
    note: "Dành cho hóa đơn từ 1 triệu",
  },
];

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  // Lưu trữ chi tiết sản phẩm để lấy thông tin các biến thể (variants)
  const [productDetails, setProductDetails] = useState<Record<string, any>>({});
  const [loadingProducts, setLoadingProducts] = useState<
    Record<string, boolean>
  >({});

  // State UI
  const [couponCode, setCouponCode] = useState("");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);

  // Lấy chi tiết sản phẩm nếu chưa có
  useEffect(() => {
    const fetchMissingProducts = async () => {
      const missingIds = cartItems
        .map((item) => item.id)
        .filter((id) => !productDetails[id] && !loadingProducts[id]);

      if (missingIds.length === 0) return;

      const newLoadingState = { ...loadingProducts };
      missingIds.forEach((id) => (newLoadingState[id] = true));
      setLoadingProducts(newLoadingState);

      for (const id of missingIds) {
        try {
          const data = await productApi.getProductById(id);
          setProductDetails((prev) => ({ ...prev, [id]: data }));
        } catch (error) {
          console.error(`Failed to fetch product ${id}`, error);
        }
      }
    };

    fetchMissingProducts();
  }, [cartItems, productDetails, loadingProducts]);

  const calculateTotalItems = () =>
    cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const subtotal = calculateSubtotal();
  const shippingFee = 0; // Miễn phí
  const vat = 0; // Tạm thời 0
  const totalOrder = subtotal + shippingFee + vat;

  // Handlers
  const handleQuantityInput = (
    item: CartItem,
    value: string,
  ) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue > 0) {
      if (accessToken && item.cartItemId) {
        dispatch(updateCartItemDb({ cartItemId: item.cartItemId, quantity: numericValue, token: accessToken }) as any);
      } else {
        dispatch(updateQuantity({ id: item.id, variantId: item.variantId, quantity: numericValue }));
      }
    }
  };

  const handleQuantityChange = (
    item: CartItem,
    type: "increase" | "decrease",
  ) => {
    const newQty =
      type === "increase" ? item.quantity + 1 : item.quantity - 1;
    if (newQty > 0) {
      if (accessToken && item.cartItemId) {
        dispatch(updateCartItemDb({ cartItemId: item.cartItemId, quantity: newQty, token: accessToken }) as any);
      } else {
        dispatch(updateQuantity({ id: item.id, variantId: item.variantId, quantity: newQty }));
      }
    }
  };

  const handleRemove = (item: CartItem) => {
    if (accessToken && item.cartItemId) {
      dispatch(removeCartItemDb({ cartItemId: item.cartItemId, token: accessToken }) as any);
    } else {
      dispatch(removeItem({ id: item.id, variantId: item.variantId }));
    }
  };

  // Thay đổi màu hoặc size
  const handleVariantChange = (
    item: CartItem,
    productData: any,
    newColor: string | null,
    newSize: string | null,
  ) => {
    if (!productData?.variants) return;

    const targetColor = newColor !== null ? newColor : item.color;
    const targetSize = newSize !== null ? newSize : item.size;

    // Tìm variant phù hợp
    const matchedVariant = productData.variants.find(
      (v: any) => v.color === targetColor && v.size === targetSize,
    );

    if (matchedVariant) {
      if (accessToken && item.cartItemId) {
        dispatch(updateCartItemDb({ 
          cartItemId: item.cartItemId, 
          newVariantId: matchedVariant.id, 
          token: accessToken 
        }) as any);
      } else {
        dispatch(
          updateItemVariant({
            id: item.id,
            oldVariantId: item.variantId,
            newVariantId: matchedVariant.id,
            size: targetSize || "",
            color: targetColor || "",
            price: Number(matchedVariant.price),
          }),
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-cormorant font-bold text-[#1E293B] mb-8">
          Giỏ Hàng Của Bạn ({calculateTotalItems()})
        </h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-16 text-center border border-zinc-100 shadow-sm flex flex-col items-center gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
              <ShoppingBag size={40} />
            </div>
            <div>
              <h2 className="font-montserrat text-2xl font-medium text-[#1E293B] mb-3">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="font-montserrat text-slate-500 max-w-md mx-auto">
                Hãy khám phá các bộ sưu tập mới nhất của chúng tôi và chọn cho
                mình những sản phẩm ưng ý nhất!
              </p>
            </div>
            <Link href="/new-arrivals">
              <button className="px-8 py-3.5 mt-4 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors font-montserrat font-medium flex items-center gap-2 group">
                Tiếp tục mua sắm
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cột Trái: Danh sách sản phẩm */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any, idx: number) => {
                const productData = productDetails[item.id];

                // Lấy các tùy chọn màu và size từ variants
                const availableColors = productData?.variants
                  ? Array.from(
                      new Set(productData.variants.map((v: any) => v.color)),
                    )
                  : [];

                const availableSizes = productData?.variants
                  ? Array.from(
                      new Set(
                        productData.variants
                          .filter((v: any) => v.color === item.color) // Lọc size theo màu hiện tại
                          .map((v: any) => v.size),
                      ),
                    )
                  : [];

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={`${item.id}-${item.variantId || idx}`}
                    className="bg-white border border-zinc-100 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-6 relative hover:shadow-md transition-shadow group"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.id}`}
                      className="block flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-24 h-32 rounded-xl border border-slate-100 group-hover:opacity-90 transition-opacity"
                      />
                    </Link>

                    {/* Chi tiết item */}
                    <div className="flex-1 flex flex-col min-w-0 py-1">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <Link
                          href={`/products/${item.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          <h3 className="font-montserrat font-semibold text-base text-[#1E293B] line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() =>
                            handleRemove(item)
                          }
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Phân loại biến thể */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {/* Cột Màu Sắc */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-semibold text-slate-400">
                            Màu sắc
                          </label>
                          <select
                            value={item.color || ""}
                            onChange={(e) =>
                              handleVariantChange(
                                item,
                                productData,
                                e.target.value,
                                null,
                              )
                            }
                            disabled={
                              !productData || availableColors.length === 0
                            }
                            className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer disabled:opacity-50"
                          >
                            {productData ? (
                              availableColors.map((c: any) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))
                            ) : (
                              <option value={item.color}>{item.color}</option>
                            )}
                          </select>
                        </div>

                        {/* Cột Kích cỡ */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-semibold text-slate-400">
                            Kích cỡ
                          </label>
                          <select
                            value={item.size || ""}
                            onChange={(e) =>
                              handleVariantChange(
                                item,
                                productData,
                                null,
                                e.target.value,
                              )
                            }
                            disabled={
                              !productData || availableSizes.length === 0
                            }
                            className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer disabled:opacity-50"
                          >
                            {productData ? (
                              availableSizes.map((s: any) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))
                            ) : (
                              <option value={item.size}>{item.size}</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                        {/* Đơn giá & Số lượng */}
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                              Đơn giá
                            </span>
                            <span className="font-montserrat font-semibold text-[#1E293B]">
                              {Number(item.price).toLocaleString("vi-VN")}đ
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                              Số lượng
                            </span>
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden w-max">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    "decrease"
                                  )
                                }
                                className="p-1.5 px-2 hover:bg-slate-50 text-slate-500 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                className="w-10 text-center bg-transparent border-none outline-none font-montserrat text-sm font-medium text-[#1E293B]"
                                value={item.quantity}
                                type="number"
                                onChange={(e) =>
                                  handleQuantityInput(
                                    item,
                                    e.target.value,
                                  )
                                }
                              />
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    "increase"
                                  )
                                }
                                className="p-1.5 px-2 hover:bg-slate-50 text-slate-500 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Tổng tiền của Item */}
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                            Thành tiền
                          </span>
                          <span className="font-montserrat font-bold text-blue-600">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN",
                            )}
                            đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Cột Phải: Tóm tắt Đơn hàng & Tính năng */}
            <div className="space-y-6">
              {/* Box 1: Order Summary */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-montserrat font-bold text-lg text-[#1E293B] mb-6 flex items-center gap-2">
                  <span>Thông tin đơn hàng</span>
                </h2>

                <div className="space-y-4 font-montserrat text-sm text-[#475569]">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tổng số sản phẩm:</span>
                    <span className="font-semibold text-slate-800">
                      {calculateTotalItems()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tạm tính:</span>
                    <span className="font-semibold text-slate-800">
                      {subtotal.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Phí vận chuyển:</span>
                    <span className="font-semibold text-emerald-600">
                      Miễn phí
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">VAT (0%):</span>
                    <span className="font-semibold text-slate-800">{vat}đ</span>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-base font-bold text-[#1E293B]">
                    <span>Tổng đơn đặt hàng:</span>
                    <span className="text-xl text-blue-600">
                      {totalOrder.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <Link href="/checkout" className="block mt-6">
                  <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-montserrat font-semibold shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Tiến hành Thanh Toán
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>

              {/* Box 2: Khuyến mãi / Mã giảm giá */}
              <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-montserrat font-bold text-base text-[#1E293B] mb-4 flex items-center gap-2">
                  <Tag size={18} className="text-blue-500" />
                  Mã giảm giá
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã ưu đãi..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-medium uppercase placeholder:normal-case"
                  />
                  <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors">
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Box 3: Quà tặng */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Gift size={80} />
                </div>
                <h3 className="font-montserrat font-bold text-base text-amber-900 mb-2 relative z-10 flex items-center gap-2">
                  <Gift size={18} className="text-amber-600" />
                  Quà tặng đặc biệt
                </h3>
                <p className="text-sm text-amber-800/80 mb-4 relative z-10">
                  {selectedGiftId
                    ? `Đã chọn: ${GIFTS.find((g) => g.id === selectedGiftId)?.name}`
                    : "Bạn có quà tặng đang chờ được chọn!"}
                </p>
                <button
                  onClick={() => setShowGiftModal(true)}
                  className="relative z-10 w-full py-2.5 bg-white border border-amber-200 text-amber-700 hover:bg-amber-100/50 rounded-xl text-sm font-semibold transition-colors"
                >
                  {selectedGiftId ? "Đổi quà tặng" : "Chọn quà tặng ngay"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Quà tặng */}
      <AnimatePresence>
        {showGiftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGiftModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Gift size={24} className="text-amber-500" />
                  Chọn quà tặng
                </h3>
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {GIFTS.map((gift) => (
                  <div
                    key={gift.id}
                    onClick={() => setSelectedGiftId(gift.id)}
                    className={`flex gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedGiftId === gift.id
                        ? "border-amber-500 bg-amber-50/50"
                        : "border-slate-100 hover:border-amber-200"
                    }`}
                  >
                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 mb-1">
                        {gift.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-bold text-amber-600">
                          Miễn phí
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {gift.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 italic">
                        {gift.note}
                      </p>
                    </div>
                    <div className="flex items-center justify-center pl-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedGiftId === gift.id
                            ? "border-amber-500 bg-amber-500"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedGiftId === gift.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
                >
                  Bỏ qua
                </button>
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-slate-900/20"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
