"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { orderApi } from "@/lib/api/order";
import { Package, ChevronRight, Loader2, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import Link from "next/link";

type Order = {
  id: string;
  code: string;
  createdAt: string;
  status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  total: number;
  itemCount: number;
  thumbnail?: string;
};

const STATUS_CONFIG = {
  pending: { label: "Chờ xác nhận", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  processing: { label: "Đang xử lý", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  shipping: { label: "Đang giao", icon: Truck, color: "text-sky-600", bg: "bg-sky-50" },
  delivered: { label: "Đã giao", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelled: { label: "Đã huỷ", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

const STATUS_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã huỷ" },
] as const;

const OrderCard = ({ order }: { order: Order }) => {
  const cfg = STATUS_CONFIG[order.status];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-zinc-100 rounded-xl p-5 hover:border-zinc-200 hover:shadow-sm transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-montserrat font-semibold text-[#1E293B]">
              #{order.code}
            </span>
            <span className={`flex items-center gap-1 text-[11px] font-montserrat font-medium px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
              <Icon size={10} />
              {cfg.label}
            </span>
          </div>
          <p className="text-xs font-montserrat text-[#64748B]">
            {order.itemCount} sản phẩm &middot;{" "}
            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-base font-cormorant font-semibold text-[#1E293B]">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(order.total)}
          </p>
          <Link
            href={`/orders/${order.id}`}
            className="flex items-center gap-1 text-xs font-montserrat text-[#2563EB] hover:underline mt-1 justify-end group-hover:gap-2 transition-all"
          >
            Chi tiết <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const OrderHistoryTab = () => {
  const token = useSelector((s: RootState) => s.auth.accessToken);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await orderApi.getMyOrders({ page: 1, limit: 100 }, token);
        const mappedOrders = (data?.orders || []).map((o: any) => ({
          id: o.id,
          code: o.id.slice(0, 8).toUpperCase(),
          createdAt: o.createdAt,
          status: o.status.toLowerCase(),
          total: o.finalAmount || o.totalAmount,
          itemCount: o.items?.length || 0,
          thumbnail: o.items?.[0]?.productVariant?.product?.images?.[0]?.url || o.items?.[0]?.product?.images?.[0]?.url,
        }));
        setOrders(mappedOrders);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const filtered =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl font-cormorant font-semibold text-[#1E293B] tracking-tight">
          Lịch sử đơn hàng
        </h3>
        <p className="text-sm font-montserrat text-[#64748B] mt-1">
          Theo dõi tất cả đơn hàng của bạn
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-montserrat transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "bg-[#1E293B] text-white font-medium"
                : "bg-white border border-zinc-200 text-[#475569] hover:border-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 size={28} className="animate-spin text-zinc-300" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 border-2 border-dashed border-zinc-200 rounded-2xl">
          <Package size={32} className="mx-auto text-zinc-300 mb-3" strokeWidth={1.5} />
          <p className="font-montserrat text-sm text-[#64748B]">Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrderHistoryTab;
