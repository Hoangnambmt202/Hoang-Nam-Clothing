"use client";

import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  Printer,
  XCircle,
  AlertCircle,
  ChevronRight,
  Copy,
  Banknote,
  ShoppingBag,
  Hash,
  FileText,
  Loader2,
  Ban,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { orderApi } from "@/lib/api/order";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, use, useRef, useCallback } from "react";
import { showToast } from "nextjs-toast-notify";

/* ─── Types ────────────────────────────────────────────── */
type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface StatusStep {
  key: OrderStatus;
  label: string;
  icon: React.ElementType;
  activeColor: string;
  activeBg: string;
}

/* ─── Constants ────────────────────────────────────────── */
const STATUS_FLOW: StatusStep[] = [
  {
    key: "PENDING",
    label: "Chờ xác nhận",
    icon: Clock,
    activeColor: "text-amber-600",
    activeBg: "bg-amber-500",
  },
  {
    key: "CONFIRMED",
    label: "Đã xác nhận",
    icon: CheckCircle,
    activeColor: "text-blue-600",
    activeBg: "bg-blue-500",
  },
  {
    key: "PROCESSING",
    label: "Đang xử lý",
    icon: Package,
    activeColor: "text-indigo-600",
    activeBg: "bg-indigo-500",
  },
  {
    key: "SHIPPED",
    label: "Đang giao",
    icon: Truck,
    activeColor: "text-purple-600",
    activeBg: "bg-purple-500",
  },
  {
    key: "DELIVERED",
    label: "Đã giao hàng",
    icon: CheckCircle,
    activeColor: "text-emerald-600",
    activeBg: "bg-emerald-500",
  },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  PENDING: { label: "Chờ xác nhận", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: CheckCircle },
  PROCESSING: { label: "Đang xử lý", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", icon: Package },
  SHIPPED: { label: "Đang giao hàng", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: Truck },
  DELIVERED: { label: "Đã giao hàng", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
  VNPAY: "VNPay",
  MOMO: "Ví MoMo",
};

const NEXT_ACTION: Record<string, { action: string; label: string; color: string }> = {
  PENDING: { action: "confirm", label: "Xác nhận đơn hàng", color: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25" },
  CONFIRMED: { action: "process", label: "Bắt đầu xử lý", color: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25" },
  PROCESSING: { action: "ship", label: "Giao cho vận chuyển", color: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/25" },
  SHIPPED: { action: "deliver", label: "Xác nhận đã giao", color: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25" },
};

/* ─── Helper ───────────────────────────────────────────── */
const formatCurrency = (amount: number | string) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

const formatDateTime = (d: string) => `${formatTime(d)} ${formatDate(d)}`;

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { accessToken } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  /* ─── Fetch Order ─────────────────────────────────────── */
  const fetchOrder = useCallback(async () => {
    if (!id || !accessToken) return;
    try {
      setLoading(true);
      const data = await orderApi.getById(id, accessToken);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  }, [id, accessToken]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  /* ─── Update Status ───────────────────────────────────── */
  const handleUpdateStatus = async () => {
    if (!order || !accessToken) return;
    const nextAction = NEXT_ACTION[order.status];
    if (!nextAction) return;

    setUpdatingStatus(true);
    try {
      await orderApi.updateStatus(id, nextAction.action as any, accessToken);
      showToast.success(`Đã cập nhật trạng thái: ${nextAction.label}`, { duration: 2000 });
      await fetchOrder();
    } catch (error: any) {
      showToast.error(error?.message || "Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* ─── Cancel Order ────────────────────────────────────── */
  const handleCancelOrder = async () => {
    if (!order || !accessToken) return;
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.")) return;

    setCancelling(true);
    try {
      await orderApi.cancel(id, accessToken);
      showToast.success("Đã hủy đơn hàng thành công", { duration: 2000 });
      await fetchOrder();
    } catch (error: any) {
      showToast.error(error?.message || "Không thể hủy đơn hàng");
    } finally {
      setCancelling(false);
    }
  };

  /* ─── Print Invoice ───────────────────────────────────── */
  const handlePrint = () => {
    if (!order) return;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

    const customerName =
      order.shippingAddress?.recipientName ||
      `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() ||
      "Khách Vãng Lai";
    const customerPhone = order.shippingAddress?.phone || "N/A";
    const addressParts = [
      order.shippingAddress?.addressLine,
      order.shippingAddress?.ward,
      order.shippingAddress?.district,
      order.shippingAddress?.province,
    ].filter(Boolean);

    const itemsHtml = (order.items || [])
      .map(
        (item: any, idx: number) => `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px">${idx + 1}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-size:13px">
            <strong>${item.product?.name || "Sản phẩm"}</strong><br>
            <span style="color:#64748b;font-size:12px">${item.productVariant?.color || ""} / ${item.productVariant?.size || ""} — SKU: ${item.productVariant?.sku || "N/A"}</span>
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px">${formatCurrency(item.price)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:13px">${item.quantity}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;font-weight:600">${formatCurrency(Number(item.price) * item.quantity)}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>Hóa đơn #${order.id?.slice(0, 8).toUpperCase()}</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#1e293b; padding:40px; }
          .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; padding-bottom:24px; border-bottom:2px solid #0f172a; }
          .brand { font-size:28px; font-weight:800; color:#0f172a; letter-spacing:-0.5px; }
          .brand-sub { font-size:12px; color:#64748b; margin-top:4px; }
          .invoice-meta { text-align:right; }
          .invoice-title { font-size:20px; font-weight:700; color:#0f172a; text-transform:uppercase; letter-spacing:1px; }
          .invoice-id { font-size:13px; color:#64748b; margin-top:4px; }
          .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:32px; }
          .info-block h4 { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#94a3b8; margin-bottom:8px; font-weight:700; }
          .info-block p { font-size:13px; line-height:1.8; }
          table { width:100%; border-collapse:collapse; margin-bottom:24px; }
          thead th { background:#f8fafc; padding:12px 8px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#64748b; font-weight:700; border-bottom:2px solid #e2e8f0; }
          thead th:nth-child(3), thead th:nth-child(5) { text-align:right; }
          thead th:nth-child(4) { text-align:center; }
          .summary { display:flex; justify-content:flex-end; margin-top:16px; }
          .summary-table { width:280px; }
          .summary-row { display:flex; justify-content:space-between; padding:6px 0; font-size:13px; color:#475569; }
          .summary-row.total { border-top:2px solid #0f172a; padding-top:12px; margin-top:8px; font-size:16px; font-weight:800; color:#0f172a; }
          .footer { margin-top:48px; padding-top:24px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; font-size:12px; color:#94a3b8; }
          .stamp { text-align:center; margin-top:48px; }
          .stamp-title { font-size:13px; font-weight:700; color:#0f172a; }
          .stamp-line { margin-top:64px; border-top:1px dashed #94a3b8; width:180px; margin-left:auto; margin-right:auto; }
          @media print { body { padding:20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">HOÀNG NAM</div>
            <div class="brand-sub">Clothing & Fashion</div>
          </div>
          <div class="invoice-meta">
            <div class="invoice-title">Hóa Đơn</div>
            <div class="invoice-id">#${order.id?.slice(0, 8).toUpperCase()}</div>
            <div class="invoice-id">${formatDateTime(order.createdAt)}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-block">
            <h4>Thông tin khách hàng</h4>
            <p><strong>${customerName}</strong></p>
            <p>📞 ${customerPhone}</p>
            ${order.user?.email ? `<p>✉️ ${order.user.email}</p>` : ""}
          </div>
          <div class="info-block">
            <h4>Địa chỉ giao hàng</h4>
            <p>${addressParts.join(", ")}</p>
            <p style="margin-top:8px"><strong>Thanh toán:</strong> ${PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod || "COD"}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width:5%">STT</th>
              <th style="width:40%">Sản phẩm</th>
              <th style="width:20%">Đơn giá</th>
              <th style="width:10%">SL</th>
              <th style="width:25%">Thành tiền</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div class="summary">
          <div class="summary-table">
            <div class="summary-row"><span>Tạm tính</span><span>${formatCurrency(order.subTotal || order.totalAmount)}</span></div>
            <div class="summary-row"><span>Phí vận chuyển</span><span>${formatCurrency(order.shippingFee || 0)}</span></div>
            ${Number(order.discountAmount) > 0 ? `<div class="summary-row"><span>Giảm giá</span><span>-${formatCurrency(order.discountAmount)}</span></div>` : ""}
            <div class="summary-row total"><span>Tổng cộng</span><span>${formatCurrency(order.finalAmount)}</span></div>
          </div>
        </div>

        <div class="stamp">
          <div class="stamp-title">Người lập hóa đơn</div>
          <div class="stamp-line"></div>
        </div>

        <div class="footer">
          <span>Hoàng Nam Clothing — Cảm ơn quý khách!</span>
          <span>In ngày: ${formatDateTime(new Date().toISOString())}</span>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  /* ─── Copy ID ─────────────────────────────────────────── */
  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    showToast.success("Đã sao chép mã đơn hàng!", { duration: 1500 });
  };

  /* ─── Loading / Error States ──────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={36} />
        <p className="text-slate-500 font-medium">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Không tìm thấy đơn hàng</h2>
        <Link href="/admin/orders" className="text-blue-600 hover:underline text-sm">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  /* ─── Derived Data ────────────────────────────────────── */
  const status: string = order.status || "PENDING";
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const StatusIcon = config.icon;
  const nextAction = NEXT_ACTION[status];
  const canCancel = ["PENDING", "CONFIRMED"].includes(status);
  const isCancelled = status === "CANCELLED";
  const isDelivered = status === "DELIVERED";

  const customerName =
    order.shippingAddress?.recipientName ||
    `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() ||
    "Khách Vãng Lai";
  const customerPhone = order.shippingAddress?.phone || "N/A";
  const customerEmail = order.user?.email || "N/A";
  const avatar = customerName.substring(0, 2).toUpperCase();

  // Build timeline from status flow
  const currentStepIndex = STATUS_FLOW.findIndex((s) => s.key === status);

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6" ref={printRef}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ═══════ HEADER ═══════ */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="p-2.5 bg-white border border-slate-200 hover:border-slate-400 rounded-xl text-slate-500 hover:text-slate-700 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Đơn hàng
                </h1>
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors font-mono"
                >
                  <Hash size={13} />
                  {order.id?.slice(0, 8).toUpperCase()}
                  <Copy size={12} />
                </button>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${config.bg} ${config.color} ${config.border}`}
                >
                  <StatusIcon size={13} />
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1.5">
                <Calendar size={14} />
                {formatDateTime(order.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm text-sm"
            >
              <Printer size={16} />
              In hóa đơn
            </button>
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm text-sm disabled:opacity-50"
              >
                {cancelling ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                Hủy đơn
              </button>
            )}
            {nextAction && (
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className={`px-5 py-2.5 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 text-sm disabled:opacity-50 ${nextAction.color}`}
              >
                {updatingStatus ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ChevronRight size={16} />
                )}
                {nextAction.label}
              </button>
            )}
          </div>
        </div>

        {/* ═══════ STATUS PROGRESS BAR ═══════ */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wider">
              Tiến trình đơn hàng
            </h3>
            <div className="flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 z-0"></div>
              {/* Active line */}
              <div
                className="absolute top-5 left-8 h-0.5 bg-blue-500 z-0 transition-all duration-500"
                style={{
                  width: `${currentStepIndex >= 0 ? (currentStepIndex / (STATUS_FLOW.length - 1)) * (100 - 10) : 0}%`,
                }}
              ></div>

              {STATUS_FLOW.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCurrent = step.key === status;
                const StepIcon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 z-10 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCurrent
                          ? `${step.activeBg} border-white text-white shadow-lg ring-4 ring-blue-500/20`
                          : isActive
                          ? `${step.activeBg} border-white text-white`
                          : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >
                      <StepIcon size={18} />
                    </div>
                    <span
                      className={`text-xs font-semibold text-center leading-tight ${
                        isCurrent ? step.activeColor : isActive ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ CANCELLED BANNER ═══════ */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-red-800">Đơn hàng đã bị hủy</h3>
              <p className="text-sm text-red-600 mt-0.5">
                Đơn hàng này đã bị hủy và các sản phẩm đã được hoàn trả lại kho hàng.
              </p>
            </div>
          </div>
        )}

        {/* ═══════ MAIN GRID ═══════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column: Products + Summary ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-slate-400" />
                  Sản phẩm đặt mua
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-semibold">
                  {order.items?.length || 0} sản phẩm
                </span>
              </div>

              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <div className="col-span-5">Sản phẩm</div>
                <div className="col-span-2 text-right">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-3 text-right">Thành tiền</div>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item: any) => {
                  const product = item.product || {};
                  const variant = item.productVariant || {};
                  const variantImages = variant.images || [];
                  const productImages = product.images || [];
                  const image =
                    variantImages[0]?.url ||
                    productImages[0]?.url ||
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&auto=format&fit=crop&q=60";
                  const total = Number(item.price) * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center"
                    >
                      {/* Product info */}
                      <div className="md:col-span-5 flex gap-4">
                        <div className="relative w-16 h-16 md:w-14 md:h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                          <Image
                            src={image}
                            alt={product.name || "Sản phẩm"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm truncate">
                            {product.name || "Sản phẩm không xác định"}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {variant.color && variant.size
                              ? `${variant.color} / ${variant.size}`
                              : "Mặc định"}
                          </p>
                          {variant.sku && (
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              SKU: {variant.sku}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 text-right text-sm text-slate-700">
                        <span className="md:hidden text-xs text-slate-400 mr-2">Đơn giá:</span>
                        {formatCurrency(item.price)}
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 text-center">
                        <span className="md:hidden text-xs text-slate-400 mr-2">SL:</span>
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 text-sm font-semibold px-3 py-1 rounded-lg">
                          x{item.quantity}
                        </span>
                      </div>

                      {/* Subtotal */}
                      <div className="md:col-span-3 text-right font-bold text-slate-900 text-sm">
                        <span className="md:hidden text-xs text-slate-400 mr-2 font-normal">Thành tiền:</span>
                        {formatCurrency(total)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-2.5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {formatCurrency(order.subTotal || order.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    {formatCurrency(order.shippingFee || 0)}
                  </span>
                </div>
                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Giảm giá</span>
                    <span className="font-medium">
                      -{formatCurrency(order.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-base">Tổng cộng</span>
                  <span className="text-xl md:text-2xl font-extrabold text-blue-600">
                    {formatCurrency(order.finalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Order Notes ── */}
            {order.notes && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm">
                  <FileText size={16} className="text-slate-400" />
                  Ghi chú đơn hàng
                </h3>
                <p className="text-sm text-slate-600 bg-amber-50 border border-amber-100 rounded-xl p-4 leading-relaxed">
                  {order.notes}
                </p>
              </div>
            )}

            {/* ── Order Timeline ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2 text-sm">
                <Clock size={16} className="text-slate-400" />
                Lịch sử đơn hàng
              </h3>
              <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Created */}
                <TimelineItem
                  active
                  label="Đơn hàng đã được tạo"
                  time={formatDateTime(order.createdAt)}
                />
                {/* Status transitions */}
                {STATUS_FLOW.slice(1).map((step) => {
                  const stepIdx = STATUS_FLOW.findIndex((s) => s.key === step.key);
                  const isActive = stepIdx <= currentStepIndex;
                  return (
                    <TimelineItem
                      key={step.key}
                      active={isActive}
                      label={step.label}
                      time={isActive ? formatDateTime(order.updatedAt) : "—"}
                    />
                  );
                })}
                {isCancelled && (
                  <TimelineItem
                    active
                    cancelled
                    label="Đơn hàng đã bị hủy"
                    time={formatDateTime(order.updatedAt)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column: Customer, Address, Payment ── */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                <User size={16} className="text-slate-400" />
                Thông tin khách hàng
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{customerName}</p>
                  <p className="text-xs text-slate-500">
                    {order.user?.id ? "Thành viên" : "Khách vãng lai"}
                  </p>
                </div>
              </div>
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={15} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{customerEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={15} className="text-slate-400 flex-shrink-0" />
                  {customerPhone}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-slate-400" />
                Địa chỉ giao hàng
              </h3>
              <div className="space-y-1.5 text-sm">
                <p className="font-semibold text-slate-900">
                  {order.shippingAddress?.recipientName}
                </p>
                <p className="text-slate-600">
                  {order.shippingAddress?.addressLine}
                </p>
                <p className="text-slate-500">
                  {order.shippingAddress?.ward}
                  {order.shippingAddress?.district ? `, ${order.shippingAddress.district}` : ""}
                </p>
                <p className="text-slate-500">
                  {order.shippingAddress?.province}
                </p>
                <p className="text-slate-600 pt-1">
                  <Phone size={13} className="inline mr-1 text-slate-400" />
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                <CreditCard size={16} className="text-slate-400" />
                Thanh toán
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider mb-1">
                    Phương thức
                  </p>
                  <div className="flex items-center gap-2">
                    <Banknote size={16} className="text-slate-400" />
                    <p className="font-medium text-slate-900 text-sm">
                      {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod || "COD"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wider mb-1">
                    Trạng thái thanh toán
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-full ${
                      order.paymentStatus === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {order.paymentStatus === "success" ? (
                      <CheckCircle size={13} />
                    ) : (
                      <Clock size={13} />
                    )}
                    {order.paymentStatus === "success" ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            {order.shippingMethod && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                  <Truck size={16} className="text-slate-400" />
                  Vận chuyển
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Đơn vị</span>
                    <span className="font-medium text-slate-900">
                      {order.shippingMethod.name || "Tiêu chuẩn"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phí</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(order.shippingFee || order.shippingMethod.baseCost || 0)}
                    </span>
                  </div>
                  {order.shippingMethod.estimatedDays && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dự kiến</span>
                      <span className="font-medium text-slate-900">
                        {order.shippingMethod.estimatedDays} ngày
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Meta */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                <FileText size={16} className="text-slate-400" />
                Thông tin bổ sung
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn hàng</span>
                  <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {order.id?.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày đặt</span>
                  <span className="text-slate-700">{formatDateTime(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cập nhật</span>
                  <span className="text-slate-700">{formatDateTime(order.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Timeline Item Component ───────────────────────────── */
function TimelineItem({
  active,
  cancelled,
  label,
  time,
}: {
  active: boolean;
  cancelled?: boolean;
  label: string;
  time: string;
}) {
  return (
    <div className="relative">
      <div
        className={`absolute -left-[21px] w-5 h-5 rounded-full border-[3px] border-white ${
          cancelled
            ? "bg-red-500 shadow-md shadow-red-200"
            : active
            ? "bg-blue-500 shadow-md shadow-blue-200"
            : "bg-slate-300"
        }`}
      ></div>
      <div>
        <p
          className={`font-semibold text-sm ${
            cancelled ? "text-red-600" : active ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {label}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}
