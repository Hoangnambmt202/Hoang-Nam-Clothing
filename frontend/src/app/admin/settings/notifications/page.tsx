"use client";

import { Bell, Save } from "lucide-react";
import { useState } from "react";

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    orderCreated: true,
    orderCancelled: true,
    lowStock: true,
    newUser: false,
    systemError: true,
    emailNotification: true,
    pushNotification: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <Bell className="text-blue-600" />
        <div>
          <h1 className="font-semibold text-lg">Notification Settings</h1>
          <p className="text-sm text-gray-500">
            Cấu hình thông báo cho hệ thống
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        <Section title="Đơn hàng">
          <Toggle
            label="Đơn hàng mới"
            description="Gửi thông báo khi có đơn hàng mới"
            checked={settings.orderCreated}
            onChange={() => toggle("orderCreated")}
          />
          <Toggle
            label="Huỷ đơn hàng"
            description="Thông báo khi đơn hàng bị huỷ"
            checked={settings.orderCancelled}
            onChange={() => toggle("orderCancelled")}
          />
        </Section>

        <Section title="Kho & sản phẩm">
          <Toggle
            label="Sắp hết hàng"
            description="Cảnh báo khi tồn kho dưới mức cho phép"
            checked={settings.lowStock}
            onChange={() => toggle("lowStock")}
          />
        </Section>

        <Section title="Người dùng">
          <Toggle
            label="Người dùng mới"
            description="Thông báo khi có tài khoản mới đăng ký"
            checked={settings.newUser}
            onChange={() => toggle("newUser")}
          />
        </Section>

        <Section title="Hệ thống">
          <Toggle
            label="Lỗi hệ thống"
            description="Nhận thông báo khi hệ thống xảy ra lỗi"
            checked={settings.systemError}
            onChange={() => toggle("systemError")}
          />
        </Section>

        <Section title="Kênh nhận thông báo">
          <Toggle
            label="Email"
            description="Nhận thông báo qua email"
            checked={settings.emailNotification}
            onChange={() => toggle("emailNotification")}
          />
          <Toggle
            label="Push Notification"
            description="Nhận thông báo qua trình duyệt"
            checked={settings.pushNotification}
            onChange={() => toggle("pushNotification")}
          />
        </Section>
      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm flex items-center gap-2">
          <Save size={16} /> Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

const Section = ({ title, children }: any) => (
  <div className="space-y-4">
    <h2 className="text-xs font-bold uppercase text-gray-500">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }: any) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors \
        ${checked ? "bg-black" : "bg-gray-300"}`}
    >
      <span
        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform \
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </div>
);
