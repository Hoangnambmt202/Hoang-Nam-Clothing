"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { removeItem, updateQuantity } from "@/store/features/cartSlice";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (id: string, variantId: string | undefined, type: "increase" | "decrease", currentQuantity: number) => {
    const newQty = type === "increase" ? currentQuantity + 1 : currentQuantity - 1;
    if (newQty > 0) {
      dispatch(updateQuantity({ id, variantId, quantity: newQty }));
    }
  };

  const handleQuantityInput = (id: string, variantId: string | undefined, value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue > 0) {
      dispatch(updateQuantity({ id, variantId, quantity: numericValue }));
    }
  };

  const handleRemove = (id: string, variantId: string | undefined) => {
    dispatch(removeItem({ id, variantId }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-cormorant font-bold text-[#1E293B] mb-10 text-center">
          Giỏ Hàng Của Bạn
        </h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-12 text-center border border-zinc-100 shadow-sm flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h2 className="font-montserrat text-xl font-medium text-[#1E293B] mb-2">
                Giỏ hàng của bạn đang trống
              </h2>
              <p className="font-montserrat font-light text-sm text-[#64748B]">
                Hãy ghé qua cửa hàng để tìm kiếm những bộ trang phục tuyệt vời nhất nhé!
              </p>
            </div>
            <Link href="/new-arrivals">
              <button className="px-8 py-4 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors font-montserrat font-medium flex items-center gap-2 group">
                Tiếp tục mua sắm
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any, idx: number) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={`${item.id}-${item.variantId || ""}`}
                  className="bg-white border border-zinc-100 rounded-2xl p-4 flex gap-4 items-center group relative hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-20 h-24 rounded-xl border border-zinc-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-montserrat font-medium text-sm text-[#1E293B] truncate mb-1">
                      {item.name}
                    </h3>
                    {(item.color || item.size) && (
                      <div className="flex gap-2 text-xs font-montserrat font-light text-[#64748B] mb-2">
                        {item.color && <span>Màu: {item.color}</span>}
                        {item.color && item.size && <span>•</span>}
                        {item.size && <span>Kích thước: {item.size}</span>}
                      </div>
                    )}
                    <span className="font-montserrat font-semibold text-[#1E293B] text-sm block">
                      {Number(item.price).toLocaleString("vi-VN")}đ
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center mt-3 w-max bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.variantId, "decrease", item.quantity)
                        }
                        className="p-1.5 hover:bg-zinc-100 transition-colors text-zinc-500"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        className="w-10 text-center bg-transparent border-none outline-none font-montserrat text-xs text-[#1E293B]"
                        value={item.quantity}
                        type="number"
                        onChange={(e) =>
                          handleQuantityInput(item.id, item.variantId, e.target.value)
                        }
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.variantId, "increase", item.quantity)
                        }
                        className="p-1.5 hover:bg-zinc-100 transition-colors text-zinc-500"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id, item.variantId)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm h-fit">
              <h2 className="font-montserrat font-semibold text-lg text-[#1E293B] mb-6">Tạm Tính</h2>
              <div className="space-y-4 font-montserrat text-sm text-[#64748B]">
                <div className="flex justify-between">
                  <span className="font-light">Tổng tiền hàng:</span>
                  <span className="font-semibold text-[#1E293B]">
                    {calculateTotal().toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light">Phí vận chuyển:</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-zinc-100 flex justify-between text-base font-semibold text-[#1E293B]">
                  <span>Tổng Cộng:</span>
                  <span className="text-[#2563EB]">
                    {calculateTotal().toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <button className="w-full relative flex items-center justify-center py-4 mt-8 bg-[#1E293B] text-white rounded-xl hover:bg-[#0F172A] transition-colors overflow-hidden group font-montserrat font-medium">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10">Thanh Toán</span>
                </button>
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;