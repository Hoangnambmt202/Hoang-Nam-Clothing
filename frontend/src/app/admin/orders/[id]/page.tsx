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
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock data - in real app fetch based on params.id
  const order = {
    id: "ORD-1001",
    status: "processing",
    date: "04/02/2024 - 14:30",
    customer: {
      name: "Nguyễn Văn An",
      email: "nguyenvana@gmail.com",
      phone: "0901234567",
      avatar: "NA",
    },
    shippingAddress: {
      address: "123 Đường Lê Lợi, Phường Bến Nghé",
      district: "Quận 1",
      city: "Hồ Chí Minh",
      country: "Vietnam",
    },
    payment: {
      method: "Chuyển khoản ngân hàng",
      status: "paid",
      transactionId: "TRX-987654321",
    },
    items: [
      {
        id: 1,
        name: "Áo Thun Basic Cotton Premium",
        sku: "AT-001-BL-M",
        variant: "Đen / M",
        price: 350000,
        quantity: 2,
        total: 700000,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&auto=format&fit=crop&q=60",
      },
      {
        id: 2,
        name: "Quần Jeans Slim Fit",
        sku: "QJ-002-BL-32",
        variant: "Xanh Đậm / 32",
        price: 650000,
        quantity: 1,
        total: 650000,
        image:
          "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=100&auto=format&fit=crop&q=60",
      },
    ],
    subtotal: 1350000,
    shippingFee: 30000,
    discount: 50000,
    total: 1330000,
  };

  const statusConfig = {
    processing: {
      label: "Đang xử lý",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: Package,
    },
    shipping: {
      label: "Đang giao",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      icon: Truck,
    },
    completed: {
      label: "Hoàn thành",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Đã hủy",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      icon: Clock,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const StatusIcon =
    statusConfig[order.status as keyof typeof statusConfig].icon;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="p-3 bg-white border-2 border-slate-100 hover:border-slate-300 rounded-xl text-slate-500 hover:text-slate-700 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  Đơn hàng #{order.id}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${statusConfig[order.status as keyof typeof statusConfig].bg} ${statusConfig[order.status as keyof typeof statusConfig].color}`}
                >
                  <StatusIcon size={14} />
                  {
                    statusConfig[order.status as keyof typeof statusConfig]
                      .label
                  }
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <Calendar size={14} />
                {order.date}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm">
              <Printer size={18} />
              In hóa đơn
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25">
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Danh sách sản phẩm</h3>
                <span className="text-sm text-slate-500">
                  {order.items.length} sản phẩm
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">
                            Phân loại: {item.variant} | SKU: {item.sku}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900">
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          {formatCurrency(item.price)} x {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-50 border-t-2 border-slate-100 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    {formatCurrency(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Giảm giá</span>
                  <span className="font-medium">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">
                Lịch sử đơn hàng
              </h3>
              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {[
                  {
                    status: "Đơn hàng đã được đặt",
                    time: "14:30 04/02",
                    active: true,
                  },
                  {
                    status: "Đã xác nhận thanh toán",
                    time: "14:35 04/02",
                    active: true,
                  },
                  {
                    status: "Đang đóng gói",
                    time: "15:00 04/02",
                    active: true,
                  },
                  { status: "Đang vận chuyển", time: "---", active: false },
                  {
                    status: "Giao hàng thành công",
                    time: "---",
                    active: false,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-[29px] w-6 h-6 rounded-full border-4 border-white ${step.active ? "bg-blue-600 shadow-md shadow-blue-200" : "bg-slate-300"}`}
                    ></div>
                    <div>
                      <p
                        className={`font-semibold ${step.active ? "text-slate-900" : "text-slate-400"}`}
                      >
                        {step.status}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customer & Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-slate-500" />
                Thông tin khách hàng
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {order.customer.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {order.customer.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Khách hàng thân thiết
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  {order.customer.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  {order.customer.phone}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-slate-500" />
                Địa chỉ giao hàng
              </h3>
              <p className="text-slate-700 font-medium mb-1">
                {order.shippingAddress.address}
              </p>
              <p className="text-sm text-slate-500">
                {order.shippingAddress.district}, {order.shippingAddress.city}
              </p>
              <p className="text-sm text-slate-500">
                {order.shippingAddress.country}
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-slate-500" />
                Thanh toán
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Phương thức
                  </p>
                  <p className="font-medium text-slate-900">
                    {order.payment.method}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Trạng thái
                  </p>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm mt-1">
                    <CheckCircle size={14} />
                    Đã thanh toán
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">
                    Mã giao dịch
                  </p>
                  <p className="font-mono text-xs text-slate-600 bg-slate-100 p-1.5 rounded mt-1">
                    {order.payment.transactionId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
