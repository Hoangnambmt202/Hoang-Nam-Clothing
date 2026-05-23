"use client";

import {
  Share2,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Save,
} from "lucide-react";
import { useState } from "react";

export default function SocialSettingsPage() {
  const [socials, setSocials] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    enableShare: true,
  });

  const update = (key: string, value: any) => {
    setSocials((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <Share2 className="text-pink-600" />
        <div>
          <h1 className="font-semibold text-lg text-black">Social Settings</h1>
          <p className="text-sm text-gray-500">Quản lý mạng xã hội & chia sẻ</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        <Section title="Liên kết mạng xã hội">
          <Input
            icon={<Facebook size={16} />}
            label="Facebook"
            placeholder="https://facebook.com/yourpage"
            value={socials.facebook}
            onChange={(v: string) => update("facebook", v)}
          />
          <Input
            icon={<Instagram size={16} />}
            label="Instagram"
            placeholder="https://instagram.com/yourprofile"
            value={socials.instagram}
            onChange={(v: string) => update("instagram", v)}
          />
          <Input
            icon={<Twitter size={16} />}
            label="Twitter / X"
            placeholder="https://x.com/yourprofile"
            value={socials.twitter}
            onChange={(v: string) => update("twitter", v)}
          />
          <Input
            icon={<Youtube size={16} />}
            label="Youtube"
            placeholder="https://youtube.com/yourchannel"
            value={socials.youtube}
            onChange={(v: string) => update("youtube", v)}
          />
        </Section>

        <Section title="Chia sẻ sản phẩm">
          <Toggle
            label="Bật nút chia sẻ"
            description="Cho phép chia sẻ sản phẩm lên mạng xã hội"
            checked={socials.enableShare}
            onChange={() => update("enableShare", !socials.enableShare)}
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

const Input = ({ icon, label, placeholder, value, onChange }: any) => (
  <div>
    <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-md px-3 py-2 pl-10 text-sm focus:ring-1 focus:ring-black outline-none"
      />
    </div>
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
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${checked ? "bg-black" : "bg-gray-300"}`}
    >
      <span
        className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  </div>
);
