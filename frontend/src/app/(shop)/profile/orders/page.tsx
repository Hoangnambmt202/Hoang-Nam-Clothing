"use client";

import { useState, useEffect } from "react";
import { orderApi } from "@/lib/api/order";
import { useAuth } from "@/hooks/useAuth";
import { Package, Clock, Truck, CheckCircle, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserOrdersPage() {
  const { user, accessToken } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, currentPage: 1, totalPages: 1 });
  const [selectedFilter, setSelectedFilter] = useState("all");

  const fetchOrders = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const data = await orderApi.getMyOrders({ page: pagination.currentPage, limit: 10 }, accessToken);
      if (data && data.orders) {
        setOrders(data.orders);
        setPagination({
          total: data.total,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, accessToken]);

  const statusConfig = {
    pending: { label: "Chờ xử lý", color: "text-amber-600 bg-amber-50", icon: Clock },
    processing: { label: "Đang xử lý", color: "text-blue-600 bg-blue-50", icon: Package },
    shipping: { label: "Đang giao", color: "text-purple-600 bg-purple-50", icon: Truck },
    completed: { label: "Hoàn thành", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle },
    cancelled: { label: "Đã hủy", color: "text-red-600 bg-red-50", icon: AlertCircle },
  };

  const filteredOrders = orders.filter((order) => {
    const statusKey = order.status?.toLowerCase() === 'shipped' ? 'shipping' : 
                      order.status?.toLowerCase() === 'delivered' ? 'completed' : 
                      order.status?.toLowerCase() || 'pending';
    return selectedFilter === "all" || statusKey === selectedFilter;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold font-montserrat mb-6">Đơn hàng của tôi</h1>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200">
        {["all", "pending", "processing", "shipping", "completed", "cancelled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
              selectedFilter === filter
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter === "all" ? "Tất cả" : statusConfig[filter as keyof typeof statusConfig].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đơn hàng</h3>
          <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong trạng thái này.</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusKey = order.status?.toLowerCase() === 'shipped' ? 'shipping' : 
                              order.status?.toLowerCase() === 'delivered' ? 'completed' : 
                              order.status?.toLowerCase() || 'pending';
            const config = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
            const Icon = config.icon;

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng</p>
                    <p className="font-bold text-gray-900">#{order.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="font-bold text-gray-900">{Number(order.finalAmount).toLocaleString("vi-VN")}đ</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold ${config.color}`}>
                    <Icon size={16} />
                    {config.label}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* First item preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {order.items[0].product?.images?.[0] ? (
                          <Image src={order.items[0].product.images[0]} alt="Product" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{order.items[0].product?.name || "Sản phẩm"}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.items[0].productVariant?.color} {order.items[0].productVariant?.size && `| Size: ${order.items[0].productVariant?.size}`}
                        </p>
                        <p className="text-sm font-medium mt-1">x{order.items[0].quantity}</p>
                      </div>
                    </div>
                  )}

                  {order.items && order.items.length > 1 && (
                    <div className="mt-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
                      + {order.items.length - 1} sản phẩm khác
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <Link
                      href={`/profile/orders/${order.id}`}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      <Eye size={18} />
                      Chi tiết đơn hàng
                    </Link>
                    {statusKey === 'pending' && (
                      <button className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button 
            disabled={pagination.currentPage === 1}
            onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Trước
          </button>
          <span className="px-4 py-2 text-gray-600">Trang {pagination.currentPage}/{pagination.totalPages}</span>
          <button 
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
