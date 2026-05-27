"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { CheckCircle, MapPin, Package, ArrowRight, Wallet } from "lucide-react";
import { orderApi } from "@/lib/api/order";
import { useAuth } from "@/hooks/useAuth";

export default function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [order, setOrder] = useState<any>(null);
  const { accessToken, isInitialized } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && isInitialized) {
      orderApi.getById(id, accessToken || "")
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, accessToken, isInitialized]);

  if (loading || !order) return <div className="min-h-screen flex items-center justify-center">Đang tải thông tin đơn hàng...</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          
          <h1 className="text-3xl font-cormorant font-bold text-slate-900 mb-2">
            Cảm ơn bạn đã đặt hàng!
          </h1>
          <p className="text-slate-500 mb-8">
            Đơn hàng <span className="font-bold text-black">#{order.id.slice(0,8).toUpperCase()}</span> của bạn đã được tiếp nhận và đang được xử lý.
          </p>

          {/* Hướng dẫn chuyển khoản nếu chọn Bank Transfer */}
          {order.paymentMethod === "BANK_TRANSFER" && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-left mb-8">
              <div className="flex items-center gap-3 mb-4 text-blue-900">
                <Wallet />
                <h3 className="font-bold text-lg">Hướng dẫn thanh toán</h3>
              </div>
              <p className="text-sm text-blue-800 mb-4">
                Vui lòng chuyển khoản số tiền <span className="font-bold text-lg">{Number(order.finalAmount || order.totalAmount).toLocaleString('vi-VN')}đ</span> vào tài khoản dưới đây để chúng tôi tiến hành giao hàng:
              </p>
              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <span className="font-bold">Vietcombank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <span className="font-bold tracking-wider">0123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <span className="font-bold">HOANG NAM CLOTHING</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                  <span className="text-slate-500">Nội dung CK:</span>
                  <span className="font-bold text-blue-600">HN {order.id.slice(0,8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
            <div className="bg-slate-50 p-6 rounded-2xl">
              <div className="flex items-center gap-2 font-bold mb-4 text-slate-900">
                <MapPin size={18} /> Địa chỉ giao hàng
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-semibold text-black">{order.shippingAddress?.recipientName}</p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.addressLine}</p>
                <p>
                  {order.shippingAddress?.ward}
                  {order.shippingAddress?.district ? `, ${order.shippingAddress.district}` : ""}
                </p>
                <p>{order.shippingAddress?.province}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl">
              <div className="flex items-center gap-2 font-bold mb-4 text-slate-900">
                <Package size={18} /> Thông tin vận chuyển
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <p>Giao hàng tiêu chuẩn</p>
                <p>Dự kiến giao: 2-3 ngày làm việc</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/profile/orders/${order.id}`}
              className="px-8 py-3 bg-slate-100 text-slate-800 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Theo dõi đơn hàng
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              Tiếp tục mua sắm <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
