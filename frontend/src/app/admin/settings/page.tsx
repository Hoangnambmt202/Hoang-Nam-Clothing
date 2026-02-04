"use client";

import {
  Save,
  Bell,
  Lock,
  User,
  Globe,
  Moon,
  Shield,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Key,
  Smartphone,
  Monitor,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    weeklyReport: false,
    newReview: true,
    promotions: false,
    systemUpdates: true,
  });

  const tabs = [
    { id: "general", label: "Thông tin chung", icon: Globe },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "account", label: "Tài khoản", icon: User },
    { id: "security", label: "Bảo mật", icon: Lock },
    { id: "appearance", label: "Giao diện", icon: Moon },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      {/* Store Information */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Building size={20} className="text-blue-600" />
          Thông tin cửa hàng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className=" text-sm font-semibold text-slate-700 mb-2">
              Tên cửa hàng
            </label>
            <input
              type="text"
              defaultValue="Hoang Nam Clothing"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className=" text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Mail size={14} />
              Email liên hệ
            </label>
            <input
              type="email"
              defaultValue="contact@hoangnam.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className=" text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Phone size={14} />
              Số điện thoại
            </label>
            <input
              type="tel"
              defaultValue="+84 90 123 4567"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className=" text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Globe size={14} />
              Múi giờ
            </label>
            <select className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white">
              <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
              <option>(GMT+08:00) Singapore, Kuala Lumpur</option>
              <option>(GMT+09:00) Tokyo, Seoul</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className=" text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <MapPin size={14} />
          Địa chỉ
        </label>
        <textarea
          rows={4}
          defaultValue="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all resize-none bg-white"
        />
      </div>

      {/* Business Hours */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Giờ làm việc</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-900">
                Thứ Hai - Thứ Sáu
              </span>
              <p className="text-sm text-slate-500">8:00 AM - 6:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-900">
                Thứ Bảy - Chủ Nhật
              </span>
              <p className="text-sm text-slate-500">9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900 font-medium">
          Quản lý cách bạn nhận thông báo về hoạt động trong cửa hàng
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Thông báo qua Email
        </h3>
        <div className="space-y-3">
          {[
            {
              key: "newOrder",
              label: "Có đơn hàng mới",
              desc: "Nhận email khi có đơn hàng mới",
            },
            {
              key: "lowStock",
              label: "Sản phẩm sắp hết hàng",
              desc: "Cảnh báo khi tồn kho thấp",
            },
            {
              key: "weeklyReport",
              label: "Báo cáo doanh thu hàng tuần",
              desc: "Tóm tắt hàng tuần",
            },
            {
              key: "newReview",
              label: "Có đánh giá mới từ khách hàng",
              desc: "Thông báo đánh giá mới",
            },
            {
              key: "promotions",
              label: "Khuyến mãi và ưu đãi",
              desc: "Cập nhật về chương trình khuyến mãi",
            },
            {
              key: "systemUpdates",
              label: "Cập nhật hệ thống",
              desc: "Thông tin về tính năng mới",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-100 hover:border-slate-200 transition-all"
            >
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={
                    notifications[item.key as keyof typeof notifications]
                  }
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Kênh nhận thông báo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border-2 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mail size={20} className="text-blue-600" />
              </div>
              <span className="font-bold text-slate-900">Email</span>
            </div>
            <p className="text-sm text-slate-500">contact@hoangnam.com</p>
            <div className="mt-3 flex items-center gap-2 text-emerald-600">
              <Check size={16} />
              <span className="text-xs font-semibold">Đang kích hoạt</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Smartphone size={20} className="text-slate-600" />
              </div>
              <span className="font-bold text-slate-900">SMS</span>
            </div>
            <p className="text-sm text-slate-500">+84 90 123 4567</p>
            <div className="mt-3 flex items-center gap-2 text-slate-400">
              <X size={16} />
              <span className="text-xs font-semibold">Chưa kích hoạt</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Bell size={20} className="text-slate-600" />
              </div>
              <span className="font-bold text-slate-900">Push</span>
            </div>
            <p className="text-sm text-slate-500">Trình duyệt</p>
            <div className="mt-3 flex items-center gap-2 text-slate-400">
              <X size={16} />
              <span className="text-xs font-semibold">Chưa kích hoạt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-6 p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
        <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          HN
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900">Hoang Nam</h3>
          <p className="text-slate-600 mt-1">admin@hoangnam.com</p>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all">
              Đổi ảnh đại diện
            </button>
            <button className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-lg text-sm font-semibold transition-all">
              Xóa ảnh
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className=" text-sm font-semibold text-slate-700 mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            defaultValue="Hoang Nam"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label className=" text-sm font-semibold text-slate-700 mb-2">
            Username
          </label>
          <input
            type="text"
            defaultValue="hoangnam"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label className=" text-sm font-semibold text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            defaultValue="admin@hoangnam.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label className=" text-sm font-semibold text-slate-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            defaultValue="+84 90 123 4567"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
          />
        </div>
      </div>

      <div className="pt-6 border-t-2 border-slate-100">
        <button className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2">
          <X size={16} />
          Xóa tài khoản
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-900">
            Tài khoản của bạn được bảo mật
          </p>
          <p className="text-sm text-emerald-700 mt-1">
            Xác thực hai yếu tố đã được kích hoạt
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Đổi mật khẩu</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Key size={14} />
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className=" text-sm font-semibold text-slate-700 mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className=" text-sm font-semibold text-slate-700 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all bg-white"
            />
          </div>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all">
            Cập nhật mật khẩu
          </button>
        </div>
      </div>

      <div className="pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Phiên đăng nhập
        </h3>
        <div className="space-y-3">
          {[
            {
              device: "Chrome on Windows",
              location: "Ho Chi Minh City, Vietnam",
              time: "Đang hoạt động",
              current: true,
            },
            {
              device: "Safari on iPhone",
              location: "Hanoi, Vietnam",
              time: "2 giờ trước",
              current: false,
            },
          ].map((session, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <Monitor size={20} className="text-slate-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                        Hiện tại
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500">{session.location}</p>
                  <p className="text-xs text-slate-400 mt-1">{session.time}</p>
                </div>
              </div>
              {!session.current && (
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-all">
                  Đăng xuất
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Chế độ giao diện
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "light", label: "Sáng", icon: "☀️", active: true },
            { id: "dark", label: "Tối", icon: "🌙", active: false },
            { id: "auto", label: "Tự động", icon: "🔄", active: false },
          ].map((theme) => (
            <button
              key={theme.id}
              className={`p-6 rounded-xl border-2 transition-all ${
                theme.active
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="text-4xl mb-3">{theme.icon}</div>
              <p className="font-bold text-slate-900">{theme.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Màu chủ đạo</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {[
            "blue",
            "emerald",
            "purple",
            "pink",
            "orange",
            "red",
            "indigo",
            "slate",
          ].map((color) => (
            <button
              key={color}
              className={`w-12 h-12 rounded-xl bg-${color}-500 hover:scale-110 transition-transform ${
                color === "blue" ? "ring-4 ring-blue-200" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Tùy chỉnh giao diện
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">
                Hiển thị sidebar thu gọn
              </p>
              <p className="text-sm text-slate-500">
                Sidebar sẽ tự động thu gọn
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-slate-100">
            <div>
              <p className="font-semibold text-slate-900">Hiệu ứng động</p>
              <p className="text-sm text-slate-500">Bật/tắt animation</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "notifications":
        return renderNotificationSettings();
      case "account":
        return renderAccountSettings();
      case "security":
        return renderSecuritySettings();
      case "appearance":
        return renderAppearanceSettings();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Cài đặt</h1>
            <p className="text-slate-600 mt-1">
              Quản lý cài đặt hệ thống và tài khoản
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25">
            <Save size={20} />
            Lưu thay đổi
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-100"
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl p-8 border-2 border-slate-100 shadow-sm min-h-[600px]">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-6 border-b-2 border-slate-100">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
