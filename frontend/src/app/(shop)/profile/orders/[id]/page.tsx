"use client";

import { useState, useEffect, use } from "react";
import { orderApi } from "@/lib/api/order";
import { useAuth } from "@/hooks/useAuth";
import { Package, Clock, Truck, CheckCircle, AlertCircle, ArrowLeft, MapPin, Phone, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, accessToken } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && accessToken) {
      fetchOrder();
    }
  }, [id, accessToken]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getById(id, accessToken || "");
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      await orderApi.cancel(id, accessToken || "");
      alert("Hủy đơn hàng thành công");
      fetchOrder();
    } catch (error) {
      alert("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  const statusConfig = {
    pending: { label: "Chờ xử lý", color: "text-amber-600 bg-amber-50", icon: Clock },
    processing: { label: "Đang xử lý", color: "text-blue-600 bg-blue-50", icon: Package },
    shipping: { label: "Đang giao", color: "text-purple-600 bg-purple-50", icon: Truck },
    completed: { label: "Hoàn thành", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle },
    cancelled: { label: "Đã hủy", color: "text-red-600 bg-red-50", icon: AlertCircle },
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  if (!order) return <div className="min-h-[60vh] flex items-center justify-center">Không tìm thấy đơn hàng.</div>;

  const statusKey = order.status?.toLowerCase() === 'shipped' ? 'shipping' : 
                    order.status?.toLowerCase() === 'delivered' ? 'completed' : 
                    order.status?.toLowerCase() || 'pending';
  const config = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold font-montserrat">Chi tiết đơn hàng #{order.id.substring(0, 8).toUpperCase()}</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Ngày đặt</p>
            <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
          </div>
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold ${config.color}`}>
            <Icon size={18} />
            {config.label}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg mb-4">Sản phẩm</h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.images?.[0]?.url ? (
                    <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product?.name || "Sản phẩm"}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.productVariant?.color} {item.productVariant?.size && `| Size: ${item.productVariant?.size}`}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-medium">x{item.quantity}</p>
                    <p className="font-bold">{Number(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-gray-500" /> Địa chỉ nhận hàng
          </h3>
          <p className="font-medium text-gray-900 mb-1">{order.shippingAddress?.recipientName}</p>
          <p className="text-gray-600 mb-1">{order.shippingAddress?.phone}</p>
          <p className="text-gray-600">
            {order.shippingAddress?.addressLine}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-gray-500" /> Thanh toán
          </h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Phương thức:</span>
              <span className="font-medium text-gray-900">{order.paymentTransactions?.[0]?.paymentMethod || "COD"}</span>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái:</span>
              <span className="font-medium text-emerald-600">
                {order.paymentTransactions?.[0]?.status === "COMPLETED" ? "Đã thanh toán" : "Chưa thanh toán"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Tổng quan đơn hàng</h3>
        <div className="space-y-3 text-gray-600">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{Number(order.totalAmount || order.finalAmount).toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>{Number(order.shippingMethod?.price || 0).toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-900">Tổng cộng</span>
            <span className="text-xl font-bold text-black">{Number(order.finalAmount).toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </div>

      {statusKey === 'pending' && (
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleCancelOrder}
            className="px-6 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
            Hủy đơn hàng
          </button>
        </div>
      )}
    </div>
  );
}
