"use client";

import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Save,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

export default function SecuritySettingsPage() {
  const [settings, setSettings] = useState({
    twoFactorAuth: true,
    forceStrongPassword: true,
    sessionTimeout: 30,
    loginAlert: true,
    ipWhitelist: false,
  });

  const update = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <Shield className="text-red-600" />
        <div>
          <h1 className="font-semibold text-lg">Security Settings</h1>
          <p className="text-sm text-gray-500">
            Cấu hình bảo mật và truy cập hệ thống
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        <Section title="Xác thực & đăng nhập">
          <Toggle
            icon={<Smartphone size={16} />}
            label="Xác thực hai lớp (2FA)"
            description="Yêu cầu mã OTP khi đăng nhập"
            checked={settings.twoFactorAuth}
            onChange={() => update("twoFactorAuth", !settings.twoFactorAuth)}
          />
          <Toggle
            icon={<Key size={16} />}
            label="Mật khẩu mạnh"
            description="Bắt buộc sử dụng mật khẩu có độ phức tạp cao"
            checked={settings.forceStrongPassword}
            onChange={() =>
              update("forceStrongPassword", !settings.forceStrongPassword)
            }
          />
        </Section>

        <Section title="Phiên làm việc">
          <Input
            icon={<Lock size={16} />}
            label="Thời gian hết hạn phiên (phút)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(v: any) => update("sessionTimeout", Number(v))}
          />
        </Section>

        <Section title="Cảnh báo & hạn chế">
          <Toggle
            icon={<AlertTriangle size={16} />}
            label="Cảnh báo đăng nhập bất thường"
            description="Gửi thông báo khi có đăng nhập từ thiết bị lạ"
            checked={settings.loginAlert}
            onChange={() => update("loginAlert", !settings.loginAlert)}
          />
          <Toggle
            icon={<Shield size={16} />}
            label="IP Whitelist"
            description="Chỉ cho phép truy cập từ IP được chỉ định"
            checked={settings.ipWhitelist}
            onChange={() => update("ipWhitelist", !settings.ipWhitelist)}
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

const Toggle = ({ icon, label, description, checked, onChange }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-400">{icon}</div>
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <button
      onClick={onChange}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${checked ? "bg-black" : "bg-gray-300"}`}
    >
      <span
        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </div>
);

const Input = ({ icon, label, type, value, onChange }: any) => (
  <div>
    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-md px-3 py-2 pl-10 text-sm focus:ring-1 focus:ring-black outline-none"
      />
    </div>
  </div>
);
